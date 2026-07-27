// Generated from APP.ts. Do not edit by hand.

import sourceProviders from '$/sources/$sourceProviders.ts'
import { enabledSourcesFromBindings, indexSourceProviders, type SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceCredentialScope, SourceDelivery, SourceTargetKind, type SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	)) satisfies readonly SourceBinding[]

export const sources = sourceProviders.flatMap((provider) => provider.sources)

export const enabledSources = enabledSourcesFromBindings<Source>(sourceBindings)

const networkTargetKeysBySource = new Map<
	Source,
	readonly { kind: SourceTargetKind; key: string }[] | undefined
>()
for (const { source } of sources) {
	const bindings = allSourceBindings.filter((binding) => binding.source === source)
	const targets = bindings.flatMap(({ target }) => (
		target.kind === SourceTargetKind.Caip2Network ?
			[target]
		: target.kind === SourceTargetKind.NetworkSlug ?
			[target]
		: target.kind === SourceTargetKind.Eip155Chain ?
			[{
				kind: SourceTargetKind.Caip2Network,
				key: `eip155:${target.key}`,
			}]
		:
			[]
	))
	networkTargetKeysBySource.set(
		source,
		targets.length === bindings.length ? targets : undefined
	)
}

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
	const targets = networkTargetKeysBySource.get(source)
	return targets == null || targets.some((target) => (
		target.kind === SourceTargetKind.NetworkSlug ?
			target.key === network.slug
		:
			network.caip2 != null && target.key === `${network.caip2.namespace}:${network.caip2.reference}`
	))
})

export const {
	resolverPublicEnvBySource,
} = indexSourceProviders(sourceProviders, publicEnv)
