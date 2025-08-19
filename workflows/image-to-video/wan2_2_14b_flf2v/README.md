# WAN 2.2 14B 首尾帧插值视频生成工作流

## 概述

这是一个使用 WAN 2.2 14B 模型实现首尾帧智能插值的专业视频生成工作流。通过提供起始帧和结束帧两张图片，工作流会自动生成中间的过渡帧，创建流畅自然的动画效果。

## 工作流特点

- **双阶段去噪架构**：采用高噪声和低噪声两个14B参数模型协同处理
- **智能帧插值**：自动生成起始帧到结束帧之间的平滑过渡
- **高质量输出**：支持640x640分辨率，可生成最多81帧的视频
- **灵活控制**：通过提示词精确描述变化过程
- **专业模型**：使用 WAN 2.2 系列最新的14B参数模型

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| positive_prompt | string | ✅ | - | 描述从起始帧到结束帧的变化过程 |
| negative_prompt | string | ❌ | null | 负向提示词，避免出现的内容 |
| start_image | string | ✅ | - | 起始帧图片路径 |
| end_image | string | ✅ | - | 结束帧图片路径 |
| width | number | ❌ | 640 | 视频宽度（像素） |
| height | number | ❌ | 640 | 视频高度（像素） |
| length | number | ❌ | 81 | 视频总帧数 |
| fps | number | ❌ | 16 | 视频帧率 |
| seed | number | ❌ | 456592759901286 | 随机种子 |
| steps | number | ❌ | 20 | 采样步数 |
| cfg | number | ❌ | 4 | 分类器引导强度 |

## 使用示例

### 基础用法

```python
from comfyui_mcp import run_workflow

result = run_workflow(
    "wan2_2_14b_flf2v",
    positive_prompt="人物从微笑逐渐转为大笑，表情自然过渡，头部轻微晃动",
    start_image="/path/to/smile.png",
    end_image="/path/to/laugh.png"
)
```

### 高级用法

```python
result = run_workflow(
    "wan2_2_14b_flf2v",
    positive_prompt="梵高自画像风格的红胡子男人缓慢流畅地变形为太空宇航员，每个变化都像液体颜料般流动",
    negative_prompt="静止不动，突然跳变，不连贯，模糊",
    start_image="/path/to/van_gogh.png",
    end_image="/path/to/astronaut.png",
    width=640,
    height=640,
    length=81,
    fps=24,
    steps=30,
    cfg=5
)
```

## 适用场景

1. **角色变形动画**
   - 人物表情过渡
   - 角色状态转换
   - 服装变化动画

2. **场景过渡效果**
   - 日夜交替
   - 季节变换
   - 环境转换

3. **创意特效**
   - 艺术风格变换
   - 物体变形
   - 魔法效果

4. **产品展示**
   - 产品组装过程
   - 颜色变化展示
   - 形态演变

## 注意事项

1. **图片要求**
   - 起始帧和结束帧应有一定的相关性
   - 建议使用相同尺寸的图片
   - 图片质量越高，生成效果越好

2. **提示词编写**
   - 详细描述变化过程而非静态状态
   - 使用连续性词汇如"逐渐"、"缓慢"、"流畅"
   - 避免突变和跳跃性描述

3. **参数调节**
   - length 参数决定动画流畅度，帧数越多越平滑
   - cfg 值过高可能导致过度依赖提示词
   - steps 增加可提升质量但会延长生成时间

4. **性能优化**
   - 该工作流使用14B参数模型，需要较大显存
   - 建议使用支持 FP8 精度的 GPU
   - 可通过降低分辨率来加快生成速度

## 模型信息

- **UNet 高噪声模型**: wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors
- **UNet 低噪声模型**: wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors
- **CLIP 模型**: umt5_xxl_fp8_e4m3fn_scaled.safetensors
- **VAE 模型**: wan_2.1_vae.safetensors

## 更新日志

- v1.0.0 (2024-01) - 初始版本，支持 WAN 2.2 14B 模型首尾帧插值