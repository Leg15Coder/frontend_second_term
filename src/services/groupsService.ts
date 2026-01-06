import { db } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import type { Group } from '../types'

const COLLECTION_NAME = 'groups'

export const groupsService = {
  async getGroups(): Promise<Group[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group))
    } catch (error) {
      console.error('Error fetching groups:', error)
      return []
    }
  },

  async getGroupById(id: string): Promise<Group | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const snap = await getDoc(docRef)
      if (!snap.exists()) return null
      return { id: snap.id, ...snap.data() } as Group
    } catch (error) {
      console.error('Error fetching group:', error)
      return null
    }
  },

  async createGroup(group: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    try {
      const newGroup = {
        ...group,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: group.members ?? [group.ownerId],
      }
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newGroup)
      return { ...newGroup, id: docRef.id }
    } catch (error: any) {
      console.error('Error creating group:', error)
      const errorMessage = error?.message || String(error)
      const errorCode = error?.code || ''

      if (errorCode.includes('permission') || errorMessage.toLowerCase().includes('permission')) {
        throw new Error('Недостаточно прав для создания группы. Убедитесь, что правила Firestore опубликованы (firebase deploy --only firestore:rules)')
      }

      throw new Error(errorMessage)
    }
  },

  async updateGroup(id: string, data: Partial<Group>): Promise<Group> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }
      const { id: _, ...cleanData } = updateData as any

      await updateDoc(docRef, cleanData)

      const snap = await getDoc(docRef)
      if (!snap.exists()) throw new Error('Group not found')

      return { id: snap.id, ...snap.data() } as Group
    } catch (error: any) {
      console.error('Error updating group:', error)
      const errorMessage = error?.message || String(error)
      const errorCode = error?.code || ''

      if (errorCode.includes('permission') || errorMessage.toLowerCase().includes('permission')) {
        throw new Error('Недостаточно прав для обновления группы. Вы должны быть владельцем или участником.')
      }

      throw new Error(errorMessage)
    }
  },

  async deleteGroup(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id))
    } catch (error: any) {
      console.error('Error deleting group:', error)
      const errorMessage = error?.message || String(error)
      const errorCode = error?.code || ''

      if (errorCode.includes('permission') || errorMessage.toLowerCase().includes('permission')) {
        throw new Error('Недостаточно прав для удаления группы. Вы должны быть владельцем.')
      }

      throw new Error(errorMessage)
    }
  },

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    try {
      const docRef = doc(db, COLLECTION_NAME, groupId)

      await updateDoc(docRef, {
        members: arrayUnion(userId),
        updatedAt: new Date().toISOString()
      })

      const snap = await getDoc(docRef)
      if (!snap.exists()) throw new Error('Group not found')
      return { id: snap.id, ...snap.data() } as Group
    } catch (error: any) {
      console.error('Error joining group:', error)
      const errorMessage = error?.message || String(error)
      const errorCode = error?.code || ''

      if (errorCode.includes('permission') || errorMessage.toLowerCase().includes('permission')) {
        throw new Error('Недостаточно прав для присоединения к группе. Убедитесь, что правила Firestore опубликованы.')
      }

      throw new Error(errorMessage)
    }
  },

  async leaveGroup(groupId: string, userId: string): Promise<Group> {
    const docRef = doc(db, COLLECTION_NAME, groupId)

    await updateDoc(docRef, {
      members: arrayRemove(userId),
      updatedAt: new Date().toISOString()
    })

    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Group not found')
    return { id: snap.id, ...snap.data() } as Group
  },
}
