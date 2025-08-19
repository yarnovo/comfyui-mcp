#!/usr/bin/env node

import { testComfyUIConnection } from './dist/utils.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('测试 ComfyUI 连接...\n');
  
  const host = process.env.COMFYUI_HOST || 'localhost';
  const port = process.env.COMFYUI_PORT || '8000';
  const bypassProxy = process.env.BYPASS_PROXY !== 'false';
  
  console.log(`配置信息:`);
  console.log(`  主机: ${host}`);
  console.log(`  端口: ${port}`);
  console.log(`  绕过代理: ${bypassProxy ? '是' : '否'}`);
  
  if (host === 'localhost' || !host) {
    console.log('\n⚠️  警告: COMFYUI_HOST 未正确设置');
    console.log('请运行以下命令获取正确的 IP 地址:');
    console.log('  bash scripts/detect-wsl2-host.sh');
    console.log('\n然后在 .env 文件中设置 COMFYUI_HOST');
  }
  
  console.log(`\n测试连接到 ComfyUI (${host}:${port})...`);
  
  // 设置绕过代理
  if (bypassProxy) {
    process.env.BYPASS_PROXY = 'true';
  }
  
  const isConnected = await testComfyUIConnection(host, port);
  
  if (isConnected) {
    console.log('✅ 成功连接到 ComfyUI!');
  } else {
    console.log('❌ 无法连接到 ComfyUI');
    console.log('\n故障排除:');
    console.log('1. 确保 ComfyUI 正在 Windows 主机上运行');
    console.log('2. 确保 ComfyUI 监听在 0.0.0.0 而不是 127.0.0.1');
    console.log('3. 检查 Windows 防火墙设置');
    console.log('4. 运行 scripts/detect-wsl2-host.sh 验证 IP 地址');
  }
}

// 支持命令行参数覆盖
if (process.argv.length > 2) {
  const host = process.argv[2];
  const port = process.argv[3] || '8000';
  
  console.log(`测试连接到 ComfyUI (${host}:${port})...`);
  process.env.BYPASS_PROXY = 'true';
  
  testComfyUIConnection(host, port).then(isConnected => {
    if (isConnected) {
      console.log('✅ 成功连接!');
      console.log(`\n建议在 .env 文件中设置:`);
      console.log(`COMFYUI_HOST=${host}`);
      console.log(`COMFYUI_PORT=${port}`);
    } else {
      console.log('❌ 连接失败');
    }
  });
} else {
  main();
}