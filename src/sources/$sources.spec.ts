import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'

import { indexSourceProviders } from '$/sources/$sources.ts'
import type { SourceProviderDefinition } from '$/sources/$sources.ts'

const sourceProviders = [
	{
		provider: 'ProviderWithEnv',
		label: 'Provider with env',
		env: arktype({
			PUBLIC_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				provider: 'ProviderWithEnv',
				source: 'ProviderOnlySource',
				label: 'Provider-only source',
			},
			{
				provider: 'ProviderWithEnv',
				source: 'ProviderAndSourceEnvSource',
				label: 'Provider and source env source',
				env: arktype({
					PUBLIC_SOURCE_KEY: 'string',
				}),
			},
			{
				provider: 'ProviderWithEnv',
				source: 'FailingSourceEnvSource',
				label: 'Failing source env source',
				env: arktype({
					PUBLIC_FAILING_SOURCE_KEY: 'string',
				}),
			},
		],
	},
	{
		provider: 'ProviderWithoutEnv',
		label: 'Provider without env',
		sources: [
			{
				provider: 'ProviderWithoutEnv',
				source: 'SourceOnlyEnvSource',
				label: 'Source-only env source',
				env: arktype({
					PUBLIC_SOURCE_ONLY_KEY: 'string',
				}),
			},
			{
				provider: 'ProviderWithoutEnv',
				source: 'OpenSource',
				label: 'Open source',
			},
		],
	},
	{
		provider: 'FailingProvider',
		label: 'Failing provider',
		env: arktype({
			PUBLIC_FAILING_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				provider: 'FailingProvider',
				source: 'ProviderDisabledSource',
				label: 'Provider disabled source',
			},
		],
	},
] as const satisfies readonly SourceProviderDefinition<string, string>[]

describe('source provider registry', () => {
	it('gates providers and sources by env schemas and rejects empty strings', () => {
		const indexed = indexSourceProviders(
			sourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: '   ',
				PUBLIC_FAILING_PROVIDER_KEY: '',
				PUBLIC_EXTRA_KEY: 'extra-public',
			},
		)

		expect(indexed.sources.map((sourceDefinition) => sourceDefinition.source)).toEqual([
			'ProviderOnlySource',
			'ProviderAndSourceEnvSource',
			'SourceOnlyEnvSource',
			'OpenSource',
		])
		expect([...indexed.enabledSources]).toEqual([
			'ProviderOnlySource',
			'ProviderAndSourceEnvSource',
			'SourceOnlyEnvSource',
			'OpenSource',
		])
		expect(indexed.sourceBySource.ProviderDisabledSource).toBeUndefined()
		expect(indexed.sourceBySource.FailingSourceEnvSource).toBeUndefined()
	})

	it('passes full public env only to sources without provider or source env schema', () => {
		const indexed = indexSourceProviders(
			sourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			},
		)

		expect(indexed.resolverPublicEnv).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
			PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
			PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
			PUBLIC_EXTRA_KEY: 'extra-public',
		})
		expect(indexed.resolverPublicEnvBySource.get('OpenSource')).toBe(indexed.resolverPublicEnv)
	})

	it('passes provider env to inherited sources and merged env to source-specific sources', () => {
		const indexed = indexSourceProviders(
			sourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			},
		)

		expect(indexed.resolverPublicEnvBySource.get('ProviderOnlySource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('ProviderAndSourceEnvSource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('SourceOnlyEnvSource')).toEqual({
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
		})
	})
})
