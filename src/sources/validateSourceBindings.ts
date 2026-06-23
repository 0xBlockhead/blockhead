import {
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const validateSourceBinding = (binding: SourceBinding): SourceBinding => {
	for (const endpoint of binding.endpoints) {
		if (
			endpoint.locator.includes('configured')
			|| endpoint.locator.includes('injected-or-session-provider')
			|| endpoint.locator.includes('source-artifact')
		)
			throw new Error(`${binding.source}: endpoint locators must be concrete, env:, or browser:`)

		if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl && endpoint.corsEnabled != null)
			throw new Error(`${binding.source}: corsEnabled is only valid on HTTP endpoints`)

		if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl && binding.delivery === SourceDelivery.HttpProxy)
			throw new Error(`${binding.source}: HttpProxy requires HTTP endpoints`)

		if (endpoint.endpointKind === SourceEndpointKind.WebSocketUrl && binding.delivery === SourceDelivery.HttpProxy)
			throw new Error(`${binding.source}: WebSocketUrl must not use HttpProxy`)

		if (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			&& binding.delivery === SourceDelivery.HttpProxy
			&& endpoint.origin?.includes('{')
		)
			throw new Error(`${binding.source}: HttpProxy requires concrete HTTP origins`)
	}

	if (
		binding.delivery === SourceDelivery.RemoteLive
		&& !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
	)
		throw new Error(`${binding.source}: RemoteLive requires a WebSocket endpoint`)

	if (
		(binding.delivery === SourceDelivery.BrowserDirect || binding.delivery === SourceDelivery.HttpProxy)
		&& binding.credentials.some((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
			|| credential.scope === SourceCredentialScope.LocalSecret
		))
	)
		throw new Error(`${binding.source}: browser delivery cannot require runtime/local secrets`)

	return binding
}

export const validateSourceBindings = (
	bindings: readonly SourceBinding[]
): readonly SourceBinding[] => bindings.map(validateSourceBinding)
