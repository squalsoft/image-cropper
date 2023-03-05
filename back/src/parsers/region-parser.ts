export class RegionParser {
    parseBody(body: any): Region | undefined {
        const region = {
            left: Math.round(Number(body.left)),
            top: Math.round(Number(body.top)),
            width: Math.round(Number(body.width)),
            height: Math.round(Number(body.height)),
        }
        let k: keyof typeof region;

        for (k in region) {
            if (!region[k]) return undefined;
        }

        return region;
    }
}