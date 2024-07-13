### **OwnCloud + dotnet/C# API + Angular 18 app**

A demo that works on localhost and in development-mode only.

*   Runs OwnCloud/Server in a docker-container.
*   Backend: dotnet/C# Web API.
*   Frontend: Angular 18 app

Change the ports, usernames and passwords in **docker-compose.yml** to the needs.

### To create docker-container:

**docker-compose up --build -d**

### **Backend: dotnet/C# web API**

The backend/web API needs an **OwnCloud-Token**.

To get this **token** follow the steps: 

_Login to OwnCloud_ -> Upper right / username -> _Settings_ \-> Tab at left: _Security_.

In CORS and White-listed Domains: add:  
**https://localhost:5001**

Below in the **Security Tab**:  
Type an app name and click '_Create new app passcode_' (which will be visibile only once).

Copy and paste this _token_ to **appsettings.Development.json** \- see the _WebDAV_ section:

 `"OwnCloudToken": "OWN_CLOUD_TOKEN_HERE",`

The backend allows the following file formats:

*   _images:_ jpg, png, gif
*   _documents:_ pdf, doc, docx, rtf, odt

To add more file formats, see the lines in **Program.cs** and extend this to the needs

`var allowedFileList = new AllowedFileFormatList()`  
`{`  
`AllowedFileList = new List<AllowedFileFormat>()`  
`{`  
`new AllowedFileFormat()`  
`{`  
`Extension = "jpg",`  
`FileFormat = FileFormatLocator.GetFormats().OfType<FileSignatures.Formats.Jpeg>()`  
`}, //(...)`

### **Frontend: Angular 18 app**

Install packages:

**npm install**

or the short command:

**npm i**

Command to run the Angular app:

**ng serve --open**

or the short command:

**ng s --o**

To allow more file-formats in the frontend, change the code:

`export class LoadFilesInBrowserService {`

`private _allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'gif'];`

`private _allowedTypes: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf', 'text/csv', 'image/gif'];`

And change code in the templates:

`<app-open-file`

`[fileExtensions]="'application/pdf,image/jpg,image/jpeg,image/png,image/gif,text/csv'"`

`[buttonClass]="'bi bi-file-earmark'"`

`[buttonText]="'Select File'"`

`(selectedFile)="this.loadFile($event)">`

`</app-open-file>`

See the root of this project for example-images.