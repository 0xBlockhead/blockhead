import sourceProviders from '$/sources/$sourceProviders.ts'
import sourceServerCredentialsById from '$/sources/$sourceServerCredentials.server.ts'
import { sourceBindingId, SourceCredentialScope, SourceDelivery, SourceEndpointKind, sourceEndpointOrigin, type SourceBinding } from '$/sources/SourceBinding.ts'
import { env as privateEnv } from '$env/dynamic/private'

const privateEnvHasValue = (key: string | undefined) => (
	key != null
	&& (privateEnv[key]?.trim() ?? '') !== ''
)

export const sourceBindings = sourceProviders
	.flatMap((provider): readonly SourceBinding[] => provider.bindings)

export const enabledSourceBindings = sourceBindings.filter((binding) => (
	binding.credentials.every((credential) => (
		(
			credential.scope !== SourceCredentialScope.RuntimeSecret
			&& credential.scope !== SourceCredentialScope.LocalSecret
		)
		|| (
			credential.keys != null ?
				credential.keys.every(privateEnvHasValue)
			:
				credential.scope === SourceCredentialScope.LocalSecret
				|| privateEnvHasValue(sourceServerCredentialsById.get(sourceBindingId(binding))?.envKey)
		)
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
		.flatMap((endpoint) => sourceEndpointOrigin(endpoint) ?? [])
)

export const httpProxyBindingByProxyId = new Map<
	string,
	SourceBinding
>(
	enabledSourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
		.map((binding) => [sourceBindingId(binding), binding])
)

export const remoteLiveBindings = enabledSourceBindings.filter((binding) => (
	binding.delivery === SourceDelivery.RemoteLive
))
