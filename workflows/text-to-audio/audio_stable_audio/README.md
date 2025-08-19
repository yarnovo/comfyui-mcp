# Stable Audio 音频生成工作流

## 概述
使用 Stable Audio Open 1.0 模型根据文本描述生成高质量的音乐和音效，支持多种音乐风格和声音类型。

## 工作流特点
- **模型**: Stable Audio Open 1.0
- **文本编码器**: T5-Base
- **音频时长**: 1-180秒
- **采样质量**: 高达50步精细采样
- **批量生成**: 支持一次生成多个音频

## 主要参数

### 必需参数
- **positive_prompt**: 描述想要生成的音频内容

### 音频设置
- **duration**: 音频时长（默认47.6秒）
- **batch_size**: 批次大小（1-8个音频）

### 生成控制
- **negative_prompt**: 排除不需要的音频特征
- **steps**: 采样步数（默认50）
- **cfg**: CFG强度（默认4.98）
- **denoise**: 去噪强度（默认1）
- **seed**: 随机种子

### 采样设置
- **sampler_name**: 采样器类型
- **scheduler**: 调度器算法

### 输出设置
- **filename_prefix**: 输出文件路径前缀

## 使用示例

### 电子音乐
```python
params = {
    "positive_prompt": "upbeat electronic dance music, 128 bpm, synthesizer, bass drop",
    "negative_prompt": "vocals, speech",
    "duration": 30,
    "cfg": 5
}
```

### 环境音效
```python
params = {
    "positive_prompt": "peaceful forest ambience, birds chirping, gentle wind, nature sounds",
    "negative_prompt": "music, drums, synthetic",
    "duration": 60,
    "steps": 70
}
```

### 古典音乐
```python
params = {
    "positive_prompt": "classical piano solo, romantic era, emotional, minor key",
    "negative_prompt": "electronic, modern, drums",
    "duration": 90,
    "cfg": 6
}
```

### 游戏音效
```python
params = {
    "positive_prompt": "8-bit retro game sound effects, coin collect, power up",
    "negative_prompt": "realistic, orchestral",
    "duration": 5,
    "batch_size": 4
}
```

## 提示词技巧

### 音乐风格描述
1. **风格类型**: electronic, classical, jazz, rock, ambient
2. **节奏速度**: 60 bpm, 120 bpm, slow, fast, allegro
3. **乐器指定**: piano, guitar, violin, synthesizer, drums
4. **情绪氛围**: happy, sad, energetic, peaceful, dramatic

### 音效描述
1. **环境音**: forest, ocean, city, rain, thunder
2. **动作音**: footsteps, door slam, glass break
3. **科幻音**: laser, spaceship, robot, alien
4. **游戏音**: coin, level up, game over, achievement

### 技术参数
1. **音质**: high quality, studio recording, professional
2. **混音**: stereo, surround, binaural
3. **音调**: major key, minor key, C major, A minor
4. **动态**: crescendo, diminuendo, forte, piano

## 参数优化建议

### 时长选择
- **1-5秒**: 短音效、提示音
- **10-30秒**: 音乐片段、铃声
- **30-60秒**: 完整音乐段落
- **60-180秒**: 长篇音乐作品

### CFG强度调整
- **低CFG (2-4)**: 更自由创意的生成
- **中CFG (4-7)**: 平衡的效果（推荐）
- **高CFG (7-10)**: 严格遵循提示词

### 步数与质量
- **10-20步**: 快速预览
- **30-50步**: 标准质量（推荐）
- **70-100步**: 高质量输出
- **100+步**: 极致细节

## 常见应用场景

### 音乐创作
1. **背景音乐**: 视频、游戏、应用配乐
2. **音乐素材**: 采样、循环、节拍
3. **风格探索**: 尝试不同音乐风格组合
4. **创意灵感**: 音乐创作的起点

### 音效制作
1. **游戏音效**: UI音效、动作音效、环境音
2. **影视音效**: Foley音效、氛围音效
3. **应用提示音**: 通知音、警告音、成功音
4. **播客素材**: 开场音乐、过渡音效

### 教育用途
1. **音乐教学**: 展示不同风格和乐器
2. **声音设计**: 学习音效制作原理
3. **创意实验**: 探索声音的可能性

## 输出说明
- 音频默认保存在 `audio/` 子目录
- 输出格式为高质量音频文件
- 支持批量生成多个变体
- 自动命名包含时间戳

## 注意事项
1. 较长的音频需要更多生成时间
2. 复杂的音乐结构可能需要更详细的提示词
3. 批量生成会成倍增加处理时间
4. 建议先用短时长测试提示词效果

## 提示词示例库

### 电子音乐类
- "ambient electronic, atmospheric pads, slow evolution"
- "techno beat, 140 bpm, heavy bass, industrial"
- "synthwave, retro 80s, nostalgic, neon vibes"

### 自然音效类
- "ocean waves, seagulls, peaceful beach morning"
- "thunderstorm, heavy rain, distant thunder"
- "campfire crackling, night crickets, wilderness"

### 乐器演奏类
- "acoustic guitar fingerstyle, intimate, warm tone"
- "grand piano, virtuoso performance, dramatic"
- "string quartet, baroque style, refined"

### 世界音乐类
- "traditional Japanese koto, peaceful, zen garden"
- "African drums, tribal rhythm, celebration"
- "Celtic harp, mystical, ancient melody"