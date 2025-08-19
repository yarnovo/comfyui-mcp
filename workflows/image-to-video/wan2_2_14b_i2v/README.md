# WAN 2.2 14B 图像到视频生成工作流

## 概述

这是一个使用 WAN 2.2 14B 模型将单张静态图片转换为动态视频的专业工作流。只需提供一张图片和动作描述，即可生成流畅自然的视频动画，让静态图像"活"起来。

## 工作流特点

- **双阶段去噪架构**：采用高噪声和低噪声两个14B参数模型协同处理
- **智能动作生成**：基于文本描述自动生成合理的动作和镜头运动
- **高质量输出**：支持640x640分辨率，可生成最多81帧的流畅视频
- **单图输入**：仅需一张静态图片即可生成动态视频
- **灵活控制**：通过提示词精确控制动作类型和镜头效果

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| positive_prompt | string | ✅ | - | 描述视频中的动作和镜头运动 |
| negative_prompt | string | ❌ | null | 负向提示词，避免出现的内容 |
| input_image | string | ✅ | - | 输入的静态图片路径 |
| width | number | ❌ | 640 | 视频宽度（像素） |
| height | number | ❌ | 640 | 视频高度（像素） |
| length | number | ❌ | 81 | 视频帧数 |
| fps | number | ❌ | 16 | 视频帧率 |
| seed | number | ❌ | 1042664824122032 | 随机种子 |
| steps | number | ❌ | 20 | 采样步数 |
| cfg | number | ❌ | 3.5 | 分类器引导强度 |

## 使用示例

### 基础用法

```python
from comfyui_mcp import run_workflow

result = run_workflow(
    "wan2_2_14b_i2v",
    positive_prompt="人物缓慢转身，微笑着挥手，背景轻微晃动",
    input_image="/path/to/portrait.png"
)
```

### 高级用法

```python
result = run_workflow(
    "wan2_2_14b_i2v",
    positive_prompt="白龙战士站立不动，眼神充满决心和力量。镜头缓慢推进或环绕战士，凸显角色的强大气场和英雄气概",
    negative_prompt="静止不动，画面抖动，变形，模糊",
    input_image="/path/to/warrior.png",
    width=640,
    height=640,
    length=81,
    fps=24,
    steps=25,
    cfg=4.0
)
```

## 适用场景

1. **角色动画**
   - 人物肖像动态化
   - 角色动作展示
   - 表情变化动画

2. **产品展示**
   - 产品360度旋转
   - 功能演示动画
   - 材质细节展示

3. **场景动效**
   - 风景动态化
   - 建筑展示
   - 环境氛围营造

4. **创意内容**
   - 艺术作品动态化
   - 概念设计展示
   - 视觉特效制作

## 提示词编写技巧

### 镜头运动
- **推进/拉远**："camera slowly zooms in/out"
- **环绕**："camera circles around the subject"
- **平移**："camera pans left/right"
- **俯仰**："camera tilts up/down"

### 角色动作
- **微小动作**："subtle head movement", "gentle breathing"
- **表情变化**："slowly smiling", "eyes looking around"
- **肢体动作**："raising hand", "turning body"

### 环境效果
- **自然元素**："clouds drifting", "leaves swaying"
- **光影变化**："light shifting", "shadows moving"
- **氛围营造**："fog rolling in", "dust particles floating"

## 注意事项

1. **图片要求**
   - 使用高质量、清晰的输入图片
   - 避免过于复杂或杂乱的背景
   - 人物或主体应清晰可见

2. **提示词优化**
   - 使用具体、描述性的语言
   - 避免矛盾或不合理的动作描述
   - 可以结合镜头语言增强效果

3. **参数调节**
   - cfg 值建议在3-5之间，过高可能导致过度依赖提示词
   - steps 增加可提升细节但会延长生成时间
   - length 决定视频时长，建议根据动作复杂度调整

4. **性能考虑**
   - 该工作流使用14B参数模型，需要较大显存（建议16GB以上）
   - 支持 FP8 精度以优化内存使用
   - 生成时间与帧数成正比

## 模型信息

- **UNet 高噪声模型**: wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors
- **UNet 低噪声模型**: wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors
- **CLIP 模型**: umt5_xxl_fp8_e4m3fn_scaled.safetensors
- **VAE 模型**: wan_2.1_vae.safetensors

## 常见问题

**Q: 为什么生成的视频动作不明显？**
A: 尝试使用更具体的动作描述，增加 cfg 值，或选择动作潜力更大的输入图片。

**Q: 如何获得更流畅的动画？**
A: 增加 length 参数生成更多帧，或提高 fps 参数。

**Q: 视频中出现闪烁或抖动怎么办？**
A: 在负向提示词中添加 "flickering, jittering, unstable"，并适当降低 cfg 值。

## 更新日志

- v1.0.0 (2024-01) - 初始版本，支持 WAN 2.2 14B 模型图像到视频生成