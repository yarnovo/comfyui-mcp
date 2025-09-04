# WAN 2.2 14B I2V 工作流

## 概述

使用 WAN 2.2 14B 模型将单张静态图片智能转换为动态视频的专业工具。该工作流采用创新的双阶段去噪架构，通过高噪声和低噪声两个14B参数模型的协同处理，实现高质量的图像动画化效果。

## 工作流特点

- **双模型架构**：高噪声模型构建基础动态，低噪声模型精化细节
- **14B参数规模**：每个阶段都使用14B参数模型，确保生成质量
- **LoRA优化**：配备专门的4步LoRA模型，加速生成过程
- **文本精确控制**：通过详细描述控制动画效果和运动轨迹
- **T5-XXL编码器**：使用先进的文本编码器理解复杂指令
- **SD3采样算法**：优化的采样策略提升视觉效果

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| positive_prompt | string | ✅ | - | 描述视频中的动作、运动和场景变化 |
| negative_prompt | string | ❌ | null | 不想要的效果（直接列出，不用否定词） |
| input_image | string | ✅ | - | 输入的静态图片路径 |
| width | number | ❌ | 640 | 视频宽度（像素） |
| height | number | ❌ | 640 | 视频高度（像素） |
| length | number | ❌ | 81 | 视频帧数，81帧约5秒(16fps) |
| steps | number | ❌ | 4 | 总采样步数 |
| cfg | number | ❌ | 1 | CFG引导强度 |
| fps | number | ❌ | 16 | 视频帧率 |
| seed | number | ❌ | 138073435077572 | 随机种子，-1表示随机 |
| output_dir | string | ❌ | 系统自动提供 | 输出目录路径 |
| output_name | string | ❌ | 系统自动提供 | 输出文件夹名称 |

## 使用示例

### 基础使用

```javascript
const result = await runWorkflow('wan2_2_14b_i2v', {
  positive_prompt: "The white dragon warrior stands still, eyes full of determination and strength. The camera slowly moves closer or circles around the warrior, highlighting the powerful presence and heroic spirit of the character.",
  negative_prompt: "色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止",
  input_image: "path/to/your/image.jpg"
});
```

### 角色动画

```javascript
const result = await runWorkflow('wan2_2_14b_i2v', {
  positive_prompt: "角色缓缓转身看向镜头，表情从严肃变为微笑，头发和衣服自然飘动，光影变化细腻",
  negative_prompt: "静止不动，突兀变化，不自然，模糊，闪烁",
  input_image: "character.png",
  width: 768,
  height: 768,
  length: 97,
  fps: 24
});
```

### 产品展示

```javascript
const result = await runWorkflow('wan2_2_14b_i2v', {
  positive_prompt: "产品360度匀速旋转展示，表面材质和光泽清晰可见，背景虚化突出产品",
  negative_prompt: "背景杂乱，静止，跳跃，不连续",
  input_image: "product.jpg",
  width: 1024,
  height: 576,
  output_dir: "/custom/output/path",
  output_name: "product_demo"
});
```

### 风景动画

```javascript
const result = await runWorkflow('wan2_2_14b_i2v', {
  positive_prompt: "云朵缓缓飘动，树叶随风摇曳，水面泛起涟漪，阳光穿透云层产生动态光影",
  negative_prompt: "静态场景，不自然运动，画面撕裂",
  input_image: "landscape.jpg",
  length: 129,
  seed: -1
});
```

## 提示词技巧

### 动作描述
- 使用具体动词：转身、行走、飘动、旋转等
- 指定速度和节奏：缓慢、快速、匀速、有节奏等
- 描述运动路径：直线、弧线、环绕、上升等

### 镜头语言
- 镜头运动：推进、拉远、平移、环绕
- 焦点变化：对焦、虚化、景深变化
- 视角切换：俯视、仰视、侧视

### 环境互动
- 自然元素：风吹、水流、光影变化
- 物理效果：重力、惯性、弹性
- 氛围营造：烟雾、粒子、光效

## 注意事项

1. **图像准备**：输入图像应清晰且主体明确，避免过于复杂的背景
2. **分辨率选择**：640x640是默认最优分辨率，更高分辨率可能需要更多显存
3. **帧数设置**：81帧适合大多数场景，更长动画可增加到129或161帧
4. **采样步数**：默认4步已经优化，无需调整除非追求极致质量
5. **负面提示词**：记住直接列出不需要的内容，不要使用"不要"等否定词

## 技术规格

- **主模型（高噪声）**：wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors
- **主模型（低噪声）**：wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors
- **LoRA模型（高噪声）**：wan2.2_i2v_lightx2v_4steps_lora_v1_high_noise.safetensors
- **LoRA模型（低噪声）**：wan2.2_i2v_lightx2v_4steps_lora_v1_low_noise.safetensors
- **文本编码器**：umt5_xxl_fp8_e4m3fn_scaled.safetensors
- **VAE模型**：wan_2.1_vae.safetensors

## 适用场景

- 电商产品动态展示
- 游戏角色动作设计
- 电影概念预览
- 社交媒体创意内容
- 教育演示动画
- 艺术作品动态化
- 建筑效果展示
- 时尚服装展示