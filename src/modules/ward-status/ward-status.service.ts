import { Injectable } from '@nestjs/common';
import { DbStorageService } from '../../Common/firebase/db-storage.service';

@Injectable()
export class WardStatusService {
    constructor(private readonly dbStorage: DbStorageService) { }

    async getWardStatus() {
        const storagePath = await this.dbStorage.getStoragePath('city');
        if (!storagePath) return [];

        const fileUrl = `${storagePath}%2FDefaults%2FAvailableWard.json?alt=media`;

        const fileBuffer = await this.dbStorage.getFileData(fileUrl);
        if (!fileBuffer) return [];

        const wards: string[] = JSON.parse(fileBuffer.toString());
        if (!wards?.length) return [];

        const availableWards: string[] = [];

        for (const ward of wards) {
            const dbPath = `Tasks/${ward}`;

            try {
                const wardData = await this.dbStorage.getData(dbPath);

                if (wardData && wardData === 'Available') {
                    availableWards.push(ward);
                }
            } catch (err) {
                console.warn(`⚠️ Failed to fetch ${dbPath}: - ward-status.service.ts:32`, err);
            }
        }

        return { success: true, availableWards };
    }
}
