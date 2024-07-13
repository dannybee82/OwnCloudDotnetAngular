import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'files-list',
        component: FileListComponent        
    },
    {
        path: 'upload-file',
        component: UploadFileComponent        
    },
    {
        path: 'upload-files',
        component: UploadFilesComponent        
    }
];
