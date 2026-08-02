import { type as arktype, type Type } from 'arktype'

import bindings from '$/sources/Octez/bindings.ts'
import type { paths } from '$/sources/Octez/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.OctezNode][0]
const mainnetChainId = 'NetXdQprcVkpaWU'
const blockHashPattern = /^B[1-9A-HJ-NP-Za-km-z]{50}$/
type GetResponse<_Path extends keyof paths> = paths[_Path]['get'] extends {
	responses: {
		200: {
			content: {
				'application/json': infer _Response
			}
		}
	}
} ? _Response : never
const chainIdWire = arktype('string') satisfies Type<
	Extract<
		GetResponse<'/chains/{chain_id}/chain_id'>,
		string
	>
>
const headBlocksWire = arktype([['string']]) satisfies Type<[[
	Extract<
		GetResponse<'/chains/{chain_id}/blocks'>[number][number],
		string
	>,
]]>
const bootstrapStateWire = arktype({
	bootstrapped: 'boolean',
	sync_state: "'stuck' | 'synced' | 'unsynced'",
}) satisfies Type<GetResponse<'/chains/{chain_id}/is_bootstrapped'>>

export const getChainId = async () => {
	const chainId = chainIdWire.assert(
		await getJson<unknown>(binding, '/chains/main/chain_id')
	)
	if (chainId !== mainnetChainId)
		throw new Error('Octez: foreign chain')

	return chainId
}

export const getHeadHash = async () => {
	const headHash = headBlocksWire.assert(
		await getJson<unknown>(binding, '/chains/main/blocks?length=1')
	)[0][0]
	if (!blockHashPattern.test(headHash))
		throw new Error('Octez: invalid head block response')

	return headHash
}

export const getBootstrapState = async () => (
	bootstrapStateWire.assert(
		await getJson<unknown>(binding, '/chains/main/is_bootstrapped')
	)
)
