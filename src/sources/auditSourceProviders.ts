import { Source } from '$/sources/Source.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export const auditSourceProviders = (
	sourceProviders: readonly SourceProviderDefinition[]
) => {
	const sourceRows = new Set(
		sourceProviders.flatMap((provider) => Object.keys(provider.sources))
	)
	const bindingSources = new Set(
		sourceProviders.flatMap((provider) => Object.values(provider.bindings).flatMap((bindings) => bindings ?? []).map((binding) => binding.source))
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
			const providerSourceRows = new Set(Object.keys(provider.sources))
			return Object.values(provider.bindings).flatMap((bindings) => bindings ?? [])
				.filter((binding) => !providerSourceRows.has(binding.source))
				.map((binding) => `${provider.provider}:${binding.source}`)
		}),
		providersWithoutBindings: sourceProviders
			.filter((provider) => Object.values(provider.bindings).flatMap((bindings) => bindings ?? []).length === 0)
			.map((provider) => provider.provider),
	}
}
