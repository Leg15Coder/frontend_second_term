import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function testFirestoreConnection(userId: string) {
  try {
    const testData = {
      title: 'Test Task',
      completed: false,
      createdAt: new Date().toISOString(),
      userId: userId,
    }
    const docRef = await addDoc(collection(db, 'todos'), testData)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    return { success: false, error: error?.message || String(error) }
  }
}
