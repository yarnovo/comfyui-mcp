export function setupProxy(host: string) {
  // 如果设置了 BYPASS_PROXY，则绕过代理
  if (process.env.BYPASS_PROXY === 'true' || process.env.BYPASS_PROXY === '1') {
    process.env.NO_PROXY = `${host},localhost,127.0.0.1`;
    process.env.no_proxy = `${host},localhost,127.0.0.1`;
  }
}

export async function testComfyUIConnection(host: string, port: string): Promise<boolean> {
  try {
    setupProxy(host);
    
    const url = `http://${host}:${port}/system_stats`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      method: 'GET'
    });
    
    clearTimeout(timeout);
    return response.ok;
  } catch (error) {
    console.error(`无法连接到 ComfyUI (${host}:${port}):`, error);
    return false;
  }
}