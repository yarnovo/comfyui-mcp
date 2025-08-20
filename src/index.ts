#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import { ComfyUIClient } from './comfyui-client.js';
import { WorkflowManager } from './workflow-manager.js';
import { setupProxy } from './utils.js';
import { Logger } from './logger.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const WORKFLOWS_DIR = process.env.WORKFLOWS_DIR || './workflows';
const COMFYUI_HOST = process.env.COMFYUI_HOST || 'localhost';
const COMFYUI_PORT = process.env.COMFYUI_PORT || '8000';
const BYPASS_PROXY = process.env.BYPASS_PROXY !== 'false';

class ComfyUIMCPServer {
  private server: Server;
  private comfyClient!: ComfyUIClient;
  private workflowManager: WorkflowManager;
  private logger: Logger;

  constructor() {
    // 使用项目根目录的 logs 文件夹
    const projectRoot = path.resolve(__dirname, '..');
    const logsDir = path.join(projectRoot, 'logs');
    this.logger = new Logger(logsDir);
    this.server = new Server(
      {
        name: 'comfyui-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.workflowManager = new WorkflowManager(WORKFLOWS_DIR);
    
    this.setupHandlers();
  }

  private async initializeComfyClient() {
    const host = COMFYUI_HOST;
    
    if (!host || host === 'localhost') {
      console.error('警告: COMFYUI_HOST 未设置或为 localhost');
      console.error('请运行 scripts/detect-wsl2-host.sh 获取正确的 IP 地址');
    }
    
    console.error(`ComfyUI 服务器: ${host}:${COMFYUI_PORT}`);
    console.error(`绕过代理: ${BYPASS_PROXY ? '是' : '否'}`);
    
    if (BYPASS_PROXY) {
      setupProxy(host);
    }
    
    this.comfyClient = new ComfyUIClient(host, COMFYUI_PORT);
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const workflows = await this.workflowManager.loadWorkflows();
      const tools: Tool[] = workflows.map(workflow => {
        // 将分类名称转换为下划线格式 (text-to-image -> text_to_image)
        const categoryName = workflow.category.replace(/-/g, '_');
        // 生成新的工具名称格式: run_{category}_workflow_{name}
        const toolName = `run_${categoryName}_workflow_${workflow.name}`;
        
        return {
          name: toolName,
          description: workflow.description || `运行 ComfyUI 工作流: ${workflow.name}`,
          inputSchema: this.workflowManager.getToolInputSchema(workflow),
        };
      });

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      this.logger.info(`收到工具调用请求: ${name}`, args);
      
      // 解析新的工具名称格式: run_{category}_workflow_{name}
      const toolNamePattern = /^run_(.+)_workflow_(.+)$/;
      const match = name.match(toolNamePattern);
      
      if (!match) {
        throw new Error(`未知工具: ${name}`);
      }

      const [, , workflowName] = match;
      const workflow = await this.workflowManager.getWorkflow(workflowName);
      
      if (!workflow) {
        this.logger.error(`工作流不存在: ${workflowName}`);
        throw new Error(`工作流不存在: ${workflowName}`);
      }

      this.logger.info(`执行工作流: ${workflowName}`, {
        parameters: workflow.parameters,
        inputs: args,
      });
      
      // 提取 output_dir 参数（如果提供）
      const { output_dir, ...workflowArgs } = args || {};
      
      // 处理工作流输入（支持自动上传图片）
      const processedWorkflow = await this.workflowManager.processWorkflowInputs(
        workflow,
        workflowArgs,  // 传入不包含 output_dir 的参数
        this.comfyClient  // 传入 client 以支持自动上传
      );
      
      this.logger.debug('处理后的工作流', processedWorkflow);
      
      // 确保 output_dir 是字符串类型或 undefined
      const outputDirectory = typeof output_dir === 'string' ? output_dir : undefined;
      if (outputDirectory) {
        this.logger.info(`使用自定义输出目录: ${outputDirectory}`);
      }

      try {
        // 准备参数信息，包括工作流信息和用户输入的参数
        const paramsInfo = {
          toolName: name,  // 使用完整的工具名称，如 run_audio_to_audio_workflow_audio_ace_step_1_a2a_editing
          workflowCategory: workflow.category,
          workflowDescription: workflow.description,
          inputParameters: workflowArgs  // 只保存用户实际输入的参数
        };
        
        // 传递参数信息以便保存到 JSON 文件
        const result = await this.comfyClient.executeWorkflow(processedWorkflow, outputDirectory, paramsInfo);
        this.logger.info('工作流执行成功', result);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        this.logger.error('工作流执行失败', {
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    });
  }

  async start() {
    await this.initializeComfyClient();
    await this.workflowManager.initialize();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ComfyUI MCP 服务器已启动');
  }
}

const server = new ComfyUIMCPServer();
server.start().catch(console.error);