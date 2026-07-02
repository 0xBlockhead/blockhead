// Generated from APP.ts. Do not edit by hand.

import { sourceProviderDefinitions, sourceProviders } from '$/sources/$sourceProviders.ts'
import { enabledSourcesFromBindings, indexSourceProviders, type SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceCredentialScope, SourceDelivery, type SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { validateSourceBindings } from '$/sources/validateSourceBindings.ts'
import { env as publicEnv } from '$env/dynamic/public'

export {
	Source,
	sourceProviders,
}

export type SourceDefinition = SourceDefinitionTemplate<SourceProviderDefinition['provider'], Source>

export type { SourcePublicEnv } from '$/sources/$sources.ts'

const browserDeliveries = new Set([
	SourceDelivery.BrowserDirect,
	SourceDelivery.HttpProxy,
	SourceDelivery.RemoteQuery,
	SourceDelivery.RemoteLive,
])

export const sourceBindings = validateSourceBindings(
	sourceProviderDefinitions.flatMap((provider) => provider.bindings)
		.filter((binding) => (
			browserDeliveries.has(binding.delivery)
			&& binding.credentials.every((credential) => (
				credential.scope === SourceCredentialScope.None
				|| credential.scope === SourceCredentialScope.PublicConfig
				|| credential.scope === SourceCredentialScope.UserDelegated
			))
		))
) satisfies readonly SourceBinding[]

export const sources = sourceProviderDefinitions.flatMap((provider) => provider.sources)

export const enabledSources = enabledSourcesFromBindings<Source>(sourceBindings)

export const {
	resolverPublicEnvBySource,
} = indexSourceProviders(sourceProviders, publicEnv)
