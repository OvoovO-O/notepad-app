import { Note, Folder, Tag, SharePermission } from '../types'

export interface StorageAdapter {
  getNote(id: string): Promise<Note | null>
  getAllNotes(userId: string): Promise<Note[]>
  saveNote(note: Note): Promise<void>
  deleteNote(id: string): Promise<void>
  getNotesByUrl(url: string, userId: string): Promise<Note[]>
  getFolders(userId: string): Promise<Folder[]>
  saveFolder(folder: Folder): Promise<void>
  deleteFolder(id: string): Promise<void>
  getTags(userId: string): Promise<Tag[]>
  saveTag(tag: Tag): Promise<void>
  getSharePermissions(noteId: string): Promise<SharePermission[]>
  saveSharePermission(perm: SharePermission): Promise<void>
}
