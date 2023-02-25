import {IRegionParser} from '../interfaces/region-parser';

export class RegionParser implements IRegionParser {
    parseBody(body: any): Region | undefined {
        const region = {
            left: Number(body.left),
            top: Number(body.top),
            width: Number(body.width),
            height: Number(body.height),
        }
        let k: keyof typeof region;

        for (k in region) {
            if (!region[k]) return undefined;
        }

        return region;
    }
}