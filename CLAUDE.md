# ComfyUI MCP 项目规范

## 项目概述

ComfyUI MCP 是一个 Model Context Protocol 服务器，用于动态加载和执行 ComfyUI 工作流，使 AI 助手能够调用各种图像、视频、音频生成和处理工作流。

## 重要规范

### Negative Prompt 使用规范

**关键原则：** `negative_prompt` 参数必须直接列出不需要的内容，不使用否定词。

#### ✅ 正确格式
```json
{
  "negative_prompt": "建筑，楼阁，人物，模糊，低质量"
}
```

#### ❌ 错误格式
```json
{
  "negative_prompt": "不要建筑，不要楼阁，不要人物"
}
```

**原因说明：** AI 模型自动将 negative_prompt 中的内容理解为需要避免的元素，添加"不要"等否定词会造成语义混淆，降低生成效果。

详细规范请参考：[docs/negative_prompt_guide.md](docs/negative_prompt_guide.md)

## 工作流开发规范

### 1. 目录结构
```
workflows/
├── text-to-image/       # 文生图工作流
├── image-to-image/      # 图像编辑工作流
├── image-to-video/      # 图生视频工作流
├── text-to-video/       # 文生视频工作流
├── text-to-audio/       # 文生音频工作流
└── audio-to-audio/      # 音频编辑工作流
```

### 2. 描述文件规范

每个工作流必须包含 `descriptor.json`，定义参数映射和工具描述：

```json
{
  "category": "text-to-image",
  "toolName": "工作流名称",
  "description": "详细的功能描述，包括特点、适用场景等",
  "parameters": [
    {
      "name": "参数名",
      "type": "类型",
      "description": "参数说明",
      "required": true/false,
      "default": "默认值",
      "path": "节点路径"
    }
  ]
}
```

### 3. 参数描述规范

- **positive_prompt**: 描述想要生成的内容
- **negative_prompt**: 直接列出不需要的元素（不用否定词）
- **数值参数**: 说明范围和效果（如 cfg: 1-10，控制提示词影响强度）
- **文件路径**: 说明支持的格式（如支持 jpg、png 等格式）

## 测试规范

在添加新工作流后，必须：
1. 测试基本功能是否正常
2. 验证所有必需参数
3. 检查默认值是否合理
4. 确认输出路径正确

## 文档规范

每个工作流应包含 README.md，包括：
1. 功能概述
2. 工作流特点
3. 主要参数说明
4. 使用示例
5. 注意事项

## 更新记录

- 2025-08-21: 创建项目规范文档
- 2025-08-21: 添加 negative_prompt 使用规范
- 2025-08-21: 修正所有不符合规范的 negative_prompt 用法