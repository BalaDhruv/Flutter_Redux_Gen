import { getFormattedReducerName, getFormattedStateName } from "../utils/utils";

class ParentSet{
    
}

function _getParentSetStateCode(name: string) {
	const sName = getFormattedStateName(name);
	return `
class ${sName}State {

    ${sName}State();

    factory ${sName}State.initial() => ${sName}State();

    @override
    bool operator ==(other) =>
        identical(this, other) ||
        other is ${sName}State &&
            runtimeType == other.runtimeType;

    @override
    int get hashCode =>
        super.hashCode;

    @override
    String toString() {
    return "${sName}State { }";
    }
}
	`;
}

function _getParentSetReducerCode(name: string) {
    const sName = getFormattedStateName(name);
    const rName = getFormattedReducerName(name);
    return `
import './${name}.state.dart';
${sName}State ${rName}Reducer(${sName}State state, action) => ${sName}State();
	`;
}

function _getParentSetMiddlewareCode(name: string) {
	const rName = getFormattedReducerName(name);
	const sName = getFormattedStateName(name);
    return `
import 'package:redux/redux.dart';
import './${name}.state.dart';

List<Middleware<${sName}State>> ${rName}Middleware() {
//   final Middleware<${sName}State> _login = login(_repo);

return [
    // TypedMiddleware<${sName}State, LoginAction>(_login),
];
}
	`;
}


export var getParentSetStateCode = _getParentSetStateCode;
export var getParentSetReducerCode = _getParentSetReducerCode;
export var getParentSetMiddlewareCode = _getParentSetMiddlewareCode;






