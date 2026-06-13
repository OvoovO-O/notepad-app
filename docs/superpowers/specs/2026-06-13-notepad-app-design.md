 # Notepad App — 全平台記事本設計文檔

 > 建立日期：2026-06-13
 > 狀態：定稿

 ## 1. 專案概觀

 全平台記事本應用，支援文字、手繪、圖片、錄音等筆記形式。目標使用者為學生與上班族，用於輔助日常記錄。

 ### 核心特色

 - 多平台支援：Web、桌面（Windows/Mac）、手機（iOS/Android）
 - 筆記卡片式 UI，可自由調整大小
 - 桌面版全域快捷鍵喚出快速筆記，自動偵測目前網站/視窗並關聯
 - 雲端帳號系統，支援跨裝置同步
 - 筆記傳送功能（可編輯/唯讀）+ 接收權限控制
 - 可更換主題與背景特效

 ## 2. 技術方案

 | 項目 | 選擇 |
 |---|---|
 | 架構 | Monorepo（pnpm workspaces + Turborepo） |
 | 前端框架 | React + TypeScript |
 | Web 版 | React + Vite + PWA |
 | 桌面版 | Tauri（Rust + React） |
 | 手機版 | React Native |
 | 後端 | Node.js + Express/Fastify |
 | 資料庫 | PostgreSQL（雲端）+ SQLite（本地快取） |
 | 即時同步 | WebSocket |
 | 認證 | JWT |
 | 測試 | Vitest + React Testing Library + Playwright |

 ## 3. 系統架構

 ```text
 Monorepo (pnpm workspaces)
 ├── packages/
 │   ├── core/                  # 共享核心：資料模型、儲存抽象層
 │   ├── shared-ui/             # 共用 UI 元件
 │   ├── rich-editor/           # 編輯器核心（文字+畫布+媒體）
 │   └── cloud-client/          # 雲端 API 客戶端
 ├── apps/
 │   ├── web/                   # React + Vite + PWA 網頁版
 │   ├── desktop/               # Tauri + React 桌面版
 │   ├── mobile/                # React Native 手機版
 │   └── server/                # Node.js 後端
 ```

 ### 資料流

 - **桌面版**：Tauri Rust 後端偵測前景視窗 → 取得 URL → React UI 顯示關聯筆記 → 本地 SQLite 快取 + 雲端同步
 - **網頁版**：瀏覽器直接使用 → IndexedDB 本地儲存 + 雲端同步
 - **手機版**：原生拍照/錄音/手繪 → 本地 SQLite + 雲端同步

 ## 4. 資料模型

 ### Note（筆記）

 ```typescript
 interface Note {
   id: string
   userId: string
   title: string
   content: NoteContent
   themeId: string
   size: { width: number; height: number }
   position: { x: number; y: number }
   tags: string[]
   folderId: string | null
   linkedUrl: string | null
   linkedApp: string | null
   version: number
   createdAt: number
   updatedAt: number
   deletedAt: number | null
 }
 ```

 ### NoteContent（筆記內容）

 ```typescript
 interface NoteContent {
   text: string
   drawing: Blob | null
   images: ImageAttachment[]
   recordings: AudioAttachment[]
 }
 ```

 ### SharePermission（分享權限）

 ```typescript
 interface SharePermission {
   noteId: string
   sharedBy: string
   sharedWith: string
   permission: 'read' | 'edit'
   status: 'pending' | 'accepted' | 'rejected' | 'blocked'
   createdAt: number
 }
 ```

 ### 其他模型

 - **User** — id, email, nickname, avatar
 - **Folder** — id, name, parentId, color, icon
 - **Tag** — id, name, color
 - **UserSettings** — globalShortcut, receiveEnabled, receiveWhitelist, defaultTheme

 ## 5. 使用者介面

 ### 模式 A：主 App 介面

 - 側邊欄：資料夾樹 + 標籤列表
 - 主區域：筆記卡片網格，可自由拖曳排列
 - 頂部：搜尋列、新增筆記、換主題
 - 筆記卡片：可拖曳右下角調整大小

 ### 模式 B：快捷鍵快速筆記（桌面版）

 - 觸發：Ctrl+Shift+N（可自訂）
 - 背景：半透明黑色遮罩（60-70%透明度），原網站內容穿透可見
 - 關閉按鈕置頂右上角
 - 筆記卡片置中顯示，可快速輸入/錄音/繪圖
 - 右側工具列貼齊螢幕右邊緣：新增筆記、設定、回到主畫面、關閉
 - 自動偵測並關聯當前前景視窗 URL

 ## 6. 快捷鍵與全域功能（桌面版）

 | 功能 | 行為 |
 |---|---|
 | 全域快捷鍵 | Tauri 全域快捷鍵註冊，任何軟體中觸發 |
 | 視窗偵測 | Rust 後端取得前景視窗標題，解析網址 |
 | 系統匣 | 常駐系統匣，關閉主視窗不退出 |
 | 自動儲存 | 每次編輯變更即寫入本地，關閉自動同步 |

 ## 7. 傳送功能

 - 分享筆記時可設定權限：「唯讀」或「可編輯」
 - 接收者收到後會出現在自己的筆記列表中
 - 設定頁面可關閉「允許接收」或設定白名單
 - 透過後端 WebSocket 即時推送

 ## 8. 主題系統

 支援可更換主題與背景特效，初始主題包含：
 - 經典白、暗夜、便條紙（淡黃紙紋）、極簡灰（毛玻璃）
 - 波紋（動態水波）、星空（粒子飄動）、木紋（仿真木紋）

 ## 9. 錯誤處理策略

 | 層級 | 處理方式 |
 |---|---|
 | 儲存層 | 讀寫失敗 → Toast 提示；空間不足提示；損毀 → 備份還原 |
 | 網路層 | 離線佇列 + 連線後自動同步；衝突以最新版本為準 |
 | 快捷鍵層 | 快捷鍵衝突提示；無法偵測視窗則顯示空白筆記 |
 | 原生層 | 權限未開啟 → 引導至系統設定 |

 ## 10. 測試策略（MVP）

 1. **packages/core 單元測試**（Vitest）— 資料模型、工具函式、儲存層介面
 2. **Web 版 Playwright 整合測試** — 註冊 → 建立 → 編輯 → 搜尋 → 傳送流程
 3. 其餘測試後續補上

 ## 11. 未來擴展

 - 雲端同步正式上線
 - 跨網際網路點對點直連傳送
 - 協作編輯（多人即時編輯同一筆記）
 - AI 輔助（自動摘要、標籤建議）
