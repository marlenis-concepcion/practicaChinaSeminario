# 任务二：AI 教学演示与数字人微视频生成器

## 中文

### 1. 教师布置的任务

使用人工智能软件创建一个包含 3 至 5 张幻灯片的教学演示文稿，并生成一段由数字人进行讲解的微视频。

### 2. 项目目标

开发一个简单的双语 Web 应用。用户只需输入一个主题，应用即可：

1. 生成一份包含 3 至 5 张幻灯片的教学演示文稿；
2. 为每张幻灯片生成简短、清晰的讲解稿；
3. 使用数字人和合成语音讲解所生成的内容；
4. 生成可预览和下载的教学微视频。

### 3. 基本使用流程

1. 用户输入演示主题。
2. 用户选择中文或英文作为内容和讲解语言。
3. 用户点击“生成演示文稿”。
4. 应用显示 3 至 5 张可预览的幻灯片。
5. 用户可以在生成视频前修改标题、要点和讲解稿。
6. 用户选择数字人和语音，然后点击“生成微视频”。
7. 应用显示生成进度，并在完成后提供视频预览和下载。

### 4. 核心功能

- 提供一个清晰的主题输入框和示例主题。
- 自动生成适合教学的结构：
  - 封面；
  - 主题介绍或学习目标；
  - 2 至 3 张核心内容幻灯片；
  - 总结或复习问题。
- 幻灯片总数必须保持在 3 至 5 张之间。
- 每张幻灯片应包含标题、简短要点和讲解稿。
- 用户可以在生成视频前编辑内容。
- 提供至少一个数字人形象和中文、英文语音选项。
- 生成简短的教学视频，建议时长为 1 至 3 分钟。
- 提供重新生成、预览、下载和重新开始功能。
- 保存最近一次生成的主题和草稿，避免页面刷新后丢失。
- 当生成失败时，显示简单明确的错误和重试按钮。
- 提供“人物与授权”配置模块，为以下三位讲解者创建独立资料：
  - Mtro. Wilson Suarez — UASD；
  - Ing. Jorge Luis Pimentel — APEC；
  - Mtra. Marlenis Judith Concepcion Cuevas — SDET · UASD。
- 每位讲解者必须提供本人照片、在安静环境中录制的清晰语音样本以及明确的使用授权。
- 只有照片、语音和授权全部完成后，才能选择该讲解者生成数字人视频。
- 用户可以选择课程模板、幻灯片数量、讲解语言、讲解者、语音速度、视频格式和输出类型。
- 输出类型包括 PPTX 演示文稿、教学材料、讲解稿和数字人微视频。

### 5. 设置与无障碍

设置菜单必须使用文字和容易识别的图标：

- `🌐` 界面、演示和讲解语言；
- `🎨` 标准、高对比度和色盲友好主题；
- `🧑` 数字人选择；
- `🔊` 语音选择和播放速度；
- `📑` 幻灯片数量（3 至 5）；
- `💾` 保存设置。

中文界面使用红、金、米白色的教育视觉风格；英文界面使用蓝、红、白色的教育视觉风格。页面底部显示中国国旗以及“中华人民共和国 / People’s Republic of China”。

所有操作必须支持键盘。重要状态不能只通过颜色表示，还必须使用文字或图标。视频应支持字幕，并提供讲解稿文本。

### 6. 技术要求

- 使用语义化 HTML5、响应式 CSS、React 和 TypeScript。
- 保持界面简单，适合不熟悉技术的用户。
- 使用独立的配置模块管理语言、主题、幻灯片数量、视频时长和服务地址。
- 前端负责主题输入、编辑、预览、设置和生成状态。
- 后端负责安全调用文本生成、语音合成和数字人视频服务；密钥不得出现在浏览器代码中。
- 使用 `localStorage` 保存非敏感设置和草稿。
- 未经用户同意，不上传真人照片、声音或其他个人信息。
- 照片和声音属于敏感个人资料。必须说明用途、存储方式和删除方式，并允许讲解者撤回授权。
- 生成的视频必须明确标注为 AI 生成，并标明所使用的授权数字人和合成语音。
- 如果数字人服务不可用，应用至少应允许下载幻灯片内容和讲解稿。
- 所有生成的 MP4、PPTX、音频和临时文件必须保存在本地 `generated-output/` 文件夹中；该文件夹不得提交到 Git。

### 7. 验收标准

- 输入一个主题后，可以生成 3 至 5 张教学幻灯片。
- 每张幻灯片包含标题、要点和对应讲解稿。
- 用户可以在生成视频前编辑生成的内容。
- 用户可以选择中文或英文以及数字人语音。
- 应用能够生成或请求生成带数字人讲解的微视频。
- 生成过程中有明确的等待、成功和失败状态。
- 完成后可以预览视频，并下载视频或其生成材料。
- 中文和英文界面都能正常使用。
- 页面适配常见桌面和移动浏览器，控制台无未处理错误。

