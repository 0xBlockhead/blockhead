type KeysOfUnion<_Union> = _Union extends _Union ? keyof _Union : never

type ValueAtUnionKey<
	_Union,
	_Key extends PropertyKey,
> = _Union extends Record<_Key, infer _Value> ? _Value : never

type ObjectUnionValue<_Value> = (
	[_Value] extends [object] ?
		ObjectUnion<_Value>
	:
		_Value
)

type ObjectUnion<_Union> = (
	& {
		readonly [_Key in keyof _Union]: ObjectUnionValue<ValueAtUnionKey<_Union, _Key>>
	}
	& {
		readonly [_Key in Exclude<KeysOfUnion<_Union>, keyof _Union>]?: ObjectUnionValue<ValueAtUnionKey<_Union, _Key>>
	}
)

export type PartialObjectUnion<_Union> = {
	readonly [_Key in KeysOfUnion<_Union>]?: ObjectUnionValue<ValueAtUnionKey<_Union, _Key>>
}
