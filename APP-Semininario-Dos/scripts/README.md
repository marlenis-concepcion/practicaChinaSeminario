# Scripts and extensions / 脚本与扩展

This directory will document automation and new features after the requirements for the second application are confirmed. It contains no provisional business logic.

本目录将在第二个应用的需求确认后记录自动化脚本和新功能。目前不包含任何临时业务逻辑。

## Setup / 准备

From `APP-Semininario-Dos` / 在 `APP-Semininario-Dos` 目录中运行：

```bash
npm run install:all
```

## Run each service separately / 分别运行服务

Terminal 1 (backend, port 3001) / 终端 1（后端，端口 3001）：

```bash
npm run dev:backend
```

Terminal 2 (frontend, port 5174) / 终端 2（前端，端口 5174）：

```bash
npm run dev:frontend
```

Backend health check / 后端健康检查：`http://localhost:3001/health`.

## Criteria for new features / 新功能准则

- Wait for confirmed requirements before adding business logic. / 添加业务逻辑前，等待需求确认。
- Keep TypeScript strict, components small, and responsibilities separate. / 保持 TypeScript 严格模式、组件精简并分离职责。
- Preserve keyboard navigation, accessible labels, contrast, and reduced motion. / 保留键盘导航、无障碍标签、颜色对比度和减少动态效果支持。
- Add Chinese and English translations for every visible string. / 为每条可见文本添加中文和英文翻译。
- Document environment variables and new commands. / 记录环境变量和新增命令。
