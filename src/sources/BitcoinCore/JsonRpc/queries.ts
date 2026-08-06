import bindings from '$/sources/BitcoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

export const {
	getBlock,
	getRawTransaction,
} = bitcoinCoreJsonRpc(bindings[Source.BitcoinCore_JsonRpc][0], 1)

/**
 * Extract Ordinals envelopes + Runestone from a Bitcoin Core `getrawtransaction` verbose wire.
 * @see https://developer.bitcoin.org/reference/rpc/getrawtransaction.html
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async ({
	txId,
}: {
	txId: string
}) => {
	const { extractProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractProtocolPayloads(
		await getRawTransaction({
			txId,
		})
	)
}
