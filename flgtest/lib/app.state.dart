class AppState {
  final bool loading;
  final String error;

  AppState(this.loading, this.error);

  factory AppState.initial() => AppState(false, '');

  AppState copyWith({bool? loading, String? error}) =>
      AppState(loading ?? this.loading, error ?? this.error);

  @override
  bool operator ==(other) =>
      identical(this, other) ||
      other is AppState &&
          runtimeType == other.runtimeType &&
          loading == other.loading &&
          error == other.error;

  @override
  int get hashCode =>
      super.hashCode ^ runtimeType.hashCode ^ loading.hashCode ^ error.hashCode;

  @override
  String toString() => "AppState { loading: $loading,  error: $error}";
}
