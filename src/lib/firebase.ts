// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtx2OV1to7ba5VwghivNWxWC1Z8j-NIpA",
  authDomain: "gitinsight-4e13a.firebaseapp.com",
  projectId: "gitinsight-4e13a",
  storageBucket: "gitinsight-4e13a.firebasestorage.app",
  messagingSenderId: "646056224278",
  appId: "1:646056224278:web:42eaea9729681d59163737"
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