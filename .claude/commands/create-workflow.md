# create-workflow

将 ComfyUI 导出的工作流 JSON 文件转换为符合 comfyui-mcp 规范的工作流。

## 使用方法

```
/create-workflow <原始json文件路径>
```

## 执行步骤

当用户执行此命令时，请按以下步骤操作：

### 1. 读取并分析工作流文件

使用 Read 工具读取用户指定的 JSON 文件，分析其结构：

- 识别主要节点类型（CLIPTextEncode、LoadImage、LoadVideo、LoadAudio、KSampler、SaveImage、VHS 等）
- 判断工作流类型（text-to-image、image-to-image、image-to-video、video-to-image、text-to-video、text-to-audio、audio-to-audio）
- 提取关键参数节点和路径

### 2. 自动判断工作流分类

根据节点组合判断分类：
- **text-to-image**: 有 CLIPTextEncode + EmptyLatentImage + SaveImage
- **image-to-image**: 有 LoadImage + CLIPTextEncode + SaveImage
- **image-to-video**: 有 LoadImage/图像输入 + 视频保存节点
- **video-to-image**: 有 LoadVideo/VHS相关节点 + SaveImage
- **text-to-video**: 有文本输入 + 视频保存节点
- **text-to-audio**: 有文本输入 + 音频保存节点
- **audio-to-audio**: 有音频输入 + 音频保存节点

### 3. 生成工作流名称

从文件名或模型名称自动生成合适的工作流名称：
- 如果有 CheckpointLoaderSimple，使用其模型名
- 否则使用文件名（去掉 .json 后缀）
- 转换为小写，替换空格为下划线

### 4. 识别参数并创建 descriptor.json

#### 通用参数识别规则：

**提示词参数：**
- 第一个 CLIPTextEncode 节点 → positive_prompt
- 第二个 CLIPTextEncode 节点 → negative_prompt

**尺寸参数：**
- EmptyLatentImage/EmptySD3LatentImage → width、height、batch_size

**采样参数：**
- KSampler/KSamplerAdvanced → seed、steps、cfg、denoise、sampler_name、scheduler
- RandomNoise → seed/noise_seed
- BasicScheduler → steps、denoise

**媒体输入参数：**
- LoadImage 节点 → 为对应参数添加 `subtype: "image"`
- LoadVideo/VHS 相关节点 → 为对应参数添加 `subtype: "video"`
- LoadAudio 相关节点 → 为对应参数添加 `subtype: "audio"`
- 支持多个媒体输入，参数名可自定义（如 input_image、start_image、end_image、input_video、input_audio 等）

**输出参数：**
- SaveImage → filename_prefix
- 视频保存节点（VHS等） → fps、format、codec、filename_prefix
- 音频保存节点（SaveAudio等） → quality、filename_prefix、相关音频参数

**⚠️ 重要：output_dir 参数说明**
- `output_dir` 参数由 comfyui-mcp 系统自动添加，**不要**在 descriptor.json 中定义
- 系统会在运行时自动注入此参数，用户可以选择性使用
- 虽然 README.md 的使用示例中可以展示 output_dir 参数的用法，但它不应出现在 descriptor.json 中

### 5. 生成高质量描述

参考 README.md 中的描述编写指南，生成包含以下要素的描述：
- 使用的模型名称
- 核心功能说明
- 技术特点
- 适用场景
- 关键能力

### 6. 创建文件结构

```
workflows/
└── [分类]/
    └── [工作流名称]/
        ├── workflow.json      # 移动原始文件到此
        ├── descriptor.json    # 生成参数描述
        └── README.md         # 生成文档
```

### 7. 生成 descriptor.json 内容

```json
{
  "description": "[基于分析生成的详细描述]",
  "category": "[自动判断的分类]",
  "parameters": [
    {
      "name": "[参数名]",
      "type": "[string/number]",
      "subtype": "[可选，'image'表示图片参数，'video'表示视频参数，'audio'表示音频参数]",
      "description": "[参考已有工作流的描述风格]",
      "required": [true/false],
      "path": "[节点ID.inputs.字段名]",
      "default": [默认值]
    }
  ]
}
```

**⚠️ 重要提醒：在 descriptor.json 中绝对不要包含以下参数：**
- `output_dir` - 由系统自动注入
- `output_name` - 由系统自动注入

**⚠️ 重要：参数默认值处理规则**

处理参数默认值时必须遵循以下规则：

1. **必填参数（required: true）**：
   - 正面提示词、输入图片路径、音频描述等关键输入参数
   - 默认值应设为空字符串 `""`，不要提供预设内容
   - 强制用户提供明确的输入

2. **非必填参数（required: false）**：
   - 负面提示词等影响生成结果的参数：设为 `null`
   - 技术参数（steps、cfg、seed、sampler等）：可以有合理的默认值
   - 输出参数（filename_prefix等）：可以有默认值

3. **特殊处理**：
   - T5-XXL 等辅助提示词：非必填，默认值设为 `null`
   - 尺寸参数（width、height）：可以有默认值（如 1024）
   - 批次参数（batch_size）：默认值通常为 1
   - **媒体文件参数**：必须添加相应的 subtype 标记：
     - 图片参数：`"subtype": "image"`
     - 视频参数：`"subtype": "video"`
     - 音频参数：`"subtype": "audio"`
   - 系统会根据 subtype 自动处理相应的文件上传功能

### 8. 生成 README.md

参考已有工作流的 README 格式，包含：
- 概述
- 工作流特点
- 主要参数表格（可以包含 output_dir，但需注明是系统自动提供）
- 使用示例（可以展示 output_dir 的用法）
- 注意事项

### 9. 参考已有工作流

读取 workflows 下的已有工作流，学习：
- 描述的写法
- 参数的命名规范
- 默认值的设置（特别注意必填参数不应有预设内容）
- README 的结构

特别参考相同分类下的工作流，确保参数默认值处理的一致性。

## 实施要点

1. **使用工具**：
   - 使用 Read 读取文件
   - 使用 Write/MultiEdit 创建文件
   - 使用 Bash 移动文件

2. **智能分析**：
   - 通过节点组合判断工作流类型
   - 识别常见节点模式
   - 自动提取参数路径

3. **质量保证**：
   - 生成的描述要详细且有价值
   - 参数描述要包含使用建议
   - README 要有实用的示例

4. **错误处理**：
   - 文件不存在时给出提示
   - JSON 格式错误时说明问题
   - 无法判断分类时询问用户

## 输出示例

```
✅ 成功创建工作流：flux_dev_model
📁 位置：workflows/text-to-image/flux_dev_model/
📝 已生成文件：
   - workflow.json (原始工作流)
   - descriptor.json (参数描述)
   - README.md (使用文档)

🔍 识别信息：
   - 分类：text-to-image
   - 模型：flux-dev.safetensors
   - 参数：8 个

🔧 工具名称：run_text_to_image_workflow_flux_dev_model

请检查生成的文件，必要时进行微调。
```