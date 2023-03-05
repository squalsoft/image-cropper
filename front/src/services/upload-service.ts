import {Uploader} from '../interfaces/uploader';

export class UploadService implements Uploader {
    constructor(private readonly url: string) {
    }

    async uploadFileForCut(file: File, region: Region) {
        const actionUrl = `${this.url}/resize`;
        const formData = new FormData();

        formData.append('image', file);

        formData.append('left', region.left.toString());
        formData.append('top', region.top.toString());
        formData.append('width', region.width.toString());
        formData.append('height', region.height.toString());

        await fetch(actionUrl, {
            method: 'POST',
            body: formData
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cutted_' + file.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        ;
    }
}