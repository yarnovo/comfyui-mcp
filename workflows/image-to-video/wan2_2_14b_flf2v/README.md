# WAN 2.2 14B 首尾帧插值视频生成工作流

## 概述

使用 WAN 2.2 14B 模型实现首尾帧智能插值生成流畅视频的专业工具。该工作流采用双阶段去噪策略,通过高噪声和低噪声两个14B参数模型的协同处理,在给定起始帧和结束帧的情况下自动生成中间过渡帧,实现平滑自然的动画效果。

## 工作流特点

- **双模型架构**: 采用高噪声(14B)和低噪声(14B)两阶段处理策略
- **智能插值技术**: 自动分析首尾帧差异,生成连贯的中间过渡帧
- **高质量输出**: 支持640x640分辨率,确保视频清晰度
- **灵活的帧数控制**: 可生成最多81帧的视频,适应不同时长需求
- **SD3采样算法**: 优化的采样策略,提升生成质量
- **T5-XXL文本编码**: 更好地理解和执行动画指令

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| positive_prompt | string | 是 | - | 描述动画过程和效果 |
| negative_prompt | string | 否 | null | 描述要避免的效果 |
| start_image | string | 是 | - | 起始帧图片路径 |
| end_image | string | 是 | - | 结束帧图片路径 |
| width | number | 否 | 640 | 视频宽度(像素) |
| height | number | 否 | 640 | 视频高度(像素) |
| length | number | 否 | 81 | 视频总帧数 |
| batch_size | number | 否 | 1 | 批次大小 |
| seed | number | 否 | 700186556733869 | 随机种子 |
| steps | number | 否 | 4 | 采样步数 |
| cfg | number | 否 | 1 | CFG引导强度 |
| sampler_name | string | 否 | euler | 采样器名称 |
| scheduler | string | 否 | simple | 调度器类型 |
| shift | number | 否 | 5 | SD3算法偏移值 |
| fps | number | 否 | 16 | 视频帧率 |
| filename_prefix | string | 否 | video/ComfyUI | 输出文件名前缀 |
| video_format | string | 否 | auto | 视频格式 |
| codec | string | 否 | auto | 视频编码器 |
| output_dir | string | 否 | - | 输出目录(系统自动提供) |
| output_name | string | 否 | - | 输出名称(系统自动提供) |

## 使用示例

### 基础使用

```javascript
const result = await runWorkflow('wan2_2_14b_flf2v', {
  positive_prompt: "从白天缓慢过渡到夜晚,天空颜色渐变,星星逐渐出现,流畅自然的转换",
  start_image: "/path/to/day_scene.png",
  end_image: "/path/to/night_scene.png"
});
```

### 高级配置

```javascript
const result = await runWorkflow('wan2_2_14b_flf2v', {
  positive_prompt: "花朵从含苞待放到完全盛开,花瓣缓慢展开,自然生长过程,细腻的动态效果",
  negative_prompt: "静止,跳跃,闪烁,不连贯,模糊",
  start_image: "/path/to/flower_bud.png",
  end_image: "/path/to/flower_bloom.png",
  width: 640,
  height: 640,
  length: 81,
  fps: 16,
  cfg: 1,
  steps: 4,
  seed: 12345,
  output_dir: "/custom/output/path",
  output_name: "flower_bloom_animation"
});
```

### 批量生成

```javascript
const result = await runWorkflow('wan2_2_14b_flf2v', {
  positive_prompt: "表情从微笑变化到大笑,自然的面部表情过渡",
  start_image: "/path/to/smile.png",
  end_image: "/path/to/laugh.png",
  batch_size: 3,  // 生成3个不同版本
  seed: -1  // 使用随机种子
});
```

## 应用场景

1. **变形动画**: 物体形态的平滑转换
2. **表情过渡**: 人物表情的自然变化
3. **场景转换**: 日夜交替、季节变化等
4. **角色动作**: 动作起始和结束的中间过程
5. **创意特效**: 艺术化的视觉转换效果

## 技术细节

- **模型架构**: WAN 2.2 双14B模型(高噪声+低噪声)
- **VAE模型**: wan_2.1_vae.safetensors
- **文本编码器**: T5-XXL (FP8量化)
- **LoRA增强**: LightX2V 4步采样优化
- **两阶段处理**: 
  - 第一阶段(步骤0-2): 高噪声模型构建基础结构
  - 第二阶段(步骤2-4): 低噪声模型精细化细节

## 注意事项

1. 输入的起始帧和结束帧应保持相同的尺寸
2. 建议使用16:9或1:1的宽高比以获得最佳效果
3. 帧数设置影响动画流畅度,81帧约5秒(16fps)
4. CFG值较低(默认1)有助于保持动画连贯性
5. 首尾帧差异过大可能影响插值质量
6. 使用相同种子可获得可重复的结果

## 性能优化建议

- 使用FP8量化模型减少显存占用
- 较少的采样步数(默认4步)实现快速生成
- 批量处理时注意显存限制
- 640x640分辨率在质量和速度间取得平衡