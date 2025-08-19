# ComfyUI MCP 服务器

这是一个 Model Context Protocol (MCP) 服务器，用于动态加载和执行 ComfyUI 工作流。它会自动扫描指定文件夹中的工作流，并将每个工作流作为独立的工具暴露给大模型。

## 功能特点

- 动态加载 ComfyUI 工作流文件夹
- 基于描述文件的参数映射系统
- 通过 WebSocket 监听工作流执行进度
- 支持 WSL2 环境（自动绕过代理）
- 灵活的参数配置和默认值
- 支持自定义输出目录

## 快速开始

### 1. 安装和构建

```bash
# 克隆或进入项目目录
cd comfyui-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 记录当前目录的绝对路径（后续配置需要）
pwd  # 例如：/home/username/comfyui-mcp
```

### 2. 配置环境

#### WSL2 用户：检测 Windows 主机 IP

```bash
bash scripts/detect-wsl2-host.sh
```

#### 创建配置文件

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# ComfyUI 工作流文件夹路径
WORKFLOWS_DIR=./workflows

# ComfyUI 服务器配置
COMFYUI_HOST=172.22.240.1  # WSL2 中的 Windows 主机 IP
COMFYUI_PORT=8000

# 绕过系统代理（WSL2 环境建议开启）
BYPASS_PROXY=true
```

### 3. 测试连接

```bash
node test-connection.js
```

### 4. 在 Claude Desktop 中配置

编辑 Claude Desktop 配置文件：

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

添加 MCP 服务器配置（使用绝对路径）：

```json
{
  "mcpServers": {
    "comfyui": {
      "command": "npx",
      "args": ["/absolute/path/to/comfyui-mcp"],
      "env": {
        "WORKFLOWS_DIR": "/absolute/path/to/comfyui-mcp/workflows",
        "COMFYUI_HOST": "172.22.240.1",
        "COMFYUI_PORT": "8000",
        "BYPASS_PROXY": "true"
      }
    }
  }
}
```

**示例配置（WSL2）**：
```json
{
  "mcpServers": {
    "comfyui": {
      "command": "npx",
      "args": ["/home/yarnb/xcan/comfyui-mcp"],
      "env": {
        "WORKFLOWS_DIR": "/home/yarnb/xcan/comfyui-mcp/workflows",
        "COMFYUI_HOST": "172.22.240.1",
        "COMFYUI_PORT": "8000",
        "BYPASS_PROXY": "true"
      }
    }
  }
}
```

**注意事项**：
- `WORKFLOWS_DIR` 必须是绝对路径
- `COMFYUI_HOST` 使用检测脚本获取的 IP
- 配置后需要重启 Claude Desktop

### 5. 验证安装

重启 Claude Desktop 后，在对话中输入：
```
使用 run_text_to_image_workflow_image_qwen_image 工具生成一张图片
```

### 6. 使用自定义输出目录

所有工具都支持指定输出目录参数：
```
使用 run_text_to_image_workflow_flux_schnell 工具生成图片，
prompt: "beautiful sunset", 
output_dir: "/home/username/my_images"
```

如果不指定 `output_dir`，文件将保存到默认的 `outputs` 目录。

## 工作流组织结构

工作流按照功能分类组织，每个工作流都在独立的文件夹中：

```
workflows/
├── text-to-image/              # 文本生成图像
│   ├── image_qwen_image/       # Qwen 模型
│   ├── image_omnigen2_t2i/     # OmniGen2 模型
│   └── flux_schnell/            # FLUX.1 Schnell 模型
├── image-to-image/             # 图像转图像
│   └── image2image/             # 图生图工作流
├── image-to-video/             # 图像生成视频
│   └── image_to_video_wan/     # WAN 2.1 模型
└── text-to-audio/              # 文本生成音频
    └── audio_stable_audio/      # Stable Audio 模型

