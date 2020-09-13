import * as vscode from 'vscode';
import * as fs from 'fs';

function _createFile(fPath: string, name: string, extention: string, getGenCode: Function) {
    const pathWithFileName = fPath + '/' + name.toLocaleLowerCase() + extention;
    fs.writeFile(pathWithFileName, getGenCode(name), err => {
        if (err) {
            vscode.window.showInformationMessage('Please check your path. Otherwise file a issue in Git Repo. Let me help.');
        } else {
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


export var createFile = _createFile;
export var createFolder = _createFolder;