type WithoutNeverProperties<_Object> = {
	[_Key in keyof _Object as [_Object[_Key]] extends [never] ? never : _Key]: _Object[_Key]
}

export type WithRest<
	_Base extends object,
	_Rest
> = (
	[_Rest] extends [never] ?
		_Base
	:
	& _Base
		& Omit<WithoutNeverProperties<_Rest>, keyof _Base>
)
