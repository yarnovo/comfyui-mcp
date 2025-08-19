# ACE Step v1 纯器乐音乐生成工作流

使用 ACE Step v1 3.5B 模型生成高质量纯音乐器乐的专业工具。基于标签和歌词描述，能够生成各种风格的器乐作品，如动漫音乐、J-Pop、电子音乐等。

## 工作流特点

- **专业音乐生成**：采用 ACE Step v1 3.5B 模型，专门优化用于音乐创作
- **风格多样化**：支持动漫音乐、J-Pop、电子音乐、钢琴独奏等多种风格
- **精确控制**：通过歌词强度参数精确控制音乐表现力
- **器乐专精**：特别适合生成纯器乐版本和背景音乐
- **高音质输出**：支持多种MP3质量等级，默认使用V0最高质量
- **先进技术**：结合SD3采样算法和Reinhard色调映射技术

## 主要参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `tags` | string | "" | 音乐风格标签，用逗号分隔（必填） |
| `lyrics` | string | "" | 歌词内容或音乐结构指导（必填） |
| `lyrics_strength` | number | 0.99 | 歌词强度控制(0-1) |
| `seconds` | number | 30 | 音频时长（秒） |
| `batch_size` | number | 1 | 批次大小 |
| `seed` | number | 992669734658279 | 随机种子 |
| `steps` | number | 50 | 采样步数 |
| `cfg` | number | 5 | 分类器引导强度 |
| `sampler_name` | string | "euler" | 采样器名称 |
| `scheduler` | string | "simple" | 调度器类型 |
| `denoise` | number | 1 | 去噪强度 |
| `shift` | number | 5 | SD3采样偏移值 |
| `multiplier` | number | 1.0 | 色调映射乘数 |
| `filename_prefix` | string | "audio/ComfyUI" | 输出文件名前缀 |
| `quality` | string | "V0" | MP3音质等级 |
| `output_dir` | string | （系统自动提供） | 输出目录 |

## 使用示例

### 基础器乐生成

```python
from comfyui_mcp import ComfyUIMCP

mcp = ComfyUIMCP()

# 生成轻快的动漫风格钢琴曲
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_instrumentals(
    tags="anime, kawaii pop, j-pop, piano, guitar, cheerful, lighthearted",
    lyrics="[instrumental]\\n[piano intro]\\n[upbeat section]\\n[guitar bridge]",
    seconds=60,
    output_dir="/path/to/save/audio"
)
```

### 电子音乐制作

```python
# 生成快节奏电子器乐
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_instrumentals(
    tags="electronic, synthesizer, fast, energetic, dance, instrumental",
    lyrics="[instrumental]\\n[synth lead]\\n[bass drop]\\n[electronic drums]",
    lyrics_strength=0.95,
    seconds=45,
    cfg=6,
    steps=60
)
```

### 背景音乐创作

```python
# 生成轻柔的背景音乐
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_instrumentals(
    tags="ambient, soft, piano, strings, peaceful, background",
    lyrics="[instrumental]\\n[soft piano]\\n[string pads]\\n[gentle melody]",
    lyrics_strength=0.85,
    seconds=120,
    sampler_name="euler_a",
    quality="320"
)
```

## 标签建议

### 音乐风格
- `anime`, `j-pop`, `kawaii pop` - 日系动漫风格
- `electronic`, `synthesizer`, `edm` - 电子音乐
- `classical`, `piano`, `strings` - 古典音乐
- `jazz`, `blues`, `rock` - 其他流行风格

### 乐器类型
- `piano`, `guitar`, `violin`, `drums`
- `synthesizer`, `bass`, `flute`, `saxophone`

### 情绪氛围
- `happy`, `cheerful`, `energetic` - 欢快
- `peaceful`, `calm`, `relaxing` - 平静
- `dramatic`, `epic`, `intense` - 戏剧性

### 节奏特性
- `fast`, `slow`, `medium tempo`
- `upbeat`, `downtempo`

## 歌词结构标记

支持使用特殊标记来指导音乐结构：

- `[instrumental]` - 纯器乐段落
- `[intro]` / `[outro]` - 开头/结尾
- `[verse]` / `[chorus]` - 主歌/副歌结构
- `[bridge]` - 桥段
- `[break down]` - 分解段落
- `[drum fill]` - 鼓点填充
- `[piano solo]` / `[guitar solo]` - 乐器独奏

## 注意事项

1. **必填参数**：`tags` 和 `lyrics` 是必填参数，需要提供有意义的音乐描述
2. **歌词强度**：`lyrics_strength` 接近1时更严格遵循歌词描述，可以根据需要调整
3. **音频时长**：建议时长在30-120秒之间以获得最佳效果
4. **质量设置**：V0提供最高质量，320/256等提供固定比特率选项
5. **批次处理**：可以设置 `batch_size > 1` 来一次生成多个版本
6. **模型要求**：需要下载 `ace_step_v1_3.5b.safetensors` 模型文件

## 输出格式

- **音频格式**：MP3
- **采样率**：根据模型配置自动设置
- **质量**：支持VBR(V0-V9)和CBR(128-320kbps)
- **输出位置**：默认保存到 `audio/` 目录下

通过精心调整标签和歌词描述，这个工作流能够生成专业级的器乐音乐，特别适合需要高质量背景音乐和创意音频内容的场景。