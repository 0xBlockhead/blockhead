import { Source } from '$/sources/Source.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export const auditSourceProviders = (
	sourceProviders: readonly SourceProviderDefinition[]
) => {
	const sourceRows = new Set(
		sourceProviders.flatMap((provider) => provider.sources.map((source) => source.source))
	)
	const bindingSources = new Set(
		sourceProviders.flatMap((provider) => provider.bindings.map((binding) => binding.source))
	)
	const sourceEnumMembers = Object.values(Source)

	return {
		sourceEnumMembers,
		sourceRows,
		bindingSources,
		missingSourceRows: sourceEnumMembers.filter((source) => !sourceRows.has(source)),
		sourcesWithoutBindings: sourceEnumMembers.filter((source) => !bindingSources.has(source)),
		bindingSourcesWithoutRows: [...bindingSources].filter((source) => !sourceRows.has(source)),
		bindingsOutsideProviderRows: sourceProviders.flatMap((provider) => {
			const providerSourceRows = new Set(provider.sources.map((source) => source.source))
			return provider.bindings
				.filter((binding) => !providerSourceRows.has(binding.source))
				.map((binding) => `${provider.provider}:${binding.source}`)
		}),
		providersWithoutBindings: sourceProviders
			.filter((provider) => !provider.bindings.length)
			.map((provider) => provider.provider),
	}
}
