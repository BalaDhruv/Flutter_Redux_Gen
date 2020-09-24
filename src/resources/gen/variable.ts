import * as fs from 'fs';
import * as vscode from 'vscode';

export class AddVariable {

    fileData: string = '';
    className: string = '';

    init(args: any, context: vscode.ExtensionContext) {
        console.log('ADD VARIBALE INIT');
        console.log(args);
        console.log(args.fsPath);
        fs.readFile(args.fsPath, 'utf8', (e, data) => {
            console.log(data);
            this.fileData = data;
            console.log(e);
            this.getClass();
            console.log(context.workspaceState.get("PARENT_PATH"));
            console.log(context.workspaceState.get("PARENT_NAME"));
        });
    }

    getClass() {
        // console.log(this.fileData);
        console.log(this.fileData.split('\n'));
        const linesOfData = this.fileData.split('\n');
        linesOfData.forEach((line,index)=>{
            // console.log(line);
            // console.log(index);
            console.log(line.includes('class '));
            if(line.includes('class ')){
                console.log(line.split(' '));
            }
        });
        // console.log(linesOfData.filter((line,index,_)=>line.includes('class ')));
    }
}