每个工作流文件夹包含：
├── workflow.json               # ComfyUI 导出的工作流 JSON（统一命名）
├── descriptor.json             # 参数描述文件（包含分类信息）
└── README.md                   # 工作流详细说明（可选）
```

### 描述文件格式

`descriptor.json` 定义了工作流的参数及其在 JSON 中的路径：

```json
{
  "description": "工作流的描述",
  "parameters": [
    {
      "name": "prompt",           // 参数名称
      "type": "string",           // 参数类型（string/number/boolean）
      "subtype": "image",         // 子类型（可选，用于标识特殊参数如图片）
      "description": "描述词",    // 参数说明
      "required": true,           // 是否必需
      "path": "6.inputs.text",    // JSON 路径
      "default": "默认值"         // 默认值（可选）
    }
  ]
}
```

### 参数路径说明

`path` 字段使用点号分隔的路径来定位 JSON 中的值：
- `"6.inputs.text"` 对应 `workflow[6].inputs.text`
- `"3.inputs.seed"` 对应 `workflow[3].inputs.seed`

## 添加新工作流

### 步骤 1：导出 ComfyUI 工作流

1. 在 ComfyUI 中创建或打开工作流
2. 点击菜单 → Save (API Format)
3. 保存 JSON 文件

### 步骤 2：创建工作流文件夹

根据工作流类型选择正确的分类目录：
- `text-to-image/` - 文本生成图像
- `image-to-image/` - 图像转换
- `image-to-video/` - 图像生成视频  
- `text-to-audio/` - 文本生成音频

```bash
# 例如添加一个新的文生图工作流
mkdir workflows/text-to-image/my_workflow

# 复制工作流文件（必须命名为 workflow.json）
cp path/to/exported.json workflows/text-to-image/my_workflow/workflow.json
```

### 步骤 3：创建描述文件 (descriptor.json)

创建 `workflows/[category]/my_workflow/descriptor.json`：

```json
{
  "description": "详细的工具能力描述（参考下方编写指南）",
  "category": "text-to-image",
  "parameters": [
    {
      "name": "prompt",
      "type": "string",
      "description": "参数的详细说明，包含使用建议",
      "required": true,
      "path": "6.inputs.text",
      "default": "默认值示例"
    },
    {
      "name": "input_image",
      "type": "string",
      "subtype": "image",  // 标记为图片参数，系统会自动处理上传
      "description": "输入图片路径",
      "required": true,
      "path": "10.inputs.image",
      "default": ""
    }
  ]
}
```

### 📝 描述文件编写指南

#### 1. 工具描述 (description) 编写要点

**必须包含的信息：**
- **核心功能**：这个工具能做什么
- **技术特点**：使用什么模型/技术，有何独特优势
- **应用场景**：适合什么场景使用
- **关键参数**：重要的参数说明（如分辨率、时长等）
- **特殊要求**：如必须提供的输入

**⚠️ 重要：参数默认值处理规则**
- **必填参数（required: true）**：
  - 不应设置默认值，或设置为空字符串 `""`
  - 用户必须明确提供输入值
  - 例如：正面提示词、输入图片路径、音频描述等
- **非必填参数（required: false）**：
  - 影响创作结果的参数（如负面提示词）应设为 `null` 而非具体值
  - 技术参数（如 steps、cfg、seed）可以有合理的默认值
  - 避免预设内容影响用户的创作意图

**好的描述示例：**
```json
{
  "description": "使用 FLUX.1 Schnell 极速版模型，仅需4步即可生成高质量图像，是速度最快的文生图模型。特别优化了生成速度，适合需要快速预览、实时交互或批量生成的场景。虽然步数少但质量依然出色，支持1024x1024及更高分辨率。是快速原型设计的首选。"
}
```

**描述模板：**
```
使用 [模型名称] [核心功能描述]。[技术特点说明]。[适用场景列举]。[关键能力或限制]。[特殊说明]。
```

#### 2. 参数描述 (parameter description) 编写要点

**必须说明的内容：**
- 参数的作用
- 可接受的值或范围
- 对结果的影响
- 使用建议

**参数描述示例：**

```json
{
  "parameters": [
    {
      "name": "prompt",
      "description": "描述想要生成的图像内容，支持中英文，越详细效果越好"
    },
    {
      "name": "denoise", 
      "description": "去噪强度 (0-1)：0.1-0.3轻微修改，0.4-0.7中等变化，0.8-1.0大幅重绘"
    },
    {
      "name": "duration",
      "description": "音频时长（秒）：1-5秒短音效，10-30秒音乐片段，30-180秒完整作品"
    },
    {
      "name": "input_image",
      "type": "string",
      "subtype": "image",  // 重要：图片参数必须添加此标记
      "description": "输入图片的绝对路径，支持 jpg/png 等常见格式"
    }
  ]
}
```

**特殊参数类型说明：**

- **图片参数**：必须添加 `"subtype": "image"` 标记
  - 系统会自动检测并处理图片上传
  - 支持本地文件路径（自动上传）或已上传的文件名
  - 支持多个图片输入（如 start_image、end_image）

- **输出目录参数**（自动添加到所有工具）：
  - 参数名：`output_dir`
  - 类型：string（可选）
  - 功能：指定生成文件的保存位置
  - 示例：`"/home/username/project/assets"`
  - 默认：项目根目录下的 `outputs` 文件夹

#### 3. 分类选择指南

| 分类 | 说明 | 工具名称格式 |
|------|------|------------|
| text-to-image | 根据文本生成图像 | run_text_to_image_workflow_[name] |
| image-to-image | 修改或转换现有图像 | run_image_to_image_workflow_[name] |
| image-to-video | 静态图像转动态视频 | run_image_to_video_workflow_[name] |
| text-to-audio | 根据文本生成音频/音乐 | run_text_to_audio_workflow_[name] |

### 步骤 4：创建 README.md（可选但推荐）

为工作流创建详细文档 `workflows/[category]/my_workflow/README.md`：

```markdown
# 工作流名称

