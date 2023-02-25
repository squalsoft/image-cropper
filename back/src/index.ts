import * as express from 'express';
import {Request, Response} from 'express';
import {ImageService} from './services/image-service';
import {RegionParser} from "./helpers/region-parser";
import {ImageController} from './image-controller';

const app = express();
const {
    PORT = 3000,
} = process.env;

const imageController = new ImageController(new ImageService(), new RegionParser());
imageController.setup(app);

// Этот обработчик просто для проверки
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Сервер работает',
    });
});

app.listen(PORT, () => {
    console.log('server started at http://localhost:' + PORT);
});