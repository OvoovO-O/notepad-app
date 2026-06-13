export interface User {
  id: string
  email: string
  nickname: string
  avatar: string | null
  createdAt: number
}

export interface Note {
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

export interface NoteContent {
  text: string
  drawing: string | null
  images: Attachment[]
  recordings: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  mimeType: string
  path: string
  insertedAt: number
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  color: string
  icon: string
  createdAt: number
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface SharePermission {
  noteId: string
  sharedBy: string
  sharedWith: string
  permission: 'read' | 'edit'
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  createdAt: number
}

export interface UserSettings {
  userId: string
  globalShortcut: string
  receiveEnabled: boolean
  receiveWhitelist: string[]
  defaultTheme: string
}
