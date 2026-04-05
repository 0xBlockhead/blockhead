type _ObjectEntry = readonly [PropertyKey, unknown]
type _ObjectEntryKey<_Entry extends _ObjectEntry> = _Entry[0]
type _ObjectEntryValueByKey<
	_Entries extends readonly _ObjectEntry[],
	_Key extends PropertyKey,
> = Extract<_Entries[number], readonly [_Key, unknown]>[1]

interface ObjectConstructor {
	keys<_Object extends Record<PropertyKey, unknown>>(object: _Object): Array<keyof _Object>

	values<_Object extends Record<PropertyKey, unknown>>(object: _Object): Array<_Object[keyof _Object]>

	entries<_Object extends Record<PropertyKey, unknown>>(
		object: _Object,
	): Array<{ [_Key in keyof _Object]: [_Key, _Object[_Key]] }[keyof _Object]>

	fromEntries<const _Entries extends readonly _ObjectEntry[]>(
		entries: _Entries,
	): {
		[_Entry in _Entries[number] as _ObjectEntryKey<_Entry>]: _ObjectEntryValueByKey<
			_Entries,
			_ObjectEntryKey<_Entry>
		>
	}

	fromEntries<_Key extends PropertyKey, _Value>(
		entries: ReadonlyArray<readonly [_Key, _Value]>,
	): Record<_Key, _Value>

	groupBy<
		const _Items extends readonly object[],
		_KRet extends PropertyKey,
	>(
		items: _Items,
		keySelector: (item: _Items[number], index: number) => _KRet,
	): Record<_KRet, _Items[number][]>
}
