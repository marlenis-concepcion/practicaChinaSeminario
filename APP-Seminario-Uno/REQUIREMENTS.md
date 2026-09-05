# 课堂安静种树游戏 — 项目需求

## 中文

### 1. 项目目标

开发一个供学生自主学习时使用的双语 HTML5 互动游戏。应用通过麦克风监测课堂噪音，并把安静学习的成果显示为树苗和大树。

### 2. 核心功能

1. 请求并使用浏览器麦克风权限，实时检测课堂声音水平。
2. 在页面上显示当前声音水平和 30 分贝目标线。
3. 当检测到符合课堂安静目标的有效时段时，增加一棵小树苗。
4. 每累计 10 棵小树苗，将它们转换成一棵大树，并重新开始树苗计数。
5. 显示树苗数量、大树数量、当前声音状态和学习时间。
6. 提供开始、暂停和重置按钮。
7. 支持中文和英文界面，并可即时切换语言。
8. 麦克风不可用、权限被拒绝或浏览器不支持时，显示明确提示。
9. 提供设置菜单，允许用户更改语言、主题、声音阈值、安静时长和游戏规则。
10. 提供高对比度和色盲友好配色。状态信息不能只依赖颜色，还必须使用文字、图标或图案。
11. 使用游戏、关于我们、常见问题和设置等独立模块组织页面。
12. 每个主要控件提供可悬停和键盘聚焦的信息说明，并根据当前语言显示。
13. 教师可以配置课堂总时长、目标树木数量，以及未达到目标时显示的自定义提示。
14. 课堂总时长和获得树苗所需的安静时间分别支持秒、分钟和小时。
15. 提供正向激励、平衡管理和严格纪律三种可选模式；纪律提示默认可关闭。

> 注意：普通设备的麦克风不能在没有校准的情况下准确测量物理分贝值。应用可显示近似声音水平，并将阈值作为可配置参数。

### 3. 配置模块

创建 `src/config.ts`，集中管理：

- 默认语言和支持的语言；
- 噪音阈值（默认目标值为 30）；
- 生成树苗所需的安静时长；
- 生成一棵大树所需的树苗数量（默认 10）；
- 音频采样设置；
- 中英文界面文本；
- 本地存储键名。
- 默认主题以及标准、高对比度、红绿色盲友好和蓝黄色盲友好配色。
- 中文界面采用适合中国教育场景的红、金、米白色视觉风格；英文界面采用蓝、红、白色教育风格。
- 用户可以在设置菜单中安全修改的参数范围。
- 课堂活动时长、目标树木数量以及可选的未达标提示。

业务逻辑中不得重复写死这些配置值。

### 4. 技术要求

- 前端使用 React、TypeScript、Vite、语义化 HTML5 和响应式 CSS。
- 为保持课堂作业简单，本版本不需要后端、用户账户或数据库。
- 使用 Web Audio API 和 `navigator.mediaDevices.getUserMedia()`。
- 使用 React 组件和模块分离配置、音频检测、游戏状态、国际化、设置和界面逻辑。
- 使用 `localStorage` 保存语言和游戏进度。
- 麦克风原始音频不得上传或保存；所有处理均在浏览器中完成。
- 支持现代桌面浏览器；所有控件必须可通过键盘操作，并满足 WCAG 2.1 AA 的基本对比度要求。
- 桌面版主要游戏面板应尽量适配单屏显示；手机版采用清晰的纵向响应式布局和适合触摸的控件。

### 5. 验收标准

- 用户授权后，页面能够读取麦克风并更新声音指示器。
- 达到配置的条件时正确增加树苗。
- 每 10 棵树苗正确转换为一棵大树。
- 暂停和重置功能正常。
- 中文和英文切换不需要刷新页面。
- 设置菜单能够更改语言、主题和允许调整的游戏参数。
- 色盲友好主题下，所有状态仍可通过文字、图标或图案识别。
- 配置值只需在配置模块中修改一次即可生效。
- 浏览器控制台没有未处理错误。

---

# Classroom Quiet Tree Game — Project Requirements

## English

### 1. Project Goal

Develop a bilingual HTML5 interactive game for students' independent study. The application monitors classroom noise through the microphone and visualizes quiet-study progress as seedlings and mature trees.

### 2. Core Features

1. Request and use browser microphone permission to monitor classroom sound levels in real time.
2. Display the current sound level and a target line of 30 decibels.
3. Add one seedling after a valid period that meets the classroom quiet target.
4. Convert every 10 accumulated seedlings into one mature tree, then restart the seedling counter.
5. Display the seedling count, mature-tree count, current sound status, and study time.
6. Provide start, pause, and reset controls.
7. Support Chinese and English interfaces with instant language switching.
8. Show clear messages when the microphone is unavailable, permission is denied, or the browser is unsupported.
9. Provide a settings menu for changing the language, theme, sound threshold, quiet duration, and game rules.
10. Provide high-contrast and color-vision-deficiency-friendly palettes. Status information must not rely on color alone; it must also use text, icons, or patterns.
11. Organize the page into separate Game, About Us, FAQs, and Settings modules.
12. Give every primary control a mouse-hover and keyboard-focus explanation in the selected language.
13. Allow the teacher to configure total study time, target tree count, and an optional custom message when the target is missed.
14. Support seconds, minutes, and hours independently for total activity time and quiet time per seedling.
15. Provide optional Positive, Balanced, and Strict discipline modes; disciplinary messages remain disabled by default.

> Note: A standard device microphone cannot measure physical decibels accurately without calibration. The application may display an approximate sound level and expose the threshold as a configurable value.

### 3. Configuration Module

Create `src/config.ts` to centrally manage:

- Default and supported languages.
- Noise threshold (default target value: 30).
- Quiet duration required to produce a seedling.
- Seedlings required to produce a mature tree (default: 10).
- Audio sampling settings.
- Chinese and English interface text.
- Local-storage key names.
- Default theme plus standard, high-contrast, red-green-friendly, and blue-yellow-friendly palettes.
- Use a red, gold, and warm-white educational identity for Chinese, and a blue, red, and white educational identity for English.
- Safe ranges for values users may change through the settings menu.
- Class activity duration, target tree count, and an optional unmet-goal message.

These values must not be duplicated as hard-coded values in the business logic.

### 4. Technical Requirements

- Use React, TypeScript, Vite, semantic HTML5, and responsive CSS for the frontend.
- To keep the classroom assignment simple, this version does not require a backend, user accounts, or a database.
- Use the Web Audio API and `navigator.mediaDevices.getUserMedia()`.
- Use React components and modules to separate configuration, audio detection, game state, internationalization, settings, and UI logic.
- Use `localStorage` to preserve language and game progress.
- Raw microphone audio must never be uploaded or stored; all processing happens in the browser.
- Support modern desktop browsers; every control must be keyboard-accessible and meet basic WCAG 2.1 AA contrast requirements.
- Keep the primary game dashboard within one desktop screen when practical; use a clear vertical responsive layout and touch-friendly controls on phones.

### 5. Acceptance Criteria

- After permission is granted, the page reads the microphone and updates the sound indicator.
- Seedlings are added when the configured conditions are met.
- Every 10 seedlings are correctly converted into one mature tree.
- Pause and reset work correctly.
- Chinese and English can be switched without reloading.
- The settings menu changes the language, theme, and allowed game parameters.
- Every status remains identifiable through text, icons, or patterns in color-blind-friendly themes.
- Configuration changes take effect from one central module.
- The browser console contains no unhandled errors.
