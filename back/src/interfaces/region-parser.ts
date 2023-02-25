export interface IRegionParser {
    parseBody(body: any): Region | undefined;
}