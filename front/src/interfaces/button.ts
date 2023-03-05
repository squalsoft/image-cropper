import {IHidable} from './hidable';

export interface IButton extends IHidable{
    process?: () => Promise<void>;
}