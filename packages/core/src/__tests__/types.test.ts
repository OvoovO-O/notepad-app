import { describe, it, expect } from 'vitest'
import { Note, Folder, Tag, SharePermission, NoteContent, Attachment } from '../types'

describe('Note model', () => {
  it('creates a valid note with required fields', () => {
    const note: Note = {
      id: 'note-1',
      userId: 'user-1',
      title: 'Test Note',
      content: { text: 'Hello', drawing: null, images: [], recordings: [] },
      themeId: 'classic-white',
      size: { width: 300, height: 200 },
      position: { x: 0, y: 0 },
      tags: ['work'],
      folderId: null,
      linkedUrl: null,
      linkedApp: null,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    }
    expect(note.id).toBe('note-1')
    expect(note.content.text).toBe('Hello')
    expect(note.size.width).toBe(300)
  })
})

describe('SharePermission model', () => {
  it('creates a pending share permission', () => {
    const perm: SharePermission = {
      noteId: 'note-1',
      sharedBy: 'user-a',
      sharedWith: 'user-b',
      permission: 'edit',
      status: 'pending',
      createdAt: Date.now()
    }
    expect(perm.status).toBe('pending')
    expect(perm.permission).toBe('edit')
  })
})
