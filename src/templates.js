export function getHomePage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Telegram Webhook Bot | 云梦镜像</title>
  <style>
    :root {
      --primary-color: #2481cc;
      --bg-color: #f4f4f9;
      --card-bg: #ffffff;
      --text-color: #333;
      --code-bg: #eef1f5;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --primary-color: #4ea4f5;
        --bg-color: #1e1e1e;
        --card-bg: #2d2d2d;
        --text-color: #e0e0e0;
        --code-bg: #383838;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: var(--card-bg);
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }
    .status {
      display: inline-block;
      background-color: #e6f4ea;
      color: #1e8e3e;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
      margin-bottom: 30px;
    }
    @media (prefers-color-scheme: dark) {
      .status {
        background-color: #132e1c;
        color: #4caf50;
      }
    }
    .description {
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .code-block {
      background-color: var(--code-bg);
      padding: 15px;
      border-radius: 8px;
      text-align: left;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 0.85em;
      overflow-x: auto;
      margin-bottom: 20px;
      border: 1px solid rgba(0,0,0,0.1);
    }
    .footer {
      margin-top: 40px;
      font-size: 0.8em;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Telegram Webhook Bot</h1>
    <div class="status">● 云梦镜像服务运行中</div>
    
    <div class="description">
      这是由<b>云梦镜像</b>提供的高性能 Telegram 消息转发服务。<br>
      发送 POST 请求到 <code>/push</code> 端点即可将消息转发到 Telegram。
    </div>

    <div class="code-block">
      curl -X POST https://your-worker.workers.dev/push \\<br>
      &nbsp;&nbsp;-H "x-webhook-secret: YOUR_SECRET" \\<br>
      &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
      &nbsp;&nbsp;-d '{"message": "Hello World"}'
    </div>

    <div class="footer">
      &copy; 2026 DreamReflex. Powered by Cloudflare Workers.
    </div>
  </div>
</body>
</html>`;
}

export function getErrorPage(code, message) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${code}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #fff1f0;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #cf1322; margin: 0 0 10px 0; }
    p { color: #666; margin: 0; }
    @media (prefers-color-scheme: dark) {
      body { background-color: #2a1215; color: #e0e0e0; }
      .container { background: #1f1f1f; }
      h1 { color: #ff4d4f; }
      p { color: #aaa; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Error ${code}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