---

# Task 2: AI Teaching Presentation and Digital Avatar Microvideo Generator

## English

### 1. Teacher's Assignment

Use AI software to create a didactic presentation containing 3 to 5 slides and generate a microvideo in which a digital avatar explains the content.

### 2. Project Goal

Develop a simple bilingual web application. The user only needs to enter a topic, and the application will:

1. Generate a didactic presentation containing 3 to 5 slides.
2. Generate a short and clear narration script for every slide.
3. Use a digital avatar and synthesized voice to explain the generated content.
4. Produce a teaching microvideo that can be previewed and downloaded.

### 3. Basic User Flow

1. The user enters the presentation topic.
2. The user selects Chinese or English for the content and narration.
3. The user selects “Generate presentation.”
4. The application displays a preview of 3 to 5 slides.
5. The user may edit titles, bullet points, and narration before producing the video.
6. The user selects an avatar and voice, then selects “Generate microvideo.”
7. The application displays generation progress and provides video preview and download when complete.

### 4. Core Features

- Provide one clear topic field with example topics.
- Automatically generate a suitable teaching structure:
  - Cover slide.
  - Introduction or learning objectives.
  - Two or three core-content slides.
  - Summary or review question.
- Keep the presentation between 3 and 5 slides.
- Include a title, concise bullet points, and narration script on every slide.
- Allow the user to edit content before generating the video.
- Provide at least one digital avatar and Chinese and English voice options.
- Generate a short teaching video with a recommended duration of 1 to 3 minutes.
- Provide regenerate, preview, download, and start-over actions.
- Preserve the most recent topic and draft so they are not lost after refreshing.
- Display a clear error and retry action when generation fails.
- Provide a required “People and consent” setup module with separate profiles for:
  - Mtro. Wilson Suarez — UASD.
  - Ing. Jorge Luis Pimentel — APEC.
  - Mtra. Marlenis Judith Concepcion Cuevas — SDET · UASD.
- Every presenter must provide their own photograph, a clear voice sample recorded in a quiet location, and explicit permission for its intended use.
- A presenter can only be selected for avatar-video generation after their photograph, voice, and consent are complete.
- Allow users to choose the lesson template, slide count, narration language, presenter, voice speed, video format, and output type.
- Output options include a PPTX presentation, teaching materials, narration transcript, and digital-avatar microvideo.

### 5. Settings and Accessibility

The settings menu must use text and recognizable icons:

- `🌐` Interface, presentation, and narration language.
- `🎨` Standard, high-contrast, and color-blind-friendly themes.
- `🧑` Digital avatar selection.
- `🔊` Voice selection and playback speed.
- `📑` Number of slides, from 3 to 5.
- `💾` Save settings.

Use a red, gold, and warm-white educational identity for Chinese, and a blue, red, and white educational identity for English. Display the Chinese flag and “中华人民共和国 / People’s Republic of China” in the footer.

Every action must be keyboard-accessible. Important status information must use text or icons in addition to color. The video must support captions, and the narration transcript must remain available as text.

### 6. Technical Requirements

- Use semantic HTML5, responsive CSS, React, and TypeScript.
- Keep the interface simple for users with limited technical experience.
- Use a dedicated configuration module for languages, themes, slide count, video duration, and service URLs.
- The frontend handles topic entry, editing, previews, settings, and generation status.
- The backend securely calls text-generation, text-to-speech, and digital-avatar video services. API keys must never appear in browser code.
- Use `localStorage` for non-sensitive settings and drafts.
- Do not upload real photographs, voices, or other personal information without user consent.
- Photographs and voices are sensitive personal data. Explain their purpose, storage, and deletion, and allow presenters to withdraw consent.
- Generated videos must be clearly disclosed as AI-generated and identify the authorized avatar and synthesized voice used.
- If the avatar service is unavailable, the application must still allow users to download the slide content and narration script.
- All generated MP4, PPTX, audio, and temporary files must be stored locally in `generated-output/`; this folder must be excluded from Git.

### 7. Acceptance Criteria

- Entering a topic generates a teaching presentation with 3 to 5 slides.
- Every slide has a title, bullet points, and corresponding narration.
- Generated content can be edited before video production.
- The user can select Chinese or English and an avatar voice.
- The application can generate or request a microvideo narrated by a digital avatar.
- Waiting, success, and failure states are clearly displayed.
- The completed video can be previewed, and the video or generated materials can be downloaded.
- Both Chinese and English interfaces work correctly.
- The page works in common desktop and mobile browsers without unhandled console errors.
