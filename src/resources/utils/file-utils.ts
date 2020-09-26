import * as vscode from 'vscode';
import * as fs from 'fs';
import { clearParentSet } from './storage';

function _createFile(fPath: string, name: string, extention: string, getGenCode: Function, showInfo: boolean) {
    const pathWithFileName = fPath + '/' + name.toLocaleLowerCase() + extention;
    fs.writeFile(pathWithFileName, getGenCode(name), err => {
        if (err) {
            vscode.window.showInformationMessage('Please check your path. Otherwise file a issue in Git Repo. Let me help.');
        } else if (showInfo) {
            vscode.window.showInformationMessage(`${name}${extention} Created Successfully.`);
        }
    });
}

function _createFolder(fPath: string, name: string): boolean {
    if (!fs.existsSync(fPath + "/" + name)) {
        fs.mkdirSync(fPath + "/" + name);
        return true;
    } else {
        vscode.window.showErrorMessage('Folder Already Exist');
        return false;
    }
}

function _isParentSetExist(context: vscode.ExtensionContext) {
    if (context.workspaceState.get("PARENT_PATH") && fs.existsSync(context.workspaceState.get("PARENT_PATH") as string)) {
        return true;
    } else {
        clearParentSet(context);
        return false;
    }

}

export var createFile = _createFile;
export var createFolder = _createFolder;
export var isParentSetExist = _isParentSetExist;