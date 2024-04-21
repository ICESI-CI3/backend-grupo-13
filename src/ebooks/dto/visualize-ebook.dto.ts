export class VisualizeEbookDto {
    title: string;
    fileData: string; //base64
    
    constructor(title: string, fileData: string) {
        this.fileData = fileData;
        this.title = title
    }
}