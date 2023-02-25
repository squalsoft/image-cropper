export interface IImage {
    crop(inputBuffer: Buffer, region: Region): Promise<Buffer>;
}