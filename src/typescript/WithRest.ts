export type WithRest<
	_Base extends object,
	_Rest
> = (
	& _Base
	& Omit<_Rest, keyof _Base>
)
