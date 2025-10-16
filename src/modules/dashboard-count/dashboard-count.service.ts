import { Injectable } from '@nestjs/common';
import { DbStorageService } from '../../Common/firebase/db-storage.service';

@Injectable()
export class DashboardCountService {
    private readonly dbPath = 'WorkAssignmentSummary/StatusCounts';

    constructor(private readonly dbStorageService: DbStorageService) { }

    /**
     * Fetches the work assignment status counts from Firebase
     */
    async getStatusCounts() {
        try {
            const data = await this.dbStorageService.getData(this.dbPath);
            return { success: true, data };
        } catch (error) {
            return { success: false, message: 'Failed to fetch status counts', error };
        }
    }
}
