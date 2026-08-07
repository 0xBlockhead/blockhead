import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Kingnodes/bindings.ts'
import {
	kingnodesDydxLatestBlockWire,
} from '$/sources/Kingnodes/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.KingnodesDydxNode][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`KingnodesDydxNode: invalid ${label} response envelope`)
	}
}

export const getDydxLatestBlock = async () => {
	const value = assertEnvelope(
		'latest block',
		kingnodesDydxLatestBlockWire,
		await sourceGetJson(
			binding,
			httpUrl(binding, '/cosmos/base/tendermint/v1beta1/blocks/latest')
		)
	)
	if (value.block.header.chain_id !== 'dydx-mainnet-1')
		throw new Error('KingnodesDydxNode: returned a foreign chain')
	return value
}
