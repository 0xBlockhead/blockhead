import sourceProviders, {
	sourceBindings as allSourceBindings,
	sourceBindingsBySource as allSourceBindingsBySource,
} from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceCredentialScope,
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { env as publicEnv } from '$env/dynamic/public'

export {
	Source,
	sourceProviders,
}

export type { SourcePublicEnv } from '$/sources/$sources.ts'

const browserDeliveries = new Set([
	SourceDelivery.BrowserDirect,
	SourceDelivery.HttpProxy,
	SourceDelivery.RemoteQuery,
	SourceDelivery.RemoteLive,
])

export const sourceBindings = allSourceBindings
	.filter((binding) => (
		browserDeliveries.has(binding.delivery)
		&& (
			binding.delivery === SourceDelivery.RemoteQuery
			|| binding.delivery === SourceDelivery.RemoteLive
			|| binding.credentials.every((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig
					|| credential.scope === SourceCredentialScope.UserDelegated
				|| (
					binding.delivery === SourceDelivery.HttpProxy
					&& credential.scope === SourceCredentialScope.RuntimeSecret
				)
			))
		)
	))

export const browserDirectSourceBindingIds = new Set(
	allSourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.BrowserDirect)
		.map(sourceBindingId)
)

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
	const bindings = allSourceBindingsBySource[source]
	return bindings.some(({ target }) => (
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
	enabledSources,
	resolverPublicEnvBySource,
} = indexSourceProviders(
	sourceProviders,
	publicEnv,
	new Set(sourceBindings.map(sourceBindingId))
)
