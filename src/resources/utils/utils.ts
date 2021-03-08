import * as fs from 'fs';

function _getFormattedStateName(name: string) {
	return name.split('_').map(word => word[0].toLocaleUpperCase() + word.substring(1)).join('');
}

function _getFormattedReducerName(name: string) {
	return name.split('_').map(word => word[0].toLocaleLowerCase() + word.substring(1)).join('');
}

function _getFilePath(path: string) {
	const syncPath = fs.statSync(path);
	if (syncPath.isFile()) {
		var paths = path.split('/');
		paths.pop();
		return paths.join('/');
	}
	return path;

}

export var getFormattedStateName = _getFormattedStateName;
export var getFormattedReducerName = _getFormattedReducerName;
export var getFilePath = _getFilePath;