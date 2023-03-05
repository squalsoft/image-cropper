export interface Uploader {
    /**
     * Метод для отправки изображения на обрезку по заданным координатам
     * @param file
     * @param region
     */
    uploadFileForCut(file: File, region: Region): Promise<void>;
}