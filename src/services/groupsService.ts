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
    const newGroup = {
      ...group,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: group.members ?? [group.ownerId],
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newGroup)
    return { ...newGroup, id: docRef.id }
  },

  async updateGroup(id: string, data: Partial<Group>): Promise<Group> {
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
  },

  async deleteGroup(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  },

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    const docRef = doc(db, COLLECTION_NAME, groupId)

    await updateDoc(docRef, {
      members: arrayUnion(userId),
      updatedAt: new Date().toISOString()
    })

    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Group not found')
    return { id: snap.id, ...snap.data() } as Group
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
