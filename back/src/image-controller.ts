import {Express, Request, Response} from 'express';
import * as multer from 'multer';
import {IController} from './interfaces/controller';
import {ImageService} from './services/image-service';
import {RegionParser} from './parsers/region-parser';

const upload = multer();

export class ImageController implements IController {
    constructor(public readonly imageService: ImageService,
                public readonly regionParser: RegionParser) {
    }

    setup(app: Express) {
        app.post('/resize', upload.single('image'), async (req: Request, res: Response) => {
            const region = this.regionParser.parseBody(req.body)

            if (!req.file || !region) {
                res.sendStatus(400);
                return;
            }

            const resizedBuf = await this.imageService.crop(req.file.buffer, region);

            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${req.file.originalname}"`,
                'Content-Type': req.file.mimetype,
            });

            res.end(resizedBuf);
        });

    }
}
