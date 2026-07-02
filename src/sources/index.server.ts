// Generated from APP.ts. Do not edit by hand.

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { SourceDelivery, SourceEndpointKind, type SourceBinding } from '$/sources/SourceBinding.ts'
import { validateSourceBindings } from '$/sources/validateSourceBindings.ts'
import { env as privateEnv } from '$env/dynamic/private'

export const sourceBindings = validateSourceBindings(
	sourceProviderDefinitions.flatMap((provider) => provider.bindings)
) satisfies readonly SourceBinding[]

export const enabledSourceBindings = sourceBindings.filter((binding) => (
	binding.credentials.every((credential) => (
		credential.keys == null
		|| credential.keys.every((key) => privateEnv[key]?.trim() !== '')
	))
))

export const enabledSources = new Set(
	enabledSourceBindings.map((binding) => binding.source)
)

export const httpProxyOrigins = new Set(
	enabledSourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
		.flatMap((binding) => binding.endpoints)
		.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		.flatMap((endpoint) => endpoint.origin == null ? [] : [endpoint.origin])
)

export const remoteLiveBindings = enabledSourceBindings.filter((binding) => (
	binding.delivery === SourceDelivery.RemoteLive
))
