import { getFormattedReducerName, getFormattedStateName } from "../utils/utils";

function _getReducerGenCode(name: string) {
	const rName = getFormattedReducerName(name);
	const sName = getFormattedStateName(name);
	return `
import 'package:redux/redux.dart';
import './${name}.state.dart';

final ${rName}Reducer = combineReducers<${sName}State>([
]);
	`;
}

export var getReducerGenCode = _getReducerGenCode;