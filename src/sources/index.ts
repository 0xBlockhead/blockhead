import sourceProviders from '$/sources/$sourceProviders.ts'
import { enabledSourcesFromBindings, indexSourceProviders, type SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceCredentialScope, SourceDelivery, SourceTargetKind, type SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { env as publicEnv } from '$env/dynamic/public'

export {
	Source,
	sourceProviders,
}

export type SourceDefinition = SourceDefinitionTemplate<Source>

export type { SourcePublicEnv } from '$/sources/$sources.ts'

const browserDeliveries = new Set([
	SourceDelivery.BrowserDirect,
	SourceDelivery.HttpProxy,
	SourceDelivery.RemoteQuery,
	SourceDelivery.RemoteLive,
])

const allSourceBindings = sourceProviders.flatMap((provider): readonly SourceBinding[] => provider.bindings)

export const sourceBindings = allSourceBindings
	.filter((binding) => (
		browserDeliveries.has(binding.delivery)
		&& (
			binding.delivery === SourceDelivery.RemoteQuery
			|| binding.delivery === SourceDelivery.RemoteLive
			|| binding.credentials.every((credential) => (
				credential.scope === SourceCredentialScope.None
				|| credential.scope === SourceCredentialScope.PublicConfig
				|| credential.scope === SourceCredentialScope.UserDelegated
				|| (
					binding.delivery === SourceDelivery.HttpProxy
					&& credential.scope === SourceCredentialScope.RuntimeSecret
				)
			))
		)
	))

export const sources = sourceProviders.flatMap((provider) => provider.sources)

export const enabledSources = enabledSourcesFromBindings<Source>(sourceBindings)

const sourceBindingsBySource = Map.groupBy(allSourceBindings, ({ source }) => source)

export const networkApplicableSources = (
	sourceSelection: readonly Source[],
	network: {
		slug?: string
		caip2?: {
			namespace: string
			reference: string
		}
	}
) => sourceSelection.filter((source) => {
	const bindings = sourceBindingsBySource.get(source)
	return bindings == null || bindings.some(({ target }) => (
		target.kind === SourceTargetKind.NetworkSlug ?
			target.key === network.slug
		: target.kind === SourceTargetKind.Caip2Network ?
			network.caip2 != null && target.key === `${network.caip2.namespace}:${network.caip2.reference}`
		: target.kind === SourceTargetKind.Eip155Chain ?
			network.caip2?.namespace === 'eip155' && target.key === network.caip2.reference
		:
			true
	))
})

export const {
	resolverPublicEnvBySource,
} = indexSourceProviders(sourceProviders, publicEnv)
