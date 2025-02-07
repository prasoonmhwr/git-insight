// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: 'git-insight-c6e5f.firebasestorage.app',
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file: File, setProgress?: (progress: number) => void){
    return new Promise((resolve,reject)=>{
        try{
            const storageRef = ref(storage,file.name)
            const uploadTask = uploadBytesResumable(storageRef,file)

            uploadTask.on('state_changed', snapshot =>{
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
                if(setProgress) setProgress(progress)
                    switch (snapshot.state){
                        case 'paused':
                            console.log('upload is paused'); break;
                        case 'running':
                            console.log('upload is running'); break;
                    }
            }, error => {
                reject(error)
            },()=>{
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=>{
                    resolve(downloadUrl as string)
                })
            })
        } catch(error){
            console.error(error)
            reject(error)
        }
    })
}