## 概述
工作流的详细介绍

## 工作流特点
- 特点1
- 特点2

## 主要参数
详细的参数说明

## 使用示例
具体的使用案例

## 注意事项
使用时的注意点
```

### 步骤 5：查找参数路径

1. 打开工作流 JSON 文件
2. 找到需要暴露的参数节点
3. 记录节点 ID 和输入字段名
4. 组合成路径格式：`节点ID.inputs.字段名`

例如，在 JSON 中找到：
```json
{
  "6": {
    "inputs": {
      "text": "提示词内容"
    }
  }
}
```
对应路径为：`6.inputs.text`

### 步骤 6：重启 Claude Desktop

添加新工作流后，需要重启 Claude Desktop 以重新加载工作流。

## 📚 描述编写最佳实践

### 让 AI 更好理解你的工具

#### ✅ 好的工具描述
```json
"description": "基于现有图像进行智能修改和风格转换的强大工具。可以将照片转换为不同艺术风格（油画、水彩、动漫等），修改图像内容（更换背景、改变季节、调整光线），或增强图像质量。通过调节去噪强度(denoise)精确控制修改程度，从轻微调整到完全重绘。必须提供输入图片路径。"
```

**为什么好？**
- 明确说明了工具的**核心能力**（修改、转换）
- 列举了**具体功能**（风格转换、内容修改、质量增强）
- 提供了**关键参数**说明（denoise）
- 强调了**必需输入**（图片路径）

#### ❌ 差的工具描述
```json
"description": "图生图工作流"
```

**为什么差？**
- 太简短，AI 不知道具体能做什么
- 没有说明使用场景
- 缺少技术特点

### 参数描述技巧

#### 1. 对于数值参数，提供范围和效果说明
```json
{
  "name": "cfg",
  "description": "CFG强度(1-20)：1-3创意自由，4-7平衡效果，8-20严格遵循提示"
}
```

#### 2. 对于文件路径，说明格式要求
```json
{
  "name": "input_image",
  "description": "输入图片的绝对路径，支持 jpg/png/webp 格式，建议分辨率不低于512x512"
}
```

#### 3. 对于选择型参数，列出所有选项
```json
{
  "name": "style",
  "description": "艺术风格：realistic(写实)、anime(动漫)、oil_painting(油画)、watercolor(水彩)"
}
```

#### 4. 对于复杂参数，提供示例
```json
{
  "name": "prompt",
  "description": "图像描述，示例：'阳光明媚的海滩，椰子树，蓝天白云，4K高清，专业摄影'"
}
```

### 常用描述词汇参考

**技术特点词汇：**
- 极速生成、高质量、专业级、优化版、增强版
- 智能识别、精确控制、自动优化、实时处理
- 支持批量、多格式兼容、高分辨率

**应用场景词汇：**
- 适合...场景、特别擅长...、专为...优化
- 创意设计、专业制作、快速原型、批量处理
- 个人创作、商业应用、教育演示

**能力描述词汇：**
- 可以...、支持...、能够...、实现...
- 生成、转换、修改、增强、优化、创建
- 自定义、调节、控制、设置

### ✔️ 添加工作流前的检查清单

在添加新工作流前，请确保：

- [ ] 工作流放在正确的分类文件夹中
- [ ] workflow.json 文件名正确
- [ ] descriptor.json 包含 category 字段
- [ ] 工具描述清晰说明了能力和使用场景
- [ ] 每个参数都有详细的描述
- [ ] 必需参数都标记为 required: true
- [ ] 提供了合理的默认值
- [ ] 参数路径 (path) 正确对应 JSON 节点
- [ ] （可选）创建了 README.md 详细文档

## 开发模式

### 本地开发

```bash
# 开发模式（自动重载）
npm run dev

