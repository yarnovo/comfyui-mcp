# WAN 2.2 14B 双模型文本到视频工作流

## 概述

使用 WAN 2.2 14B 双模型架构从文本描述生成超高质量视频的专业工作流。采用创新的两阶段采样策略，实现业界领先的视频生成质量。

## 工作流特点

- **双模型架构**：使用两个14B参数模型协同工作
  - 高噪声模型：构建视频基础结构和运动模式
  - 低噪声模型：精炼细节和提升视觉质量
- **两阶段采样**：智能分配采样步数，优化生成过程
- **强大文本理解**：T5-XXL 编码器实现精确的语义理解
- **SD3 采样技术**：先进的采样算法确保稳定性
- **高质量输出**：640x640 默认分辨率，可扩展至更高
- **灵活配置**：支持自定义阶段切换点和参数

## 主要参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| positive_prompt | string | 必填 | 视频内容描述 |
| negative_prompt | string | null | 不想要出现的内容 |
| width | number | 640 | 视频宽度（256-1280像素） |
| height | number | 640 | 视频高度（256-1280像素） |
| length | number | 81 | 视频帧数（16-256帧） |
| fps | number | 16 | 帧率（8-60 fps） |
| steps | number | 20 | 总采样步数（10-50） |
| cfg | number | 3.5 | 提示词引导强度（1-20） |
| stage1_end_step | number | 10 | 第一阶段结束步数 |
| seed | number | 774388746670969 | 随机种子 |

## 使用示例

### 基础用法

```python
from comfyui_mcp import run_workflow

result = run_workflow(
    workflow_name="wan2_2_14b_t2v",
    positive_prompt="A beautiful sunset over ocean waves, golden light reflecting on water, seagulls flying in the distance, cinematic camera movement"
)
```

### 高级配置

```python
result = run_workflow(
    workflow_name="wan2_2_14b_t2v",
    positive_prompt="Close-up portrait of a person in rain, raindrops on face, soft lighting, emotional expression, slow motion",
    negative_prompt="blurry, static, low quality, distorted faces",
    width=640,
    height=640,
    length=128,  # 8秒视频 @ 16fps
    fps=16,
    steps=30,  # 更多步数以提升质量
    cfg=4.5,
    stage1_end_step=15,  # 调整阶段切换点
    seed=12345
)
```

### 专业场景示例

```python
# 电影级质感
result = run_workflow(
    workflow_name="wan2_2_14b_t2v",
    positive_prompt="Cinematic shot, dramatic lighting, film grain, anamorphic lens, shallow depth of field, professional color grading",
    steps=40,
    cfg=5
)

# 动作场景
result = run_workflow(
    workflow_name="wan2_2_14b_t2v",
    positive_prompt="Dynamic action sequence, fast camera movement, motion blur, explosive effects, high energy",
    stage1_end_step=12  # 更多步数用于结构生成
)

# 细节特写
result = run_workflow(
    workflow_name="wan2_2_14b_t2v",
    positive_prompt="Macro shot of water droplet falling, ultra detailed, slow motion, crystal clear, light refraction",
    steps=30,
    stage1_end_step=8  # 更多步数用于细节精炼
)
```

## 两阶段采样策略详解

### 第一阶段（高噪声模型）
- **目的**：建立视频的整体结构、运动轨迹和场景布局
- **特点**：更强的创造性和动态生成能力
- **步数**：默认0-10步，可通过 `stage1_end_step` 调整

### 第二阶段（低噪声模型）
- **目的**：精炼细节、提升清晰度、优化视觉质量
- **特点**：更精确的细节控制和质量提升
- **步数**：从 `stage1_end_step` 到总步数

### 优化建议
- **动作密集场景**：增加第一阶段步数（12-15）
- **细节丰富场景**：减少第一阶段步数（6-8）
- **平衡质量**：保持默认的10步切换点

## 提示词编写技巧

### 场景构建
```
"Indoor scene, warm lighting from window, cozy atmosphere, wooden furniture"
```

### 人物描述
```
"Young woman, gentle smile, rain on face, close-up shot, soft focus background"
```

### 镜头语言
```
"Camera slowly panning left, revealing vast landscape, dramatic sky"
```

### 艺术风格
```
"Cinematic color grading, film noir style, high contrast, moody lighting"
```

## 注意事项

1. **显存需求**：14B双模型需要较高显存，建议 24GB+
2. **生成时间**：两阶段处理需要更多时间，但质量显著提升
3. **参数平衡**：CFG值3.5为推荐值，过高可能导致过饱和
4. **阶段调整**：根据内容类型调整 `stage1_end_step`
5. **分辨率**：640x640 是质量和速度的最佳平衡点
6. **批处理**：建议 batch_size=1 以确保最佳质量

## 适用场景

- **专业视频制作**：广告、宣传片、电影预览
- **艺术创作**：实验影像、艺术短片、视觉诗歌
- **高端内容**：奢侈品展示、建筑可视化、概念设计
- **科研可视化**：科学模拟、数据可视化、教育演示
- **创意原型**：导演分镜、动画预览、创意提案
- **社交媒体**：高质量短视频、品牌内容、创意广告

## 性能优化

### 速度优化
- 降低分辨率至 512x512
- 减少总步数至 15
- 使用 euler 采样器

### 质量优化
- 增加步数至 30-40
- 提高分辨率至 768x768
- 调整 CFG 至 4-5
- 精细调整阶段切换点

### 显存优化
- 使用较小的 batch_size
- 降低分辨率
- 减少视频长度

## 模型信息

- **高噪声模型**: wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors
- **低噪声模型**: wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors
- **文本编码器**: umt5_xxl_fp8_e4m3fn_scaled.safetensors
- **VAE解码器**: wan_2.1_vae.safetensors
- **技术架构**: 双14B参数模型 + SD3采样 + 两阶段生成

## 常见问题

### Q: 为什么使用两个模型？
A: 高噪声模型擅长创建动态结构，低噪声模型擅长细节优化，协同工作达到最佳效果。

### Q: 如何选择阶段切换点？
A: 默认10步适合大多数场景。动作多用12-15步，静态细节多用6-8步。

### Q: 生成速度慢怎么办？
A: 可以减少步数至15，降低分辨率，或使用单模型工作流。

## 更新日志

- v1.0.0: 初始版本，支持 WAN 2.2 14B 双模型架构文本到视频生成