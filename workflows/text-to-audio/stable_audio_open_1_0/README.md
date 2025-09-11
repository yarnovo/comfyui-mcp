# Stable Audio Open 1.0 文本生成音频工作流

使用 Stable Audio Open 1.0 模型生成高质量音频的专业工具。基于开源的稳定音频生成技术，支持从文本描述创建各种类型的音频内容，包括音乐、音效和环境音。

## 工作流特点

- **开源稳定**：基于 Stable Audio Open 1.0 开源模型，技术稳定可靠
- **文本驱动**：通过详细的文本描述生成符合要求的音频内容
- **多样化内容**：支持音乐、音效、环境音等多种音频类型
- **精确时长控制**：可以精确控制生成音频的时长
- **高质量采样**：采用先进的潜在扩散技术确保音质
- **T5文本编码**：使用T5-base模型进行文本理解和编码
- **灵活采样器**：支持多种采样器和调度器选择

## 主要参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `positive_prompt` | string | "" | 正面提示词，描述想要的音频内容（必填） |
| `negative_prompt` | string | null | 负面提示词，列出不需要的元素 |
| `seconds` | number | 47.6 | 音频时长（秒） |
| `batch_size` | number | 1 | 批次大小 |
| `seed` | number | 133206429962582 | 随机种子 |
| `steps` | number | 50 | 采样步数 |
| `cfg` | number | 4.98 | 分类器引导强度 |
| `sampler_name` | string | "dpmpp_3m_sde_gpu" | 采样器名称 |
| `scheduler` | string | "exponential" | 调度器类型 |
| `denoise` | number | 1 | 去噪强度 |
| `filename_prefix` | string | "audio/ComfyUI" | 输出文件名前缀 |
| `output_dir` | string | （系统自动提供） | 输出目录 |

## 使用示例

### 音乐生成

```python
from comfyui_mcp import ComfyUIMCP

mcp = ComfyUIMCP()

# 生成电子舞曲
result = mcp.run_text_to_audio_workflow_stable_audio_open_1_0(
    positive_prompt="electronic dance music, upbeat, synthesizer, fast rhythm, energetic",
    seconds=60,
    output_dir="/path/to/save/audio"
)
```

### 环境音效生成

```python
# 生成自然环境音
result = mcp.run_text_to_audio_workflow_stable_audio_open_1_0(
    positive_prompt="forest sounds, birds chirping, gentle wind, nature ambience, peaceful",
    negative_prompt="urban noise, traffic, machinery",
    seconds=120,
    steps=60
)
```

### 乐器音乐生成

```python
# 生成钢琴音乐
result = mcp.run_text_to_audio_workflow_stable_audio_open_1_0(
    positive_prompt="classical piano, gentle melody, slow tempo, peaceful, emotional",
    seconds=90,
    cfg=6,
    sampler_name="euler"
)
```

### 音效设计

```python
# 生成特殊音效
result = mcp.run_text_to_audio_workflow_stable_audio_open_1_0(
    positive_prompt="sci-fi sound effects, laser beam, futuristic technology, digital sounds",
    seconds=30,
    steps=75,
    scheduler="karras"
)
```

## 提示词编写建议

### 音乐类型
- **电子音乐**：`electronic`, `synthesizer`, `EDM`, `techno`, `house`, `ambient`
- **古典音乐**：`classical`, `orchestra`, `piano`, `violin`, `symphony`, `chamber music`
- **流行音乐**：`pop`, `rock`, `jazz`, `blues`, `folk`, `country`
- **世界音乐**：`world music`, `ethnic`, `traditional`, `cultural`

### 乐器指定
- **键盘乐器**：`piano`, `organ`, `synthesizer`, `electric piano`
- **弦乐器**：`guitar`, `violin`, `cello`, `bass`, `harp`
- **管乐器**：`flute`, `saxophone`, `trumpet`, `clarinet`
- **打击乐器**：`drums`, `percussion`, `cymbals`, `timpani`

### 情绪氛围
- **愉快**：`happy`, `joyful`, `upbeat`, `cheerful`, `energetic`
- **平静**：`peaceful`, `calm`, `relaxing`, `meditative`, `gentle`
- **戏剧性**：`dramatic`, `intense`, `powerful`, `epic`, `cinematic`
- **神秘**：`mysterious`, `dark`, `atmospheric`, `haunting`

### 节奏特性
- **节奏**：`fast`, `slow`, `moderate tempo`, `steady rhythm`
- **动态**：`loud`, `soft`, `crescendo`, `diminuendo`
- **质感**：`smooth`, `rough`, `clean`, `distorted`

### 环境音效
- **自然**：`nature sounds`, `forest`, `ocean waves`, `rain`, `wind`
- **城市**：`urban ambience`, `traffic`, `crowd`, `industrial`
- **室内**：`room tone`, `echo`, `reverb`, `acoustic space`

## 技术参数调优

### 采样器选择
- `dpmpp_3m_sde_gpu`（默认）- 高质量GPU优化采样器
- `euler` - 快速简单的欧拉采样器
- `dpmpp_2m` - 平衡质量和速度
- `uni_pc` - 统一预测校正采样器

### 调度器选择
- `exponential`（默认）- 指数噪声调度
- `karras` - Karras噪声调度，适合高质量生成
- `simple` - 简单线性调度
- `normal` - 标准噪声调度

### CFG值建议
- **1-3**：更自然，创造性更强
- **4-6**：平衡的引导强度（推荐）
- **7-10**：严格遵循提示词
- **10+**：可能导致过度引导

## 注意事项

1. **必填参数**：`positive_prompt` 是必填参数，需要提供详细的音频描述
2. **提示词质量**：详细准确的提示词能显著提升生成质量
3. **时长控制**：建议根据内容复杂度合理设置时长
4. **硬件要求**：GPU优化采样器需要足够的显存支持
5. **模型文件**：需要下载 `stable-audio-open-1.0.safetensors` 和 `t5-base.safetensors`
6. **负面提示**：使用负面提示词时直接列出不需要的元素，不要使用否定词

## 输出格式

- **音频格式**：WAV（高质量原始格式）
- **采样率**：根据模型配置（通常为44.1kHz或48kHz）
- **位深度**：32位浮点
- **声道**：立体声
- **输出位置**：默认保存到 `audio/` 目录下
- **文件命名**：支持自定义文件名前缀

这个工作流特别适合音乐制作、音效设计、播客制作、游戏音频、广告配音和多媒体内容创作等专业应用场景。通过精心编写提示词，可以生成符合特定需求的高质量音频内容。