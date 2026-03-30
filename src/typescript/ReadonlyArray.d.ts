interface ReadonlyArray<T> {
	map<
		const _Array extends readonly { readonly entityType: PropertyKey }[],
	>(
		this: _Array,
		callbackfn: (
			value: _Array[number],
			index: number,
			array: _Array,
		) => readonly [PropertyKey, unknown],
	): {
		readonly [_Index in keyof _Array as (
			_Index extends number ?
				number extends _Index ?
					never
				:
					_Index
			:
				_Index extends `${number}` ?
					_Index
				:
					never
		)]: readonly [_Array[_Index]['entityType'], _Array[_Index]]
	}
}
