import * as sharp from 'sharp';
import {IImage} from '../interfaces/image';

/**
 * Сервис для работы с изображениями
 */
export class ImageService implements IImage {
    /**
     * Обрезка картинки по заданным параметрам
     * @param inputBuffer
     */
    async crop(inputBuffer: Buffer, region: Region) {
        return await sharp(inputBuffer)
            .extract(region).toBuffer();
    }
}