import { type as arktype, type Type } from 'arktype'

export type SourcePublicEnv = {
	readonly [key: string]: string
	readonly [key: `PUBLIC_${string}`]: string
}

export type SourceDefinition<
	_SourceProvider extends PropertyKey,
	_Source extends PropertyKey,
> = {
	provider: _SourceProvider
	source: _Source
	label: string
	env?: Type<SourcePublicEnv>
}

export type SourceProviderDefinition<
	_SourceProvider extends PropertyKey,
	_Source extends PropertyKey,
> = {
	provider: _SourceProvider
	label: string
	env?: Type<SourcePublicEnv>
	origins?: readonly {
		origin: string
		corsEnabled: boolean
	}[]
	sources: readonly SourceDefinition<_SourceProvider, _Source>[]
}

export const indexSourceProviders = <
	const _SourceProvider extends PropertyKey,
	const _Source extends PropertyKey,
>(
	sourceProviders: readonly SourceProviderDefinition<_SourceProvider, _Source>[],
	env: Record<string, string | undefined>,
) => {
	const resolverPublicEnv = (
		Object.fromEntries(
			Object.entries(env).map(([key, value]) => [
				key,
				value ?? '',
			]),
		)
	) satisfies SourcePublicEnv

	const envSubsetFromSchema = (
		envSchema: Type<SourcePublicEnv> | undefined,
	): SourcePublicEnv | null => {
		if (envSchema == null)
			return {}

		const subset = Object.fromEntries(
			envSchema.props.map((property) => [
				String(property.key),
				resolverPublicEnv[String(property.key)],
			]),
		) satisfies SourcePublicEnv
		const out = envSchema(subset)
		if (out instanceof arktype.errors)
			return null

		const subsetEntries: [string, string][] = []
		for (const [key, value] of Object.entries(out)) {
			if (value.trim() === '')
				return null
			subsetEntries.push([
				key,
				value,
			])
		}
		return Object.fromEntries(subsetEntries)
	}

	const enabledSourceEntries = sourceProviders.flatMap((sourceProvider) => {
		const providerSubset = envSubsetFromSchema(
			'env' in sourceProvider ?
				sourceProvider.env
			:
				undefined,
		)
		if (providerSubset == null)
			return []

		return sourceProvider.sources.flatMap((sourceDefinition) => {
			const sourceSubset = envSubsetFromSchema(
				'env' in sourceDefinition ?
					sourceDefinition.env
				:
					undefined,
			)
			if (sourceSubset == null)
				return []

			const merged = {
				...providerSubset,
				...sourceSubset,
			}
			return [{
				sourceDefinition,
				publicEnv: (
					Object.keys(merged).length === 0 ?
						resolverPublicEnv
					:
						merged
				),
			}]
		})
	})

	return {
		resolverPublicEnvBySource: new Map(
			enabledSourceEntries.map((entry) => ([
				entry.sourceDefinition.source,
				entry.publicEnv,
			])),
		),
		enabledSources: new Set(
			enabledSourceEntries.map((entry) => entry.sourceDefinition.source),
		),
	}
}
