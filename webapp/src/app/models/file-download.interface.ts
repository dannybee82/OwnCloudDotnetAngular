export interface FileDownload {
	fileMimeType: string,
	fileBase64: string,
	fileName: string,
	hasErrors: boolean,
	errorMessage?: string
}
