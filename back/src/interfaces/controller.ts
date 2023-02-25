import {Express} from 'express';

export interface IController {
    setup(app: Express): void;
}