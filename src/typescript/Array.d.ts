interface Array<T> {
	filter<
		_DefinedItem extends Exclude<T, undefined>
	>(
		predicate: (value: T, index: number, array: T[]) => value is _DefinedItem,
		thisArg?: unknown
	): (
		_DefinedItem[]
	)
}
