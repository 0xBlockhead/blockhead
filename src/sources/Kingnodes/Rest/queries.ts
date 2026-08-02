import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Kingnodes/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.KingnodesDydxNode][0]

export const getDydxLatestBlock = async () => {
	const value = await sourceGetJson<{
		block: {
			header: {
				chain_id: string
				height: string
				time: string
			}
		}
	}>(
		binding,
		httpUrl(binding, '/cosmos/base/tendermint/v1beta1/blocks/latest')
	)
	if (value.block.header.chain_id !== 'dydx-mainnet-1')
		throw new Error('KingnodesDydxNode: returned a foreign chain')
	if (!/^(?:0|[1-9]\d*)$/.test(value.block.header.height))
		throw new Error('KingnodesDydxNode: returned an invalid block height')
	return value
}
