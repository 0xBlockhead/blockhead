import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceBindingCompatibility } from '$/sources/$sourceBindingCompatibility.ts'

const isTemplated = (value: string) => value.includes('{')

export const validateSourceBinding = (binding: SourceBinding): SourceBinding => {
	if (binding.endpoints.length === 0)
		throw new Error(`${binding.source}: source binding requires at least one endpoint`)

	if (binding.operationGroups.length === 0)
		throw new Error(`${binding.source}: source binding requires at least one operation group`)

	const compatibility = sourceBindingCompatibility.find((candidate) => (
		candidate.wireProtocol === binding.wireProtocol
		&& candidate.apiFamilies.some((apiFamily) => apiFamily === binding.apiFamily)
	))

	if (compatibility == null)
		throw new Error(`${binding.source}: ${binding.apiFamily} is incompatible with ${binding.wireProtocol}`)
	if (!('operationGroups' in compatibility))
		throw new Error(`${binding.source}: compatibility row requires an explicit operation group policy`)
	if (!('artifactKinds' in compatibility))
		throw new Error(`${binding.source}: compatibility row requires an explicit artifact kind policy`)

	if (binding.endpoints.some((endpoint) => !compatibility.endpointKinds.some((endpointKind) => endpointKind === endpoint.endpointKind)))
		throw new Error(`${binding.source}: endpoint kind is incompatible with ${binding.wireProtocol}/${binding.apiFamily}`)

	if (
		compatibility.operationGroups !== true
		&& binding.operationGroups.some((operationGroup) => !compatibility.operationGroups.some((allowedOperationGroup) => allowedOperationGroup === operationGroup))
	)
		throw new Error(`${binding.source}: operation group is incompatible with ${binding.apiFamily}`)

	if (
		compatibility.artifactKinds !== true
		&& binding.artifacts?.some((artifact) => !compatibility.artifactKinds.some((artifactKind) => artifactKind === artifact.kind))
	)
		throw new Error(`${binding.source}: artifact kind is incompatible with ${binding.apiFamily}`)

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
		&& binding.wireProtocol === WireProtocol.Grpc
		&& (
			binding.apiFamily !== ApiFamily.GrpcService
			|| binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
		)
	)
		throw new Error(`${binding.source}: managed RemoteLive gRPC requires GrpcService over HTTP endpoints`)

	if (
		binding.delivery === SourceDelivery.RemoteLive
		&& binding.wireProtocol !== WireProtocol.Grpc
		&& !(
			binding.endpoints.every((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
			|| (
				binding.endpoints.length >= 2
				&& binding.endpoints[0].endpointKind === SourceEndpointKind.HttpUrl
				&& binding.endpoints.slice(1).every((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
			)
		)
	)
		throw new Error(`${binding.source}: RemoteLive requires WebSocket endpoints with at most one leading HTTP endpoint`)

	if (
		(
			binding.delivery === SourceDelivery.HttpProxy
			|| binding.delivery === SourceDelivery.RemoteLive
		)
		&& binding.credentials.some((credential) => credential.scope === SourceCredentialScope.RuntimeSecret)
		&& binding.serverCredentialId == null
	)
		throw new Error(`${binding.source}: server-mediated runtime secret requires an opaque server credential id`)

	if (
		binding.serverCredentialId != null
		&& (
			!binding.credentials.some((credential) => credential.scope === SourceCredentialScope.RuntimeSecret)
			|| (
				binding.delivery !== SourceDelivery.HttpProxy
				&& binding.delivery !== SourceDelivery.RemoteLive
			)
		)
	)
		throw new Error(`${binding.source}: server credential id requires a server-mediated runtime secret`)

	if (
		binding.delivery === SourceDelivery.BrowserDirect
		&& binding.credentials.some((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
			|| credential.scope === SourceCredentialScope.LocalSecret
		))
	)
		throw new Error(`${binding.source}: browser delivery cannot require runtime/local secrets`)

	if (
		binding.delivery === SourceDelivery.HttpProxy
		&& binding.credentials.some((credential) => credential.scope === SourceCredentialScope.LocalSecret)
	)
		throw new Error(`${binding.source}: HttpProxy cannot require local secrets`)

	return binding
}

export const validateSourceBindings = (
	bindings: readonly SourceBinding[]
): readonly SourceBinding[] => bindings.map(validateSourceBinding)
