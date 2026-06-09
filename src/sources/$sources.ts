import type { Type } from 'arktype'

export type SourcePublicEnv = {
	readonly [key: string]: string
	readonly [key: `PUBLIC_${string}`]: string
}

export type SourceDefinition<
	_SourceProvider,
	_Source,
> = {
	provider: _SourceProvider
	source: _Source
	label: string
	env?: Type<SourcePublicEnv>
}
