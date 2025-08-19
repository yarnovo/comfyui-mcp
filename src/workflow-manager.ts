import fs from 'fs/promises';
import path from 'path';
import type { ComfyUIClient } from './comfyui-client.js';

interface WorkflowParameter {
  name: string;
  type: string;
  subtype?: string;  // 可选的子类型，如 'image' 表示图片参数
  description: string;
  required: boolean;
  path?: string;  // 改为可选，因为 input_image 参数需要特殊处理
  default?: any;
}

interface WorkflowDescriptor {
  description: string;
  parameters: WorkflowParameter[];
  category: string;  // 分类字段（必需）
}

interface WorkflowConfig {
  name: string;
  description: string;
  category: string;  // 分类字段（必需）
  api: any;
  parameters: WorkflowParameter[];
  descriptor: WorkflowDescriptor;
}

export class WorkflowManager {
  private workflowsDir: string;
  private workflows: Map<string, WorkflowConfig> = new Map();

  constructor(workflowsDir: string) {
    this.workflowsDir = workflowsDir;
  }

  async initialize() {
    try {
      await fs.access(this.workflowsDir);
    } catch {
      console.error(`创建工作流目录: ${this.workflowsDir}`);
      await fs.mkdir(this.workflowsDir, { recursive: true });
    }
  }

  async loadWorkflows(): Promise<WorkflowConfig[]> {
    this.workflows.clear();
    
    try {
      const entries = await fs.readdir(this.workflowsDir, { withFileTypes: true });
      
      // 第一层目录都是分类文件夹
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const category = entry.name;
          const categoryPath = path.join(this.workflowsDir, category);
          const subEntries = await fs.readdir(categoryPath, { withFileTypes: true });
          
          // 加载分类文件夹中的所有工作流
          for (const subEntry of subEntries) {
            if (subEntry.isDirectory()) {
              await this.loadWorkflowFromFolder(subEntry.name, category);
            }
          }
        } else if (entry.name === '.gitkeep') {
          // 忽略 .gitkeep 文件
          continue;
        }
      }
      
      console.error(`总共加载了 ${this.workflows.size} 个工作流`);
    } catch (error) {
      console.error('读取工作流目录失败:', error);
    }
    
    return Array.from(this.workflows.values());
  }

  private async loadWorkflowFromFolder(folderName: string, category: string) {
    const folderPath = path.join(this.workflowsDir, category, folderName);
    
    try {
      // 读取描述文件
      const descriptorPath = path.join(folderPath, 'descriptor.json');
      const descriptorContent = await fs.readFile(descriptorPath, 'utf-8');
      const descriptor: WorkflowDescriptor = JSON.parse(descriptorContent);
      
      // 读取工作流文件（统一命名为 workflow.json）
      const workflowPath = path.join(folderPath, 'workflow.json');
      const workflowContent = await fs.readFile(workflowPath, 'utf-8');
      const api = JSON.parse(workflowContent);
      
      const workflow: WorkflowConfig = {
        name: folderName,
        description: descriptor.description || `ComfyUI 工作流: ${folderName}`,
        category: category,  // 使用文件夹分类
        api: api,
        parameters: descriptor.parameters || [],
        descriptor: descriptor,
      };
      
      this.workflows.set(workflow.name, workflow);
      console.error(`已加载工作流: ${workflow.name} (分类: ${workflow.category})`);
    } catch (error) {
      console.error(`加载工作流文件夹 ${folderName} 失败:`, error);
    }
  }


  async processWorkflowInputs(
    workflow: WorkflowConfig, 
    inputs: Record<string, any>,
    client?: ComfyUIClient
  ): Promise<any> {
    const processedApi = JSON.parse(JSON.stringify(workflow.api));
    
    // 处理基于路径的参数
    for (const param of workflow.parameters) {
      const inputValue = inputs[param.name];
      
      // 通过 subtype 识别图片参数
      if (param.subtype === 'image' && inputValue && client) {
        let imageName = inputValue;
        
        // 智能判断：如果是绝对路径就上传，如果是文件名（带后缀）就直接使用
        if (path.isAbsolute(inputValue)) {
          // 是绝对路径，检查文件是否存在并上传
          try {
            await fs.access(inputValue);
            console.error(`检测到本地图片路径，开始上传: ${inputValue}`);
            imageName = await client.uploadImage(inputValue);
            console.error(`图片上传成功，文件名: ${imageName}`);
          } catch (error) {
            console.error(`图片文件不存在或上传失败: ${inputValue}`);
            throw new Error(`无法访问或上传图片文件: ${inputValue}`);
          }
        } else if (inputValue.includes('.')) {
          // 包含后缀，认为是已存在的图片名称
          console.error(`使用已存在的 ComfyUI 图片: ${inputValue}`);
        } else {
          // 既不是路径也不包含后缀，可能格式有误
          console.error(`警告：图片参数 ${param.name} 格式可能有误: ${inputValue}`);
        }
        
        // 使用 path 字段更新值
        if (param.path) {
          this.setValueByPath(processedApi, param.path, imageName);
        } else {
          console.error(`警告：图片参数 ${param.name} 缺少 path 字段`);
        }
      } else if (param.path) {
        // 处理其他参数
        const value = inputValue !== undefined ? inputValue : param.default;
        if (value !== undefined) {
          this.setValueByPath(processedApi, param.path, value);
        }
      }
    }
    
    // 如果有种子参数且值为 -1，生成随机种子
    const seedParam = workflow.parameters.find(p => p.name === 'seed');
    if (seedParam && seedParam.path && inputs.seed === -1) {
      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      this.setValueByPath(processedApi, seedParam.path, randomSeed);
    }
    
    return processedApi;
  }

  private setValueByPath(obj: any, path: string, value: any) {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  async getWorkflow(name: string): Promise<WorkflowConfig | undefined> {
    if (this.workflows.size === 0) {
      await this.loadWorkflows();
    }
    return this.workflows.get(name);
  }

  // 生成工具的输入模式
  getToolInputSchema(workflow: WorkflowConfig): any {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    for (const param of workflow.parameters) {
      properties[param.name] = {
        type: param.type,
        description: param.description,
      };
      
      if (param.default !== undefined) {
        properties[param.name].default = param.default;
      }
      
      if (param.required) {
        required.push(param.name);
      }
    }
    
    // 自动为所有工具添加 output_dir 参数
    properties['output_dir'] = {
      type: 'string',
      description: '指定输出文件的保存目录（绝对路径）。如果不提供，将保存到默认的 outputs 目录',
    };
    
    return {
      type: 'object',
      properties,
      required,
    };
  }
}