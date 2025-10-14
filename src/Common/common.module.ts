import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { DbStorageService } from './firebase/db-storage.service';

@Module({
  providers: [FirebaseService,DbStorageService],
  exports: [FirebaseService,DbStorageService], // ✅ This line is required
})
export class CommonModule {}
