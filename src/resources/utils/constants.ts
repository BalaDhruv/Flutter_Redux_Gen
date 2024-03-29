export const EXTENSION = '.dart';
export const STATE_EXTENSION = '.state.dart';
export const REDUCER_EXTENSION = '.reducer.dart';
export const MIDDLEWARE_EXTENSION = '.middleware.dart';
export const ACTION_EXTENSION = '.action.dart';
export const DEFAULT_NAME = 'default';
export const CREATE_STATE_PLACE_HOLDER = 'Enter State Name';
export const ADD_VARIABLE_TO_STATE_PLACEHOLDER = 'Enter Variable Name';
export const CREATE_REDUCER_PLACE_HOLDER = 'Enter Reducer Name';
export const CREATE_MIDDLEWARE_PLACE_HOLDER = 'Enter Middleware Name';
export const CREATE_ACTION_PLACE_HOLDER = 'Enter Action File Name';
export const SELECT_PARENT_SET = 'Select Parent Set';
export const NAME_ERROR_MESSAGE = 'Please use name without space. Consider using "_"';
export const VARIABLE_NAME_ERROR_MESSAGE = 'Please use name without space. Consider using camelCase';
export const NOT_FOUND_ANY_SET_FILE = `Not found any file with '${STATE_EXTENSION}' extension.`;
export const NO_FOLDER_IN_WORKSPACE_FOUND = 'There is no folder in workspace.';
export const CURRENT_PARENT = `Current parent is '<FILE>${STATE_EXTENSION}'`;
export const SUCCESFULLY_SET_PARENT = `Succesfully set '<FILE>' as parent.`;

export const NAME_REG_EXP = /[`0-9 ~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/;
export const STATE_FILE_RELATIVE_PATTERN = `**/*.state.dart`;
