import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import app from '../firebase'

const storage = getStorage(app)

export const storageService = {
  uploadAvatar: (file: File, path: string, onProgress?: (p: number) => void) => {
    const storageRef = ref(storage, path)
    return new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) onProgress(progress)
      }, (error) => reject(error), async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(url)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

