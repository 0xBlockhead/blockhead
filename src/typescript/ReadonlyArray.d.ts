interface ReadonlyArray<T> {
	map<
		const _Array extends readonly T[],
		_U,
	>(
		this: _Array & (number extends _Array['length'] ? never : unknown),
		callbackfn: (
			value: _Array[number],
			index: number,
			array: _Array,
		) => _U,
		thisArg?: unknown,
	): { readonly [_Index in keyof _Array]: _U }

	map<U>(
		callbackfn: (value: T, index: number, array: readonly T[]) => U,
		thisArg?: unknown,
	): U[]
}
