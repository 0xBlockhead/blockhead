import {
	expect,
	it,
	vi,
} from 'vitest'

import type { EvmNativeTransferExecutionTransport } from '$/state/sessions/evmNativeTransferPreparation.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	createEip1193EvmNativeTransferExecutionTransport,
	type Eip1193Provider,
} from './eip1193EvmNativeTransferExecutionTransport.ts'

const executionCall = {
	from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
	to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
	input: '0x',
	value: 2n,
	blockTag: '0x2a',
} as const satisfies Parameters<EvmNativeTransferExecutionTransport['getCall']>[0]

const providerWithResponses = () => {
	const request = vi.fn<Eip1193Provider['request']>(async ({ method }) => {
		if (method === 'eth_getBlockByNumber')
			return { number: '0x2a' }
		if (method === 'eth_call')
			return '0x'
		return '0x5208'
	})
	return {
		provider: { request },
		request,
	}
}

it('maps the existing block, call, and gas contract to exact EIP-1193 requests', async () => {
	const { provider, request } = providerWithResponses()
	const transport = createEip1193EvmNativeTransferExecutionTransport(provider)

	expect(await transport.getBlockByNumber({
		blockNumber: 'latest',
		txObjects: false,
	})).toEqual({ number: '0x2a' })
	expect(await transport.getCall(executionCall)).toBe('0x')
	expect(await transport.estimateGas(executionCall)).toBe(21_000n)
	expect(request.mock.calls).toEqual([
		[{
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
		}],
		[{
			method: 'eth_call',
			params: [{
				from: executionCall.from,
				to: executionCall.to,
				data: executionCall.input,
				value: '0x2',
			}, '0x2a'],
		}],
		[{
			method: 'eth_estimateGas',
			params: [{
				from: executionCall.from,
				to: executionCall.to,
				data: executionCall.input,
				value: '0x2',
			}, '0x2a'],
		}],
	])
})

it.each([
	'getBlockByNumber',
	'getCall',
	'estimateGas',
] as const)('preserves the injected provider rejection identity for %s', async (operation) => {
	const rejection = { code: -32000, message: 'engine rejected request' }
	const request = vi.fn<Eip1193Provider['request']>(async () => {
		throw rejection
	})
	const transport = createEip1193EvmNativeTransferExecutionTransport({ request })
	const pending = operation === 'getBlockByNumber' ?
		transport.getBlockByNumber({ blockNumber: 'latest', txObjects: false })
	: operation === 'getCall' ?
		transport.getCall(executionCall)
	:
		transport.estimateGas(executionCall)

	await expect(pending).rejects.toBe(rejection)
})

it.each([
	{
		operation: 'getBlockByNumber',
		response: { number: 'not-hex' },
	},
	{
		operation: 'getCall',
		response: 'malformed-call-result',
	},
	{
		operation: 'estimateGas',
		response: '0xnot-hex',
	},
] as const satisfies readonly { operation: string; response: JsonValue }[])('rejects malformed $operation wire responses', async ({ operation, response }) => {
	const request = vi.fn<Eip1193Provider['request']>(async () => response)
	const transport = createEip1193EvmNativeTransferExecutionTransport({ request })
	const pending = operation === 'getBlockByNumber' ?
		transport.getBlockByNumber({ blockNumber: 'latest', txObjects: false })
	: operation === 'getCall' ?
		transport.getCall(executionCall)
	:
		transport.estimateGas(executionCall)

	await expect(pending).rejects.toThrow()
})

it('binds the one injected provider instance before any request awaits', async () => {
	let injectedProvider: Eip1193Provider | undefined
	const request = vi.fn<Eip1193Provider['request']>(async function (this: Eip1193Provider) {
		return this === injectedProvider ? '0x' : 'wrong-provider'
	})
	const provider = { request } satisfies Eip1193Provider
	injectedProvider = provider
	const transport = createEip1193EvmNativeTransferExecutionTransport(provider)

	provider.request = vi.fn<Eip1193Provider['request']>(async () => 'wrong-provider')

	expect(await transport.getCall(executionCall)).toBe('0x')
	expect(request).toHaveBeenCalledOnce()
})
