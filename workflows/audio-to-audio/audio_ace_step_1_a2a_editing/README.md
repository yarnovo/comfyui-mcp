# ACE Step v1 音频到音频编辑工作流

使用 ACE Step v1 3.5B 模型进行音频到音频编辑的专业工具。通过文本标签和歌词指导，对现有音频文件进行风格转换、内容修改或音乐重编排。

## 工作流特点

- **智能音频编辑**：基于现有音频文件进行精确编辑和风格转换
- **文本引导编辑**：通过标签和歌词描述指导音频修改方向
- **编辑强度控制**：通过 `denoise` 参数控制编辑程度，从微调到大幅改造
- **保持音频结构**：在编辑过程中保持原音频的基本时长和节拍结构
- **风格多样化**：支持各种音乐风格的转换，如动漫、J-Pop、电子音乐等
- **专业级质量**：采用SD3采样算法和先进的潜在扩散技术
- **高音质输出**：支持多种MP3质量等级，默认使用V0最高质量

## 主要参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `input_audio` | string | "" | 输入音频文件路径（必填） |
| `tags` | string | "" | 音乐风格标签，用逗号分隔（必填） |
| `lyrics` | string | "" | 歌词内容或音乐结构指导（必填） |
| `lyrics_strength` | number | 0.99 | 歌词强度控制(0-1) |
| `seed` | number | 938549746349002 | 随机种子 |
| `steps` | number | 50 | 采样步数 |
| `cfg` | number | 5 | 分类器引导强度 |
| `sampler_name` | string | "euler" | 采样器名称 |
| `scheduler` | string | "simple" | 调度器类型 |
| `denoise` | number | 0.3 | 编辑强度(0-1)，0.3为轻度编辑 |
| `shift` | number | 5 | SD3采样偏移值 |
| `multiplier` | number | 1.0 | 色调映射乘数 |
| `filename_prefix` | string | "audio/ComfyUI" | 输出文件名前缀 |
| `quality` | string | "V0" | MP3音质等级 |
| `output_dir` | string | （系统自动提供） | 输出目录 |

## 使用示例

### 音乐风格转换

```python
from comfyui_mcp import ComfyUIMCP

mcp = ComfyUIMCP()

# 将流行歌曲转换为动漫风格
result = mcp.run_audio_to_audio_workflow_audio_ace_step_1_a2a_editing(
    input_audio="/path/to/input/song.mp3",
    tags="anime, kawaii pop, j-pop, piano, guitar, cheerful, lighthearted",
    lyrics="[verse]\\n可爱的旋律\\n欢快的节拍\\n[chorus]\\n动漫风格的音乐",
    denoise=0.5,  # 中等编辑强度
    output_dir="/path/to/save/audio"
)
```

### 轻度音频优化

```python
# 对现有音频进行轻微调整和优化
result = mcp.run_audio_to_audio_workflow_audio_ace_step_1_a2a_editing(
    input_audio="/path/to/original.mp3",
    tags="enhanced, clear, professional, mastered",
    lyrics="[instrumental]\\n[optimized]\\n[enhanced clarity]",
    denoise=0.2,  # 轻度编辑，保持原始特征
    cfg=3,  # 较低的引导强度
    steps=30
)
```

### 音乐重新编排

```python
# 重新编排音乐结构
result = mcp.run_audio_to_audio_workflow_audio_ace_step_1_a2a_editing(
    input_audio="/path/to/song.mp3",
    tags="electronic, synthesizer, dance, remix, upbeat",
    lyrics="[intro remix]\\n[electronic beat]\\n[synth layers]\\n[dance rhythm]",
    denoise=0.7,  # 较强编辑，大幅改变风格
    cfg=7,
    steps=60,
    sampler_name="euler_a"
)
```

### 人声处理

```python
# 处理人声音频，增强表现力
result = mcp.run_audio_to_audio_workflow_audio_ace_step_1_a2a_editing(
    input_audio="/path/to/vocal.mp3",
    tags="vocal, enhanced, clear, expressive, emotional",
    lyrics="[verse]\\n情感丰富的人声\\n[chorus]\\n动人的旋律",
    denoise=0.3,
    lyrics_strength=0.8,
    quality="320"
)
```

## 编辑强度指南

### Denoise 参数设置建议

- **0.1-0.3（轻度编辑）**：细微调整，主要用于音质优化和轻微风格调整
- **0.4-0.6（中度编辑）**：明显的风格转换，但保留原音频的核心特征
- **0.7-0.9（重度编辑）**：大幅改变音频风格和特征，几乎重新创作
- **1.0（完全重建）**：基于输入音频的完全重新生成

## 标签建议

### 编辑类型
- `enhanced`, `optimized`, `mastered` - 音质优化
- `remix`, `rearranged`, `reimagined` - 重新编排
- `style_transfer`, `converted`, `transformed` - 风格转换

### 目标风格
- `anime`, `j-pop`, `kawaii pop` - 日系风格
- `electronic`, `synthesizer`, `edm` - 电子音乐
- `acoustic`, `organic`, `natural` - 原声风格
- `classical`, `orchestral`, `cinematic` - 古典风格

### 音频特征
- `vocal`, `instrumental`, `mixed` - 音频类型
- `clear`, `enhanced`, `professional` - 音质描述
- `emotional`, `expressive`, `dynamic` - 表现力描述

## 应用场景

1. **音乐后期制作**：对录制的音频进行风格化处理和优化
2. **风格转换**：将现有歌曲转换为不同的音乐风格
3. **音频修复**：修复和增强老旧或质量较低的音频文件
4. **创意重混**：基于原始音频创作新的版本和变体
5. **人声处理**：增强人声表现力和音质
6. **背景音乐制作**：将现有音乐改编为适合特定用途的背景音乐

## 注意事项

1. **输入音频**：支持常见音频格式（MP3、WAV等），建议使用高质量音频作为输入
2. **编辑强度**：开始时使用较低的 `denoise` 值，逐步调整到理想效果
3. **标签准确性**：提供准确的风格标签能显著提高编辑效果
4. **处理时间**：编辑强度越高，处理时间越长
5. **原始保留**：建议保留原始音频文件，以便多次尝试不同的编辑参数
6. **模型要求**：需要下载 `ace_step_v1_3.5b.safetensors` 模型文件

## 输出格式

- **音频格式**：MP3
- **采样率**：与输入音频保持一致或根据模型优化
- **质量**：支持VBR(V0-V9)和CBR(128-320kbps)
- **输出位置**：默认保存到 `audio/` 目录下
- **命名规则**：基于 `filename_prefix` 参数自动命名

这个音频编辑工作流特别适合需要对现有音频进行创意改造和专业处理的场景，通过精确的参数控制，可以实现从细微调整到完全风格转换的各种编辑效果。