# 重新构建
npm run build
```

### 直接运行

```bash
# 直接运行编译后的文件
node dist/index.js

# 或在 Claude 配置中使用
{
  "command": "node",
  "args": ["/absolute/path/to/comfyui-mcp/dist/index.js"]
}
```

## 故障排除

### Claude Desktop 无法找到工具

1. 确认项目路径正确（使用绝对路径）
2. 检查 Claude 配置文件格式是否正确
3. 查看 Claude 的开发者工具日志

### WSL2 连接问题

如果无法连接到 Windows 上的 ComfyUI：

1. 确保 ComfyUI 启动时使用 `--listen 0.0.0.0` 参数
2. 检查 Windows 防火墙是否允许端口访问
3. 运行 `scripts/detect-wsl2-host.sh` 重新检测 IP
4. 确保 `BYPASS_PROXY=true` 已设置

### 工作流加载失败

检查以下几点：
- 工作流文件夹名称与内部 JSON 文件名一致
- `descriptor.json` 格式正确
- JSON 路径与实际工作流结构匹配
- 查看控制台错误信息

### npx 执行错误

如果 `npx` 无法执行：

```bash
# 确保使用绝对路径
npx /home/username/comfyui-mcp

# 或直接使用 node
node /home/username/comfyui-mcp/dist/index.js
```

## 工作原理

1. **工作流加载**：启动时扫描 `workflows` 文件夹的分类目录，加载所有工作流
2. **工具注册**：每个工作流注册为 `run_{category}_workflow_{name}` 格式的工具
   - 例如：`run_text_to_image_workflow_flux_schnell`
   - 例如：`run_image_to_video_workflow_image_to_video_wan`
3. **参数处理**：接收输入参数，根据描述文件的路径映射修改工作流 JSON
4. **执行监控**：通过 WebSocket 连接 ComfyUI，监听执行进度
5. **结果返回**：执行完成后返回生成结果

## 示例工作流

项目包含多个分类的工作流，每个工具名称包含其分类信息：

### 文本生成图像 (text-to-image)
- `run_text_to_image_workflow_image_qwen_image` - Qwen 模型
- `run_text_to_image_workflow_image_omnigen2_t2i` - OmniGen2 模型  
- `run_text_to_image_workflow_flux_schnell` - FLUX.1 Schnell 模型

### 图像转图像 (image-to-image)
- `run_image_to_image_workflow_image2image` - 图生图工作流

### 图像生成视频 (image-to-video)
- `run_image_to_video_workflow_image_to_video_wan` - WAN 2.1 模型

### 文本生成音频 (text-to-audio)
- `run_text_to_audio_workflow_audio_stable_audio` - Stable Audio 模型

使用示例：
```
# 文本生成图像
run_text_to_image_workflow_flux_schnell:
  positive_prompt: "一个美丽的风景画"
  width: 1024
  height: 1024

# 图像转图像
run_image_to_image_workflow_image2image:
  input_image: "/path/to/image.jpg"
  positive_prompt: "油画风格"
  denoise: 0.6
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `WORKFLOWS_DIR` | 工作流文件夹路径 | `./workflows` |
| `COMFYUI_HOST` | ComfyUI 服务器地址 | `localhost` |
| `COMFYUI_PORT` | ComfyUI 服务器端口 | `8000` |
| `BYPASS_PROXY` | 是否绕过系统代理 | `true` |

## 许可证

MIT