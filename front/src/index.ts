import './css/styles.css';
import './css/tabs.css';
import {Gallery} from './components/gallery';
import {GalleryItem} from './interfaces/gallery-item';
import {DropZone} from './components/drop-zone';
import {Tabs} from './components/tabs';
import {Cutter} from './components/cutter';
import {ImageEditor} from './components/image-editor';
import {Uploader} from './interfaces/uploader';
import {UploadService} from './services/upload-service';
import {LoadButton} from './components/load-button';
import {Label} from './components/label';


try {
    const gallery = new Gallery('gallery');
    const dropZone = new DropZone('drop-area', 'file-elem');
    const tabs = new Tabs('tabs');
    const cutter = new Cutter('canvas-image');
    const uploader: Uploader = new UploadService('http://localhost:3000');
    const loadButton = new LoadButton('process');
    const clearButton = new LoadButton('clear');
    const successLabel = new Label('success');

    new ImageEditor(gallery, dropZone, tabs, cutter, loadButton, clearButton, uploader, successLabel).init();
} catch (err) {
    console.log(err);
    alert(err);
}




