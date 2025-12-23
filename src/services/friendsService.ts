import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import type { FriendRequest } from '../types'

const COLLECTION_NAME = 'friend_requests'

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const friendsService = {
  async sendRequest(from: string, to: string): Promise<FriendRequest> {
    const q = query(collection(db, COLLECTION_NAME), where('from', '==', from), where('to', '==', to))
    const snap = await getDocs(q)
    if (!snap.empty) throw new Error('Запрос уже отправлен')

    const request: FriendRequest = {
      id: randomId(),
      from,
      to,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), request)
    return { ...request, id: docRef.id }
  },

  async acceptRequest(requestId: string, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, requestId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Запрос не найден')
    const data = snap.data() as FriendRequest
    if (data.to !== userId) throw new Error('Нет прав принять этот запрос')

    await updateDoc(docRef, { status: 'accepted' })

    const userService = await import('./userService')
    await userService.userService.addFriend(data.from, data.to)
    await userService.userService.addFriend(data.to, data.from)
  },

  async rejectRequest(requestId: string, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, requestId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) throw new Error('Запрос не найден')
    const data = snap.data() as FriendRequest
    if (data.to !== userId) throw new Error('Нет прав отклонить этот запрос')

    await updateDoc(docRef, { status: 'rejected' })
  },

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const userService = await import('./userService')
    await userService.userService.removeFriend(userId, friendId)
    await userService.userService.removeFriend(friendId, userId)
  },

  async getFriends(userId: string): Promise<string[]> {
    const userService = await import('./userService')
    const user = await userService.userService.getUser(userId)
    return user?.friends ?? []
  },

  async getRequests(userId: string): Promise<FriendRequest[]> {
    const q = query(collection(db, COLLECTION_NAME), where('to', '==', userId), where('status', '==', 'pending'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FriendRequest))
  },

  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    const q = query(collection(db, COLLECTION_NAME), where('from', '==', userId), where('status', '==', 'pending'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FriendRequest))
  }
}
