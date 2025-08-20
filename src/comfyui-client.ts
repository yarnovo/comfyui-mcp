import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
// import { setupProxy } from './utils.js';  // 暂时未使用
import { Logger } from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComfyUIMessage {
  type: string;
  data: any;
}

interface QueuePromptResponse {
  prompt_id: string;
  number?: number;
  node_errors?: any;
}

export class ComfyUIClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private host: string;
  private port: string;
  private clientId: string;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000;
  private logger: Logger;

  constructor(host: string, port: string) {
    super();
    this.host = host;
    this.port = port;
    this.clientId = uuidv4();
    // 使用项目根目录的 logs 文件夹
    const projectRoot = path.resolve(__dirname, '..');
    const logsDir = path.join(projectRoot, 'logs');
    this.logger = new Logger(logsDir);
    this.logger.info('初始化 ComfyUIClient', { host, port, clientId: this.clientId });
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `ws://${this.host}:${this.port}/ws?clientId=${this.clientId}`;
      console.error(`连接到 ComfyUI WebSocket: ${wsUrl}`);
      this.logger.info('尝试连接 WebSocket', { url: wsUrl, clientId: this.clientId });

      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.error('WebSocket 连接已建立');
        this.logger.info('WebSocket 连接成功建立');
        this.connected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.ws.on('message', (data: Buffer) => {
        try {
          const messageStr = data.toString();
          this.logger.debug('收到 WebSocket 消息', { raw: messageStr.substring(0, 500) });
          const message: ComfyUIMessage = JSON.parse(messageStr);
          this.handleMessage(message);
        } catch (error) {
          console.error('解析消息失败:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error('解析 WebSocket 消息失败', { error: errorMessage, data: data.toString().substring(0, 500) });
        }
      });

      this.ws.on('close', (code, reason) => {
        console.error('WebSocket 连接已关闭');
        this.logger.warn('WebSocket 连接关闭', { code, reason: reason?.toString() });
        this.connected = false;
        this.ws = null;
        this.attemptReconnect();
      });

      this.ws.on('error', (error: any) => {
        console.error('WebSocket 错误:', error);
        this.logger.error('WebSocket 连接错误', { 
          error: error?.message || String(error), 
          stack: error?.stack,
          host: this.host,
          port: this.port 
        });
        reject(error);
      });
    });
  }

  private handleMessage(message: ComfyUIMessage) {
    switch (message.type) {
      case 'status':
        this.emit('status', message.data);
        break;
      case 'progress':
        this.emit('progress', message.data);
        break;
      case 'executing':
        this.emit('executing', message.data);
        break;
      case 'executed':
        this.emit('executed', message.data);
        break;
      case 'execution_error':
        this.emit('execution_error', message.data);
        break;
      case 'execution_cached':
        this.emit('execution_cached', message.data);
        break;
      case 'execution_success':
        this.emit('execution_success', message.data);
        break;
      case 'execution_start':
        this.emit('execution_start', message.data);
        break;
      default:
        console.error('未知消息类型:', message.type);
    }
  }

  private async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    console.error(`尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('重连失败:', error);
        this.logger.error('重连失败', { 
          error: (error as any)?.message || String(error),
          attempt: this.reconnectAttempts 
        });
      }
    }, this.reconnectDelay);
  }

  private async queuePrompt(workflow: any): Promise<QueuePromptResponse> {
    const url = `http://${this.host}:${this.port}/prompt`;
    
    const requestBody = {
      prompt: workflow,
      client_id: this.clientId,
    };
    
    this.logger.debug('发送工作流到 ComfyUI', {
      url,
      clientId: this.clientId,
      workflow: JSON.stringify(workflow, null, 2),
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    this.logger.debug('ComfyUI 响应', {
      status: response.status,
      body: responseText,
    });

    if (!response.ok) {
      this.logger.error('ComfyUI 请求失败', {
        status: response.status,
        body: responseText,
      });
      throw new Error(`HTTP 错误! 状态: ${response.status}, 响应: ${responseText}`);
    }

    const result = JSON.parse(responseText) as QueuePromptResponse;
    
    if (result.node_errors && Object.keys(result.node_errors).length > 0) {
      this.logger.error('工作流验证失败', result.node_errors);
    }
    
    return result;
  }

  private async getHistory(promptId: string): Promise<any> {
    const url = `http://${this.host}:${this.port}/history/${promptId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }

    const history = await response.json() as Record<string, any>;
    return history[promptId];
  }

  public async uploadImage(
    imagePath: string, 
    name?: string, 
    imageType: 'input' | 'output' | 'temp' = 'input', 
    overwrite: boolean = true
  ): Promise<string> {
    const fsPromises = await import('fs/promises');
    const path = await import('path');
    
    // 读取图片文件
    const imageBuffer = await fsPromises.readFile(imagePath);
    const fileName = name || path.basename(imagePath);
    
    // 创建 FormData
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', blob, fileName);
    formData.append('type', imageType);
    formData.append('overwrite', String(overwrite));
    
    const url = `http://${this.host}:${this.port}/upload/image`;
    
    this.logger.info('上传图片到 ComfyUI', { 
      url, 
      fileName, 
      imageType, 
      overwrite,
      originalPath: imagePath 
    });
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('上传图片失败', { 
        status: response.status, 
        error: errorText,
        fileName,
        url 
      });
      throw new Error(`上传图片失败: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json() as { name?: string; [key: string]: any };
    this.logger.info('图片上传成功', { 
      fileName, 
      result,
      imageType 
    });
    
    // 返回上传后的文件名（ComfyUI 可能会修改文件名）
    return result.name || fileName;
  }

  public async uploadVideo(
    videoPath: string, 
    name?: string, 
    videoType: 'input' | 'output' | 'temp' = 'input', 
    overwrite: boolean = true
  ): Promise<string> {
    const fsPromises = await import('fs/promises');
    const path = await import('path');
    
    // 读取视频文件
    const videoBuffer = await fsPromises.readFile(videoPath);
    const fileName = name || path.basename(videoPath);
    
    // 创建 FormData
    const formData = new FormData();
    const blob = new Blob([videoBuffer], { type: 'video/mp4' });
    formData.append('image', blob, fileName);  // ComfyUI 使用 'image' 字段，即使是视频文件
    formData.append('type', videoType);
    formData.append('overwrite', String(overwrite));
    
    const url = `http://${this.host}:${this.port}/upload/image`;  // 使用 /upload/image 端点
    
    this.logger.info('上传视频到 ComfyUI', { 
      url, 
      fileName, 
      videoType, 
      overwrite,
      originalPath: videoPath 
    });
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('上传视频失败', { 
        status: response.status, 
        error: errorText,
        fileName,
        url 
      });
      throw new Error(`上传视频失败: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json() as { name?: string; [key: string]: any };
    this.logger.info('视频上传成功', { 
      fileName, 
      result,
      videoType 
    });
    
    // 返回上传后的文件名（ComfyUI 可能会修改文件名）
    return result.name || fileName;
  }

  public async uploadAudio(
    audioPath: string, 
    name?: string, 
    audioType: 'input' | 'output' | 'temp' = 'input', 
    overwrite: boolean = true
  ): Promise<string> {
    const fsPromises = await import('fs/promises');
    const path = await import('path');
    
    // 读取音频文件
    const audioBuffer = await fsPromises.readFile(audioPath);
    const fileName = name || path.basename(audioPath);
    
    // 创建 FormData
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('image', blob, fileName);  // ComfyUI 使用 'image' 字段，即使是音频文件
    formData.append('type', audioType);
    formData.append('overwrite', String(overwrite));
    
    const url = `http://${this.host}:${this.port}/upload/image`;  // 使用 /upload/image 端点
    
    this.logger.info('上传音频到 ComfyUI', { 
      url, 
      fileName, 
      audioType, 
      overwrite,
      originalPath: audioPath 
    });
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('上传音频失败', { 
        status: response.status, 
        error: errorText,
        fileName,
        url 
      });
      throw new Error(`上传音频失败: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json() as { name?: string; [key: string]: any };
    this.logger.info('音频上传成功', { 
      fileName, 
      result,
      audioType 
    });
    
    // 返回上传后的文件名（ComfyUI 可能会修改文件名）
    return result.name || fileName;
  }

  private async downloadImage(filename: string, subfolder: string = '', type: string = 'output'): Promise<Buffer> {
    const params = new URLSearchParams({
      filename,
      subfolder,
      type
    });
    
    const url = `http://${this.host}:${this.port}/view?${params}`;
    this.logger.debug('下载图片', { url, filename, subfolder, type });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      this.logger.error('下载图片失败', { 
        status: response.status, 
        filename,
        url 
      });
      throw new Error(`下载图片失败: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async saveMediaToLocal(
    mediaBuffer: Buffer, 
    filename: string, 
    mediaType: 'images' | 'videos' | 'gifs' | 'audio' = 'images',
    customOutputDir?: string,
    inputParams?: Record<string, any>,
    sessionTimestamp?: string
  ): Promise<string> {
    // 从文件名中提取基础名称（去掉扩展名）
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    
    // 使用会话时间戳或创建新的
    const timestamp = sessionTimestamp || new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // 文件夹名 = 原始文件名 + 时间戳
    // 注意：不需要在 baseName 和 timestamp 之间添加下划线
    // 因为 ComfyUI 返回的文件名（如 ComfyUI_00303_）本身已包含末尾的下划线
    const folderName = `${baseName}${timestamp}`;
    
    let outputDir: string;
    
    if (customOutputDir) {
      // 使用用户指定的输出目录，加上文件夹名
      outputDir = path.join(customOutputDir, folderName);
    } else {
      // 使用默认的项目输出目录，按类型和文件夹名分组
      const projectRoot = path.resolve(__dirname, '..');
      outputDir = path.join(projectRoot, 'outputs', mediaType, folderName);
    }
    
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });
    
    // 将资源文件命名为 asset.扩展名
    const outputFilename = `asset${ext}`;
    
    const localPath = path.join(outputDir, outputFilename);
    await fs.writeFile(localPath, mediaBuffer);
    
    // 如果提供了输入参数，保存 input.json
    if (inputParams) {
      const jsonPath = path.join(outputDir, 'input.json');
      
      // 创建只包含 toolName 和 inputParameters 的 JSON 对象
      const paramsInfo: any = {};
      
      // 添加工具名称（如果存在）
      if (inputParams.toolName) {
        paramsInfo.toolName = inputParams.toolName;
      }
      
      // 添加输入参数
      if (inputParams.inputParameters) {
        paramsInfo.inputParameters = inputParams.inputParameters;
      } else {
        // 兼容旧格式，直接使用 inputParams 作为参数
        paramsInfo.inputParameters = inputParams;
      }
      
      await fs.writeFile(jsonPath, JSON.stringify(paramsInfo, null, 2), 'utf-8');
      
      this.logger.info('参数 JSON 文件已保存', {
        jsonPath,
        folder: folderName
      });
    }
    
    this.logger.info(`${mediaType} 已保存到本地`, { 
      originalName: filename, 
      localPath, 
      type: mediaType,
      folder: folderName 
    });
    
    return localPath;
  }

  public async executeWorkflow(workflow: any, outputDir?: string, inputParams?: Record<string, any>): Promise<any> {
    if (!this.connected) {
      await this.connect();
    }

    // 为这个执行会话创建统一的时间戳
    const sessionTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    const queueResult = await this.queuePrompt(workflow);
    
    if (queueResult.node_errors && Object.keys(queueResult.node_errors).length > 0) {
      this.logger.error('工作流验证错误详情', queueResult.node_errors);
      throw new Error(`工作流验证失败: ${JSON.stringify(queueResult.node_errors)}`);
    }

    const promptId = queueResult.prompt_id;
    console.error(`工作流已加入队列，提示 ID: ${promptId}`);

    return new Promise((resolve, reject) => {
      let executionStarted = false;
      let executionCompleted = false;
      const timeout = setTimeout(() => {
        if (!executionCompleted) {
          reject(new Error('工作流执行超时'));
        }
      }, 300000);

      const handleExecutionStart = (data: any) => {
        if (data.prompt_id === promptId) {
          executionStarted = true;
          console.error('工作流开始执行');
          this.logger.info('工作流开始执行', { promptId });
        }
      };

      const handleExecutionSuccess = async (data: any) => {
        if (data.prompt_id === promptId) {
          executionCompleted = true;
          clearTimeout(timeout);
          
          this.removeListener('execution_start', handleExecutionStart);
          this.removeListener('execution_success', handleExecutionSuccess);
          this.removeListener('execution_error', handleError);
          this.removeListener('executed', handleExecuted);
          
          try {
            const history = await this.getHistory(promptId) as any;
            console.error('工作流执行完成');
            this.logger.info('工作流执行成功完成', { promptId, outputs: history?.outputs });
            
            // 处理输出，下载媒体文件到本地
            const processedOutputs: any = {};
            for (const [nodeId, nodeOutput] of Object.entries(history?.outputs || {})) {
              const output = nodeOutput as any;
              
              // 处理图片输出（包括视频，因为 ComfyUI 视频节点也用 images 字段）
              if (output?.images && Array.isArray(output.images)) {
                const downloadedMedia = [];
                
                for (const mediaInfo of output.images) {
                  // 跳过临时预览图片
                  if (mediaInfo.type === 'temp') {
                    this.logger.info('跳过临时预览图片', { filename: mediaInfo.filename });
                    continue;
                  }
                  
                  try {
                    // 根据文件扩展名判断媒体类型
                    const ext = path.extname(mediaInfo.filename).toLowerCase();
                    let mediaType: 'images' | 'videos' | 'gifs' | 'audio' = 'images';
                    
                    if (['.mp4', '.webm', '.avi', '.mov', '.mkv'].includes(ext)) {
                      mediaType = 'videos';
                    } else if (['.gif'].includes(ext)) {
                      mediaType = 'gifs';
                    } else if (['.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aac'].includes(ext)) {
                      mediaType = 'audio';
                    }
                    
                    // 下载媒体文件
                    const mediaBuffer = await this.downloadImage(
                      mediaInfo.filename,
                      mediaInfo.subfolder || '',
                      mediaInfo.type || 'output'
                    );
                    
                    // 保存到对应的目录
                    const localPath = await this.saveMediaToLocal(mediaBuffer, mediaInfo.filename, mediaType, outputDir, inputParams, sessionTimestamp);
                    
                    // 添加本地路径到返回结果
                    downloadedMedia.push({
                      ...mediaInfo,
                      localPath,
                      mediaType
                    });
                    
                    console.error(`${mediaType === 'videos' ? '视频' : mediaType === 'gifs' ? 'GIF' : mediaType === 'audio' ? '音频' : '图片'}已下载并保存: ${localPath}`);
                  } catch (downloadError) {
                    this.logger.error('下载媒体文件时出错', {
                      filename: mediaInfo.filename,
                      error: (downloadError as any)?.message || String(downloadError)
                    });
                    // 即使下载失败，也保留原始信息
                    downloadedMedia.push(mediaInfo);
                  }
                }
                
                processedOutputs[nodeId] = { images: downloadedMedia };
              } 
              // 处理视频输出
              else if (output?.videos && Array.isArray(output.videos)) {
                const downloadedVideos = [];
                
                for (const videoInfo of output.videos) {
                  try {
                    // 下载视频
                    const videoBuffer = await this.downloadImage(
                      videoInfo.filename,
                      videoInfo.subfolder || '',
                      videoInfo.type || 'output'
                    );
                    
                    // 保存到本地
                    const localPath = await this.saveMediaToLocal(videoBuffer, videoInfo.filename, 'videos', outputDir, inputParams, sessionTimestamp);
                    
                    // 添加本地路径到返回结果
                    downloadedVideos.push({
                      ...videoInfo,
                      localPath
                    });
                    
                    console.error(`视频已下载并保存: ${localPath}`);
                  } catch (downloadError) {
                    this.logger.error('下载视频时出错', {
                      filename: videoInfo.filename,
                      error: (downloadError as any)?.message || String(downloadError)
                    });
                    // 即使下载失败，也保留原始信息
                    downloadedVideos.push(videoInfo);
                  }
                }
                
                processedOutputs[nodeId] = { videos: downloadedVideos };
              }
              // 处理 GIF 输出
              else if (output?.gifs && Array.isArray(output.gifs)) {
                const downloadedGifs = [];
                
                for (const gifInfo of output.gifs) {
                  try {
                    // 下载 GIF
                    const gifBuffer = await this.downloadImage(
                      gifInfo.filename,
                      gifInfo.subfolder || '',
                      gifInfo.type || 'output'
                    );
                    
                    // 保存到本地
                    const localPath = await this.saveMediaToLocal(gifBuffer, gifInfo.filename, 'gifs', outputDir, inputParams, sessionTimestamp);
                    
                    // 添加本地路径到返回结果
                    downloadedGifs.push({
                      ...gifInfo,
                      localPath
                    });
                    
                    console.error(`GIF 已下载并保存: ${localPath}`);
                  } catch (downloadError) {
                    this.logger.error('下载 GIF 时出错', {
                      filename: gifInfo.filename,
                      error: (downloadError as any)?.message || String(downloadError)
                    });
                    // 即使下载失败，也保留原始信息
                    downloadedGifs.push(gifInfo);
                  }
                }
                
                processedOutputs[nodeId] = { gifs: downloadedGifs };
              }
              // 处理音频输出（SaveAudio 节点可能使用 audio 字段）
              else if (output?.audio && Array.isArray(output.audio)) {
                const downloadedAudio = [];
                
                for (const audioInfo of output.audio) {
                  try {
                    // 下载音频
                    const audioBuffer = await this.downloadImage(
                      audioInfo.filename,
                      audioInfo.subfolder || '',
                      audioInfo.type || 'output'
                    );
                    
                    // 保存到本地
                    const localPath = await this.saveMediaToLocal(audioBuffer, audioInfo.filename, 'audio', outputDir, inputParams, sessionTimestamp);
                    
                    // 添加本地路径到返回结果
                    downloadedAudio.push({
                      ...audioInfo,
                      localPath,
                      mediaType: 'audio'
                    });
                    
                    console.error(`音频已下载并保存: ${localPath}`);
                  } catch (downloadError) {
                    this.logger.error('下载音频时出错', {
                      filename: audioInfo.filename,
                      error: (downloadError as any)?.message || String(downloadError)
                    });
                    // 即使下载失败，也保留原始信息
                    downloadedAudio.push(audioInfo);
                  }
                }
                
                processedOutputs[nodeId] = { audio: downloadedAudio };
              } else {
                // 其他类型输出，直接保留
                processedOutputs[nodeId] = output;
              }
            }
            
            resolve({
              promptId,
              status: 'completed',
              outputs: processedOutputs,
            });
          } catch (error) {
            reject(error);
          }
        }
      };

      const handleError = (data: any) => {
        if (data.prompt_id === promptId) {
          executionCompleted = true;
          clearTimeout(timeout);
          
          this.removeListener('execution_start', handleExecutionStart);
          this.removeListener('execution_success', handleExecutionSuccess);
          this.removeListener('execution_error', handleError);
          this.removeListener('executed', handleExecuted);
          
          reject(new Error(`工作流执行错误: ${JSON.stringify(data)}`));
        }
      };

      let executedOutputs: any = {};
      const handleExecuted = (data: any) => {
        if (data.prompt_id === promptId) {
          executedOutputs = { ...executedOutputs, ...data.output };
          this.logger.debug('收到节点执行输出', { promptId, nodeId: data.node, output: data.output });
        }
      };

      this.logger.info('注册事件监听器', { promptId });
      this.on('execution_start', handleExecutionStart);
      this.on('execution_success', handleExecutionSuccess);
      this.on('execution_error', handleError);
      this.on('executed', handleExecuted);

      this.on('progress', (data) => {
        if (executionStarted) {
          console.error(`进度: ${data.value}/${data.max}`);
          this.logger.info('工作流执行进度', { 
            promptId, 
            value: data.value, 
            max: data.max,
            percentage: Math.round((data.value / data.max) * 100) 
          });
        }
      });
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }
}