# WAN 2.2 5B 文本到视频工作流

## 概述

使用 WAN 2.2 5B 模型从文本描述直接生成高质量视频的专业工作流。这是一个纯文本到视频的先进解决方案，无需输入图片即可创建动态视频内容。

## 工作流特点

- **先进模型架构**：采用 WAN 2.2 5B 参数模型，专为视频生成优化
- **强大文本理解**：集成 T5-XXL 编码器，精确理解复杂场景描述
- **高质量输出**：支持高达 1280x704 分辨率的视频生成
- **灵活的时长控制**：可生成 16-256 帧的视频（约 0.6-10 秒）
- **SD3 采样技术**：使用 SD3 采样算法确保稳定的生成质量
- **批量生成支持**：可同时生成多个视频变体

## 主要参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| positive_prompt | string | 必填 | 视频内容描述，包括场景、动作、风格等 |
| negative_prompt | string | null | 不想要出现的内容 |
| width | number | 1280 | 视频宽度（256-1920像素） |
| height | number | 704 | 视频高度（256-1080像素） |
| length | number | 121 | 视频帧数（16-256帧） |
| fps | number | 24 | 帧率（8-60 fps） |
| steps | number | 20 | 采样步数（10-50） |
| cfg | number | 5 | 提示词引导强度（1-20） |
| seed | number | 898471028164125 | 随机种子 |

## 使用示例

### 基础用法

```python
from comfyui_mcp import run_workflow

result = run_workflow(
    workflow_name="wan2_2_ti2v_5b",
    positive_prompt="A serene mountain landscape at sunrise, camera slowly panning right, revealing a misty valley with birds flying across the golden sky"
)
```

### 高级配置

```python
result = run_workflow(
    workflow_name="wan2_2_ti2v_5b",
    positive_prompt="Cinematic shot of a futuristic city at night, neon lights reflecting on wet streets, camera tracking forward through bustling crowds",
    negative_prompt="blurry, static, low quality, distorted",
    width=1920,
    height=1080,
    length=240,  # 10秒视频 @ 24fps
    fps=24,
    steps=30,
    cfg=7,
    seed=12345
)
```

### 创意场景示例

```python
# 自然风光
result = run_workflow(
    workflow_name="wan2_2_ti2v_5b",
    positive_prompt="Timelapse of clouds moving over mountain peaks, dramatic lighting changes from dawn to dusk"
)

# 城市场景
result = run_workflow(
    workflow_name="wan2_2_ti2v_5b",
    positive_prompt="Busy street intersection in Tokyo, overhead view, people and cars moving in patterns, neon signs flickering"
)

# 抽象艺术
result = run_workflow(
    workflow_name="wan2_2_ti2v_5b",
    positive_prompt="Abstract colorful liquid forms morphing and flowing, psychedelic patterns emerging and dissolving"
)
```

## 提示词编写技巧

### 场景描述
- 明确描述环境、时间、天气等要素
- 例如："rainy night in cyberpunk city" 比 "city scene" 更有效

### 镜头运动
- 指定镜头移动方式：pan, zoom, track, orbit
- 例如："camera slowly zooming out revealing vast landscape"

### 动作描述
- 详细说明物体或人物的动作
- 例如："leaves gently swaying in the breeze" 

### 风格指定
- 添加艺术风格或视觉特征
- 例如："cinematic", "documentary style", "slow motion"

## 注意事项

1. **分辨率选择**：建议使用16的倍数以获得最佳效果
2. **帧数与时长**：length=24*秒数 可计算所需帧数
3. **采样步数**：增加步数可提升质量但会增加生成时间
4. **CFG值**：较高值（7-10）更严格遵循提示词，较低值（3-5）允许更多创造性
5. **负向提示词**：有效使用可显著提升视频质量
6. **种子值**：固定种子可复现相同结果，用于迭代优化

## 适用场景

- **创意视频制作**：音乐视频、艺术短片
- **概念可视化**：产品概念、建筑设计预览
- **教育内容**：科学演示、历史场景重现
- **社交媒体**：短视频内容、动态背景
- **游戏开发**：过场动画、环境展示
- **广告创意**：概念展示、情绪板

## 性能建议

- 高分辨率视频（1920x1080）建议使用 30+ 采样步数
- 长视频（>5秒）可能需要较多显存，建议适当降低分辨率
- 批量生成时注意显存占用，建议 batch_size ≤ 2

## 模型信息

- **UNet**: wan2.2_ti2v_5B_fp16.safetensors (5B参数)
- **CLIP**: umt5_xxl_fp8_e4m3fn_scaled.safetensors
- **VAE**: wan2.2_vae.safetensors
- **技术**: SD3 采样算法 + WAN 2.2 架构

## 更新日志

- v1.0.0: 初始版本，支持 WAN 2.2 5B 模型文本到视频生成