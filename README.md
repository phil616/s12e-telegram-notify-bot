# Telegram Webhook Bot | 云梦镜像

这是一个基于 **Cloudflare Workers** 构建的高性能、无服务器 Telegram 消息转发网关。
它可以接收来自外部服务（如 GitHub Actions, CI/CD, 监控系统等）的 Webhook 请求，并将消息实时转发到指定的 Telegram 聊天中。


## 功能特性

*   **极速响应**：基于 Cloudflare 全球边缘网络，低延迟。
*   **安全验证**：通过 `x-webhook-secret` 头部验证请求合法性。
*   **智能解析**：自动解析 JSON 请求体，支持自定义消息或回退到原始文本。
*   **友好界面**：根路径提供可视化的 HTML 说明页面（支持深色模式）。
*   **自动化部署**：集成了 GitHub Actions 自动部署流程。

## 快速开始

### 前置要求

1.  **Cloudflare 账号**：用于部署 Workers。
2.  **Telegram Bot**：
    *   在 Telegram 中联系 [@BotFather](https://t.me/BotFather) 创建机器人，获取 `Token`。
    *   获取你的 `Chat ID` (可联系 [@userinfobot](https://t.me/userinfobot))。
3.  **Node.js**：本地开发需要 Node.js 环境。

### 本地开发

1.  **克隆项目**
    ```bash
    git clone <your-repo-url>
    cd telegram-webhook-bot
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    复制示例配置文件：
    ```bash
    cp .dev.vars.example .dev.vars
    ```
    编辑 `.dev.vars` 文件，填入你的真实信息：
    ```ini
    ENV_BOT_TOKEN=your_bot_token
    ENV_CHAT_ID=your_chat_id
    ENV_PUSH_SECRET=your_custom_secret
    ```

4.  **启动本地服务器**
    ```bash
    npm run dev
    ```
    访问 `http://localhost:8787` 查看效果。

## 部署

### 方式一：手动部署 (Wrangler)

1.  **登录 Cloudflare**
    ```bash
    npx wrangler login
    ```

2.  **上传密钥 (Secrets)**
    生产环境的密钥需要单独上传：
    ```bash
    npx wrangler secret put ENV_BOT_TOKEN
    npx wrangler secret put ENV_CHAT_ID
    npx wrangler secret put ENV_PUSH_SECRET
    ```

3.  **发布**
    ```bash
    npm run deploy
    ```

### 方式二：GitHub Actions 自动部署

本项目已配置 CI/CD 流程。只需在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加以下 Secrets：

*   `CLOUDFLARE_API_TOKEN`: 你的 Cloudflare API 令牌。
*   `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare 账户 ID。

推送到 `main` 分支时将自动触发部署。

## GitHub Actions 集成指南

你可以将此 Webhook 轻松集成到 GitHub Actions 工作流中，以便在构建或部署完成后接收包含 commit 信息和仓库链接的通知。

### 1. 配置 GitHub Secrets

在你的 GitHub 仓库中，添加以下 Secret：

*   `TG_WEBHOOK_URL`: 部署好的 Worker URL，例如 `https://your-bot.workers.dev/push`
*   `TG_WEBHOOK_SECRET`: 你的 `ENV_PUSH_SECRET`

### 2. 添加 Workflow 步骤

在你的 `.github/workflows/xxx.yml` 文件中，添加以下步骤。这里使用 `curlimages/curl` 镜像来发送请求，并利用 GitHub 提供的上下文变量来构造丰富的消息内容。

```yaml
      - name: Send Telegram Notification
        if: always() # 无论前面的步骤成功与否都运行
        run: |
          # 构造消息内容
          REPO_NAME="${{ github.repository }}"
          COMMIT_SHA="${{ github.sha }}"
          COMMIT_URL="https://github.com/${{ github.repository }}/commit/${{ github.sha }}"
          WORKFLOW_URL="https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
          STATUS="${{ job.status }}"
          
          MESSAGE="**GitHub Actions Notification**
          
          **Repository:** ${REPO_NAME}
          **Status:** ${STATUS}
          **Workflow:** [View Run](${WORKFLOW_URL})
          **Commit:** [${COMMIT_SHA::7}](${COMMIT_URL})
          
          _Powered by DreamReflex Bot_"
          
          # 发送请求
          curl -X POST "${{ secrets.TG_WEBHOOK_URL }}" \
            -H "x-webhook-secret: ${{ secrets.TG_WEBHOOK_SECRET }}" \
            -H "Content-Type: application/json" \
            -d "$(jq -n --arg msg "$MESSAGE" '{message: $msg}')"
```

> **注意**：上述脚本使用了 `jq` 来安全地生成 JSON，避免特殊字符导致格式错误。GitHub Actions 的 `ubuntu-latest` 环境预装了 `jq`。

## API 使用说明

### 发送消息

*   **Endpoint**: `POST /push`
*   **Headers**:
    *   `x-webhook-secret`: (必填) 你的 `ENV_PUSH_SECRET`
    *   `Content-Type`: `application/json`

### 示例

**cURL**

```bash
curl -X POST https://your-worker.workers.dev/push \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"message": "项目构建成功！\n\n来自 GitHub Actions 的通知。"}'
```

**JSON Payload**

```json
{
  "message": "这是要发送到 Telegram 的消息内容"
}
```
如果 JSON 解析失败，Worker 会尝试发送原始 Body 文本。

## 项目结构

```
.
├── .github/workflows/   # GitHub Actions 部署配置
├── src/
│   ├── index.js         # Worker 核心逻辑
│   └── templates.js     # HTML 页面模板
├── playground/          # 本地预览用的静态页面
├── wrangler.jsonc       # Cloudflare Workers 配置文件
└── package.json         # 项目依赖配置
```

## 📄 License

MIT
