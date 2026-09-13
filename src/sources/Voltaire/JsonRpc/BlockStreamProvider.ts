import { Block, type RpcBlock } from '@tevm/voltaire'
import type { BlockStreamConstructorOptions } from '@tevm/voltaire/block'

import { isJsonObject } from '$/typescript/JsonValue.ts'

type RpcProvider = {
	request: (request: {
		method: string
		params?: readonly unknown[]
	}) => Promise<unknown>
	on?: (event: string, listener: (...args: unknown[]) => void) => unknown
	removeListener?: (event: string, listener: (...args: unknown[]) => void) => unknown
}

const blockMethods = new Set([
	'eth_getBlockByHash',
	'eth_getBlockByNumber',
])

export const blockStreamProvider = (
	provider: RpcProvider
): BlockStreamConstructorOptions['provider'] => {
	const adapted: BlockStreamConstructorOptions['provider'] = {
		request: async ({ method, params }) => {
			const result = await provider.request({ method, params })
			if (!blockMethods.has(method) || result == null)
				return result
			if (!isJsonObject(result))
				throw new Error(`Voltaire_JsonRpc: ${method} returned a malformed block`)
			return Block.fromRpc(result as unknown as RpcBlock)
		},
		on: (event, listener) => {
			provider.on?.(String(event), listener as (...args: unknown[]) => void)
			return adapted
		},
		removeListener: (event, listener) => {
			provider.removeListener?.(String(event), listener as (...args: unknown[]) => void)
			return adapted
		},
	}
	return adapted
}
