import { sourceBindingsBySource } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceEndpointKind, SourceTargetKind, sourceBindingId } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { type as arktype } from 'arktype'

const evmChainIdProbeResponse = arktype({
	jsonrpc: "'2.0'",
	id: "'probe'",
	result: '/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/',
	'error?': 'undefined',
})


export const probeSourceHttpEndpoint = async (source: Source) => {
	const endpoints = sourceBindingsBySource[source].flatMap((binding) => (
		binding.endpoints.flatMap((endpoint, endpointIndex) => (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& !endpoint.locator.includes('{') ?
				[{
					binding,
					endpoint,
					endpointIndex,
				}]
			:
				[]
		))
	))
	if (endpoints.length === 0)
		return undefined

	const results = await Promise.allSettled(endpoints.map(async ({ binding, endpoint, endpointIndex }) => {
		const startedAt = performance.now()
		const probesEvmChain = binding.apiFamily === ApiFamily.EvmExecutionJsonRpc
		let response = await sourceFetch(binding, endpoint.locator, {
			...(probesEvmChain ? {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: 'probe', jsonrpc: '2.0', method: 'eth_chainId', params: [] }),
			} : { method: 'HEAD' }),
			signal: AbortSignal.timeout(10_000),
		})
		if (!probesEvmChain && (response.status === 405 || response.status === 501)) {
			response = await sourceFetch(binding, endpoint.locator, {
				headers: {
					range: 'bytes=0-0',
				},
				method: 'GET',
				signal: AbortSignal.timeout(10_000),
			})
			await response.body?.cancel()
		}
		let semanticError: string | undefined
		if (probesEvmChain && response.ok) {
			try {
				const envelope = evmChainIdProbeResponse.assert(await response.json())
				if (binding.target.kind !== SourceTargetKind.Eip155Chain)
					semanticError = 'eth_chainId requires an Eip155Chain binding target'
				else if (BigInt(envelope.result) !== BigInt(binding.target.key))
					semanticError = 'eth_chainId does not match the binding target'
			} catch {
				semanticError = 'eth_chainId returned an invalid JSON-RPC response'
			}
		}
		if (probesEvmChain && !response.ok)
			await response.body?.cancel()

		const rateLimitRemaining = response.headers.get('ratelimit-remaining') ?? response.headers.get('x-ratelimit-remaining')
		const rateLimitReset = response.headers.get('ratelimit-reset') ?? response.headers.get('x-ratelimit-reset')
		return {
			bindingId: sourceBindingId(binding),
			endpointIndex,
			endpointUrl: endpoint.locator,
			latencyMs: performance.now() - startedAt,
			response,
			available: response.ok && semanticError == null,
			semanticError,
			rateLimitRemaining: rateLimitRemaining == null || rateLimitRemaining.trim() === '' ? undefined : Number(rateLimitRemaining),
			rateLimitReset: rateLimitReset == null || rateLimitReset.trim() === '' ? undefined : Number(rateLimitReset),
		}
	}))
	const reachable = results.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
	const available = reachable.filter(result => result.available)
	const rateLimitRemaining = reachable
		.flatMap(({ rateLimitRemaining }) => rateLimitRemaining != null && Number.isFinite(rateLimitRemaining) ? [rateLimitRemaining] : [])
	const rateLimitReset = reachable
		.flatMap(({ rateLimitReset }) => rateLimitReset != null && Number.isFinite(rateLimitReset) ? [rateLimitReset] : [])
	return {
		endpoints: results.map((result, endpointIndex) => (
			result.status === 'fulfilled' ?
				{
					bindingId: result.value.bindingId,
					endpointIndex: result.value.endpointIndex,
					endpointUrl: result.value.endpointUrl,
					available: result.value.available,
					reachable: true,
					latencyMs: result.value.latencyMs,
					statusCode: result.value.response.status,
					...(result.value.semanticError != null && { error: result.value.semanticError }),
					...(Number.isFinite(result.value.rateLimitRemaining) && { rateLimitRemaining: result.value.rateLimitRemaining }),
					...(result.value.rateLimitReset != null && Number.isFinite(result.value.rateLimitReset) && {
						rateLimitResetMs: result.value.rateLimitReset > 10_000_000_000 ? result.value.rateLimitReset : result.value.rateLimitReset * 1_000,
					}),
				}
			:
				{
					bindingId: sourceBindingId(endpoints[endpointIndex].binding),
					endpointIndex: endpoints[endpointIndex].endpointIndex,
					endpointUrl: endpoints[endpointIndex].endpoint.locator,
					available: false,
					reachable: false,
					error: String(result.reason),
				}
		)),
		endpointCount: endpoints.length,
		availableEndpointCount: available.length,
		reachableEndpointCount: reachable.length,
		...(endpoints.length === 1 && reachable.length === 1 && { statusCode: reachable[0].response.status }),
		...(rateLimitRemaining.length > 0 && { rateLimitRemaining: Math.min(...rateLimitRemaining) }),
		...(rateLimitReset.length > 0 && {
			rateLimitResetMs: Math.min(...rateLimitReset.map((reset) => reset > 10_000_000_000 ? reset : reset * 1_000)),
		}),
		...(results.some((result) => result.status === 'rejected') && {
			error: results
				.flatMap((result) => result.status === 'rejected' ? [String(result.reason)] : [])
				.join('; '),
		}),
	}
}
