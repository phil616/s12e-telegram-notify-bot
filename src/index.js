import { getHomePage } from "./templates.js";

export default {
  /**
   * Cloudflare Worker 主入口函数
   * @param {Request} req 入站请求对象
   * @param {Object} env 环境变量绑定 (包含 Secrets)
   */
  async fetch(req, env) {
    try {
      const url = new URL(req.url);
	  
      // 1. 路由过滤：仅允许访问 /push 路径
      // 其他路径返回带有使用说明的 HTML 页面
      if (url.pathname !== "/push") {
        return new Response(getHomePage(), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }

      // 2. 方法限制：仅接受 POST 请求
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      // 3. 安全验证：检查 x-webhook-secret 头
      // 必须与环境变量 ENV_PUSH_SECRET 匹配
      const secret = req.headers.get("x-webhook-secret");
      if (secret !== env.ENV_PUSH_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      // 4. 读取请求体
      let bodyText = "";
      try {
        bodyText = await req.text();
      } catch (e) {
        return new Response("Body read failed: " + e.toString());
      }

      // 5. 解析 JSON 请求体
      let payload = {};
      try {
        payload = JSON.parse(bodyText || "{}");
      } catch (e) {
        return new Response("JSON parse error: " + e.toString());
      }

      // 6. 构造要发送的消息内容
      // 优先使用 JSON 中的 message 字段，其次使用原始文本，最后默认为 "Empty"
      const message =
        "Webhook message:\n\n" +
        (payload.message || bodyText || "Empty");

      // 7. 调用 Telegram Bot API 发送消息
      const tgRes = await fetch(
        `https://api.telegram.org/bot${env.ENV_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.ENV_CHAT_ID,
            text: message
          })
        }
      );

      const tgText = await tgRes.text();

      // 8. 返回执行结果
      return new Response(
        JSON.stringify({
          ok: true,
          telegram_status: tgRes.status,
          telegram_response: tgText
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      // 全局错误捕获
      return new Response("Fatal error: " + err.toString());
    }
  }
};