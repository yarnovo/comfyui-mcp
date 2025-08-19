# ACE Step v1 带歌词音乐生成工作流

使用 ACE Step v1 3.5B 模型生成带歌词音乐的专业工具。支持多语言歌词创作（包括日文、中文、英文等），能够根据音乐风格标签和详细歌词内容生成高质量的完整歌曲作品。

## 工作流特点

- **多语言歌词支持**：支持日文、中文、英文等多种语言的歌词创作
- **完整歌曲结构**：支持包含主歌、副歌、桥段等完整歌曲结构的创作
- **专业音乐生成**：采用 ACE Step v1 3.5B 模型，专门优化用于音乐创作
- **风格多样化**：支持动漫音乐、J-Pop、流行音乐等多种音乐风格
- **歌词匹配度高**：通过歌词强度参数确保音乐与歌词内容高度匹配
- **高音质输出**：支持多种MP3质量等级，默认使用V0最高质量
- **先进技术**：结合SD3采样算法和Reinhard色调映射技术

## 主要参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `tags` | string | "" | 音乐风格标签，用逗号分隔（必填） |
| `lyrics` | string | "" | 歌词内容，支持多语言和结构标记（必填） |
| `lyrics_strength` | number | 0.99 | 歌词强度控制(0-1) |
| `seconds` | number | 120 | 音频时长（秒） |
| `batch_size` | number | 1 | 批次大小 |
| `seed` | number | 468254064217846 | 随机种子 |
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

### 日文动漫歌曲创作

```python
from comfyui_mcp import ComfyUIMCP

mcp = ComfyUIMCP()

# 生成日文动漫风格歌曲
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_song(
    tags="anime, soft female vocals, kawaii pop, j-pop, piano, guitar, synthesizer, cheerful",
    lyrics="""[intro]
ふわふわ　おみみが
ゆれるよ　かぜのなか

[verse]
きらきら　あおいめ
みつめる　せかいを
ふわふわ　しっぽは
おおきく　ゆれるよ

[chorus]
だいすき　フェネックガール
いつでも　そばにいるよ
やさしい　ひかりが
つつむよ　フェネックガール""",
    seconds=90,
    output_dir="/path/to/save/audio"
)
```

### 中文流行歌曲创作

```python
# 生成中文流行歌曲
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_song(
    tags="chinese pop, mandarin, soft vocals, piano, strings, emotional, romantic",
    lyrics="""[intro]
夜深了，星星在闪烁
想起你温柔的笑容

[verse]
走过春夏秋冬的路
每一步都有你陪伴
风雨中你给我力量
让我勇敢面对明天

[chorus]
爱就像阳光照进心房
温暖着我的每一天
无论走到哪里都不会忘
你给我的那份爱""",
    lyrics_strength=0.95,
    seconds=150,
    steps=60
)
```

### 英文民谣歌曲创作

```python
# 生成英文民谣风格歌曲
result = mcp.run_text_to_audio_workflow_audio_ace_step_1_t2a_song(
    tags="folk, acoustic guitar, soft vocals, indie, storytelling, gentle",
    lyrics="""[verse]
Walking down this winding road
With memories in my mind
The autumn leaves are falling slow
Leaving summer far behind

[chorus]
Take me home, where the heart belongs
Where the rivers meet the sea
In that place where I grew strong
That's where I long to be

[bridge]
Time may change the way we are
But home will always call""",
    seconds=120,
    sampler_name="euler_a",
    cfg=4
)
```

## 标签建议

### 音乐风格
- `anime`, `j-pop`, `kawaii pop` - 日系动漫风格
- `chinese pop`, `mandarin`, `cantonese` - 中文流行
- `folk`, `indie`, `acoustic` - 民谣独立
- `pop`, `rock`, `ballad` - 流行摇滚

### 人声特性
- `soft female vocals`, `male vocals`, `chorus`
- `emotional`, `powerful`, `gentle`, `sweet`

### 乐器类型
- `piano`, `guitar`, `acoustic guitar`, `electric guitar`
- `strings`, `synthesizer`, `drums`, `bass`

### 情绪氛围
- `happy`, `cheerful`, `uplifting` - 欢快
- `emotional`, `romantic`, `nostalgic` - 抒情
- `energetic`, `powerful`, `inspiring` - 有力

### 节奏特性
- `fast`, `slow`, `medium tempo`
- `upbeat`, `ballad`, `gentle rhythm`

## 歌词结构标记

支持使用特殊标记来指导歌曲结构：

- `[intro]` / `[outro]` - 前奏/尾奏
- `[verse]` - 主歌段落
- `[chorus]` - 副歌段落
- `[bridge]` - 桥段
- `[pre-chorus]` - 预副歌
- `[interlude]` - 间奏
- `[breakdown]` - 分解段落
- `[hook]` - 钩子段落

## 多语言创作技巧

### 日文歌词
- 使用平假名和片假名增强可爱感
- 注意音节的节拍匹配
- 适合kawaii pop、anime等风格

### 中文歌词
- 注意声调与旋律的搭配
- 可以使用古风词汇增加韵味
- 适合流行、民谣、古风等风格

### 英文歌词
- 注意重音节拍的匹配
- 可以使用押韵增强音乐性
- 适合各种国际化音乐风格

## 注意事项

1. **必填参数**：`tags` 和 `lyrics` 是必填参数，需要提供完整的歌词内容
2. **歌词强度**：建议保持较高的 `lyrics_strength`（0.9-0.99）以确保歌词匹配度
3. **音频时长**：建议根据歌词长度设置合适的时长，通常60-180秒
4. **语言搭配**：歌词语言应与音乐风格标签相匹配
5. **结构完整**：使用结构标记可以生成更完整的歌曲作品
6. **模型要求**：需要下载 `ace_step_v1_3.5b.safetensors` 模型文件

## 输出格式

- **音频格式**：MP3
- **采样率**：根据模型配置自动设置
- **质量**：支持VBR(V0-V9)和CBR(128-320kbps)
- **输出位置**：默认保存到 `audio/` 目录下
- **文件命名**：支持自定义文件名前缀

通过精心编写歌词和调整音乐风格标签，这个工作流能够生成高质量的带歌词音乐作品，特别适合原创歌曲创作、音乐演示、虚拟歌手项目和多媒体内容制作等场景。