import * as sharp from 'sharp';

/**
 * Сервис для работы с изображениями
 */
export class ImageService{
    /**
     * Обрезка картинки по заданным параметрам
     * @param inputBuffer
     */
    async crop(inputBuffer: Buffer, region: Region) {
        return await sharp(inputBuffer)
            .extract(region).toBuffer();
    }
}