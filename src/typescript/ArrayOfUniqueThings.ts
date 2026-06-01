type UnionToIntersection<_U> = (
	_U extends any ? (_x: _U) => void : never
) extends (_x: infer _I) => void ? _I : never

type LastInUnion<_U> = (
	UnionToIntersection<_U extends any ? () => _U : never> extends () => infer _R ? _R : never
)

type UnionMemberCount<_U, _Acc extends 0[] = []> = (
	[_U] extends [never]
		? _Acc['length']
		:
			UnionMemberCount<
			Exclude<_U, LastInUnion<_U>>,
			[..._Acc, 0]
		>
)

type StringValueOfEachUnionMember<_U> = (
	_U extends _U
		? `${_U & string}`
		:
			never
)

type TupleSourceUnion<_Union extends PropertyKey> = (
	[Extract<_Union, string>] extends [never]
		? _Union
		:
			StringValueOfEachUnionMember<Extract<_Union, string>>
)

type PermutationTuple<
	_Union extends PropertyKey,
	_First = _Union,
> = (
	[_Union] extends [never]
		? readonly []
		:
			_First extends _First
			? readonly [_First, ...PermutationTuple<Exclude<_Union, _First>>]
			:
				never
)

type TupleOfIdRecords<
	_Tuple extends readonly PropertyKey[],
	_Key extends PropertyKey,
> = (
	_Tuple extends readonly [infer _Head, ...infer _Rest]
		? _Head extends PropertyKey
			? readonly [Record<_Key, _Head>, ...TupleOfIdRecords<_Rest, _Key>]
			:
				never
		:
			readonly []
)

export type ArrayOfUniqueThings<
	_Union extends PropertyKey,
	_Key extends PropertyKey = 'id',
> = (
	UnionMemberCount<_Union> extends 1 | 2 | 3 | 4
		? TupleOfIdRecords<PermutationTuple<TupleSourceUnion<_Union>>, _Key>
		:
			never
)
