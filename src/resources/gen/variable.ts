import * as fs from 'fs';
import * as vscode from 'vscode';

export class AddVariable {


    init(args: any, context: vscode.ExtensionContext) {
        console.log('ADD VARIBALE INIT');
        console.log(args);
        console.log(args.fsPath);
        fs.readFile(args.fsPath, 'utf8', (e, data) => {
            console.log(data);
            console.log(e);
            console.log(context.workspaceState.get("PARENT_PATH"));
            console.log(context.workspaceState.get("PARENT_NAME"));
        });
    }
}