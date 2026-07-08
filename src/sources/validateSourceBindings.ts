import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const jsonRpcApiFamilies = new Set<ApiFamily>([
	ApiFamily.BitcoinJsonRpc,
	ApiFamily.CelestiaNodeJsonRpc,
	ApiFamily.EvmExecutionJsonRpc,
	ApiFamily.FilecoinLotusJsonRpc,
	ApiFamily.JsonRpcApi,
	ApiFamily.MoneroDaemonJsonRpc,
	ApiFamily.SolanaJsonRpc,
	ApiFamily.StarknetJsonRpc,
	ApiFamily.SubstrateJsonRpc,
])

const isTemplated = (value: string) => value.includes('{')

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
			&& binding.delivery === SourceDelivery.BrowserDirect
			&& endpoint.corsEnabled !== true
		)
			throw new Error(`${binding.source}: BrowserDirect HTTP endpoint requires corsEnabled true`)

		if (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			&& binding.delivery === SourceDelivery.HttpProxy
			&& endpoint.origin == null
		)
			throw new Error(`${binding.source}: HttpProxy HTTP endpoint requires an origin`)

		if (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			&& binding.delivery === SourceDelivery.HttpProxy
			&& endpoint.origin != null
			&& isTemplated(endpoint.origin)
		)
			throw new Error(`${binding.source}: HttpProxy requires concrete HTTP origins`)

		if (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			&& endpoint.origin != null
			&& !isTemplated(endpoint.origin)
			&& new URL(endpoint.origin).origin !== endpoint.origin
		)
			throw new Error(`${binding.source}: HTTP endpoint origin must be canonical`)
	}

	if (
		binding.delivery === SourceDelivery.RemoteLive
		&& !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
	)
		throw new Error(`${binding.source}: RemoteLive requires a WebSocket endpoint`)

	if (
		binding.apiFamily === ApiFamily.OpenApiHttp
		&& (
			binding.wireProtocol !== WireProtocol.HttpRest
			|| binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
		)
	)
		throw new Error(`${binding.source}: OpenApiHttp requires HttpRest over HTTP endpoints`)

	if (
		binding.apiFamily === ApiFamily.GraphqlHttp
		&& (
			binding.wireProtocol !== WireProtocol.Graphql
			|| binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
		)
	)
		throw new Error(`${binding.source}: GraphqlHttp requires Graphql over HTTP endpoints`)

	if (
		jsonRpcApiFamilies.has(binding.apiFamily)
		&& binding.wireProtocol !== WireProtocol.JsonRpc2
	)
		throw new Error(`${binding.source}: JSON-RPC API family requires JsonRpc2 wire protocol`)

	if (
		binding.apiFamily === ApiFamily.CatalogRows
		&& (
			binding.wireProtocol !== WireProtocol.InProcess
			|| binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.InProcess)
		)
	)
		throw new Error(`${binding.source}: CatalogRows requires InProcess wire protocol and endpoints`)

	if (
		binding.apiFamily === ApiFamily.WalletApi
		&& binding.wireProtocol !== WireProtocol.WalletProvider
	)
		throw new Error(`${binding.source}: WalletApi requires WalletProvider wire protocol`)

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
