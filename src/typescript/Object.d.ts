interface ObjectConstructor {
	keys<_Object extends object>(object: _Object): Array<keyof _Object>

	values<
		_Object extends {
			[key: string]: readonly unknown[] | undefined
			[key: number]: readonly unknown[] | undefined
			[key: symbol]: readonly unknown[] | undefined
		},
	>(
		object: _Object
	): Array<Exclude<_Object[keyof _Object], undefined>>

	values<_Object extends object>(object: _Object): Array<_Object[keyof _Object]>

	entries<
		_Object extends {
			[key: string]: readonly unknown[] | undefined
			[key: number]: readonly unknown[] | undefined
			[key: symbol]: readonly unknown[] | undefined
		},
	>(
		object: _Object
	): Array<{
		[_Key in keyof _Object]-?: (
			Exclude<_Object[_Key], undefined> extends never ?
				never
			:
				readonly [_Key, Exclude<_Object[_Key], undefined>]
		)
	}[keyof _Object]>

	entries<_Object extends object>(
		object: _Object
	): Array<{ [_Key in keyof _Object]-?: readonly [_Key, _Object[_Key]] }[keyof _Object]>

	fromEntries<
		const _Entries extends readonly (readonly [PropertyKey, unknown])[],
	>(
		entries: _Entries
	): {
		[_Entry in _Entries[number] as _Entry[0]]: Extract<
			_Entries[number],
			readonly [_Entry[0], unknown]
		>[1]
	}

	fromEntries<_Key extends PropertyKey, _Value>(
		entries: ReadonlyArray<readonly [_Key, _Value]>
	): Record<_Key, _Value>

	groupBy<
		const _Items extends readonly Record<PropertyKey, unknown>[],
		_Discriminant extends keyof _Items[number],
		_Bucket extends _Items[number][_Discriminant] & PropertyKey,
	>(
		items: _Items,
		keySelector: <_Item extends _Items[number]>(
			item: _Item,
			index: number
		) => _Item[_Discriminant] & _Bucket
	): {
		[_BucketValue in _Bucket]?: Extract<
			_Items[number],
			Record<_Discriminant, _BucketValue>
		>[]
	} & {
		[key: string]: _Items[number][] | undefined
		[key: number]: _Items[number][] | undefined
		[key: symbol]: _Items[number][] | undefined
	}

	groupBy<
		const _Items extends readonly unknown[],
		_KRet extends PropertyKey,
	>(
		items: _Items,
		keySelector: (item: _Items[number], index: number) => _KRet
	): {
		[_Bucket in _KRet]?: _Items[number][]
	} & {
		[key: string]: _Items[number][] | undefined
		[key: number]: _Items[number][] | undefined
		[key: symbol]: _Items[number][] | undefined
	}
}
