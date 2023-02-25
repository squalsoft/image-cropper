import {Uploader} from './interfaces/uploader';

export class UploadService implements Uploader {
    uploadFile(file: File) {
        const url = 'http://localhost:3000/resize'
        const formData = new FormData()

        formData.append('image', file)

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(() => { /* Done. Inform the user */
            })
            .catch(() => { /* Error. Inform the user */
            })
    }
}