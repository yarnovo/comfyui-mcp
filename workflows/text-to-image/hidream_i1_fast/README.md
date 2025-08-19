# HiDream i1 Fast 文生图工作流

## 概述

使用 HiDream i1 Fast 极速版模型生成高质量图像的专业工作流。HiDream i1 Fast 是基于 SD3 架构的轻量化模型，专为快速生成而优化，仅需16步即可输出优质图像。

## 工作流特点

- **极速生成**：16步采样，生成速度比标准版快3倍以上
- **四重CLIP编码**：集成 CLIP-L、CLIP-G、T5-XXL 和 LLaMA 3.1，提供卓越的文本理解能力
- **LCM优化**：采用LCM采样器，专为快速推理设计
- **SD3架构**：基于最新的Stable Diffusion 3架构，确保生成质量
- **艺术风格**：擅长生成具有独特艺术风格的图像，特别适合概念设计和创意探索
- **实时预览**：适合需要快速迭代和实时反馈的创作场景

## 主要参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|---------|------|
| positive_prompt | string | 必填 | 正向提示词，描述想要生成的内容 |
| negative_prompt | string | null | 负向提示词，描述不想要的内容 |
| width | number | 1024 | 图像宽度（像素） |
| height | number | 1024 | 图像高度（像素） |
| steps | number | 16 | 采样步数（Fast版本优化值） |
| cfg | number | 1 | CFG强度（Fast版本推荐值） |
| seed | number | 随机 | 随机种子，-1为随机生成 |
| sampler_name | string | lcm | 采样器（lcm为快速优化） |
| shift | number | 3 | SD3偏移值，影响细节风格 |

## 使用示例

### 基础用法

```javascript
const result = await runWorkflow('hidream_i1_fast', {
  positive_prompt: "一位穿着华丽汉服的女性站在梅花树下，月光洒在她身上，电影级光影，8K超高清"
});
```

### 艺术风格创作

```javascript
const result = await runWorkflow('hidream_i1_fast', {
  positive_prompt: "赛博朋克风格的未来城市，霓虹灯光，雨夜街道，飞行汽车，volumetric lighting",
  negative_prompt: "低质量，模糊，变形",
  width: 1024,
  height: 1024,
  steps: 16
});
```

### 快速概念设计

```javascript
const result = await runWorkflow('hidream_i1_fast', {
  positive_prompt: "奇幻风格的浮空岛屿，魔法水晶，发光植物，史诗级场景",
  cfg: 1,
  sampler_name: "lcm",
  shift: 3
});
```

## 最佳实践

### 提示词建议

1. **主体描述**：清晰描述画面主体
2. **风格指定**：明确艺术风格（如赛博朋克、水彩、油画等）
3. **光影效果**：添加光线描述增强氛围
4. **细节补充**：适当添加细节描述提升质量

### 参数调优

- **快速预览**：保持默认16步和cfg=1设置
- **风格调整**：通过shift参数（2-4）微调艺术风格
- **质量优先**：如需更高质量，可适当增加steps到20-24

### 适用场景

- ✅ 快速概念设计和创意探索
- ✅ 实时交互式图像生成
- ✅ 批量生成和A/B测试
- ✅ 艺术风格探索
- ✅ 游戏和动画概念图
- ⚠️ 需要极致细节时建议使用完整版模型

## 注意事项

1. **模型特性**：Fast版本追求速度，细节表现略逊于完整版
2. **分辨率**：建议使用1024x1024或其倍数获得最佳效果
3. **提示词**：虽然速度快，但仍需要清晰的提示词描述
4. **显存占用**：相比完整版显存占用更低，适合中端显卡

## 技术规格

- **基础模型**：hidream_i1_fast_fp8.safetensors
- **文本编码器**：QuadrupleCLIP (4x编码器)
- **VAE模型**：ae.safetensors
- **架构**：Stable Diffusion 3
- **优化技术**：LCM蒸馏、FP8量化