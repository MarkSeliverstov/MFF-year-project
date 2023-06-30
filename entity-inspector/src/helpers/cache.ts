import { EIClass } from './types';

export class Cache{
    private data: EIClass[] = [];

    public  getCache(): EIClass[] {
        return this.data;
    }

    public setCache(newData: EIClass[]): void {
        this.data = newData;
    }

    public clearCache(): void {
        this.data = [];
    }

}