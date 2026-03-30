interface ObjectConstructor {
	keys<
		_Object extends Record<PropertyKey, unknown>
	>(
		object: _Object,
	): (
		Array<keyof _Object>
	)

	values<
		_Object extends Record<PropertyKey, unknown>
	>(
		object: _Object,
	): (
		Array<_Object[keyof _Object]>
	)

	entries<
		_Object extends Record<PropertyKey, unknown>
	>(
		object: _Object,
	): (
		Array<{ [_Key in keyof _Object]: [_Key, _Object[_Key]] }[keyof _Object]>
	)

	fromEntries<
		const _Entries extends readonly (readonly [PropertyKey, unknown])[],
	>(
		entries: _Entries,
	): {
		[_Key in (
			_Entries[number] extends readonly [infer _EntryKey, unknown] ?
				_EntryKey extends PropertyKey ?
					_EntryKey
				:
					never
			:
				never
		)]: (
			Extract<_Entries[number], readonly [_Key, unknown]> extends readonly [PropertyKey, infer _EntryValue] ?
				_EntryValue
			:
				never
		)
	}

	fromEntries<
		const _Entries extends { readonly [_Index: number]: readonly [PropertyKey, unknown] },
	>(
		entries: _Entries,
	): {
		[_Key in (
			_Entries[keyof _Entries] extends readonly [infer _EntryKey, unknown] ?
				_EntryKey extends PropertyKey ?
					_EntryKey
				:
					never
			:
				never
		)]: (
			Extract<_Entries[keyof _Entries], readonly [_Key, unknown]> extends readonly [PropertyKey, infer _EntryValue] ?
				_EntryValue
			:
				never
		)
	}
}
