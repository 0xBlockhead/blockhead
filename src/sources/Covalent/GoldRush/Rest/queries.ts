import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson as getJson,
} from '$/sources/_runtime/http.ts'
import type {
	GoldRushTransactionExpansions,
	GoldRushTransactionResponse,
	GoldRushTransactionResult,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'

export const getTransaction = async ({
	chainId,
	chainName,
	txHash,
	expansions,
}: {
	chainId: number
	chainName: string
	txHash: string
	expansions?: GoldRushTransactionExpansions
}): Promise<GoldRushTransactionResult> => {
	if (chainName.trim() === '')
		throw new Error('GoldRushFoundational_Rest: unsupported chain')

	const binding = sourceProviderDefinitions
		.flatMap((provider) => provider.bindings)
		.find((candidate) => (
			candidate.source === Source.GoldRushFoundational_Rest
			&& candidate.target.key === String(chainId)
		))
	if (binding == null)
		throw new Error(`GoldRushFoundational_Rest: unsupported chain ${String(chainId)}`)

	const url = new URL(
		`/v1/${encodeURIComponent(chainName)}/transaction_v2/${encodeURIComponent(txHash)}/`,
		firstHttpUrlForBinding(binding)
	)
	if (expansions?.withInternal != null)
		url.searchParams.set('with-internal', String(expansions.withInternal))
	if (expansions?.withState != null)
		url.searchParams.set('with-state', String(expansions.withState))
	if (expansions?.withInputData != null)
		url.searchParams.set('with-input-data', String(expansions.withInputData))

	const envelope = await getJson<GoldRushTransactionResponse>(
		binding,
		url.toString()
	)
	if (envelope.error)
		throw new Error(
			`GoldRushFoundational_Rest: ${envelope.error_message ?? `API error ${String(envelope.error_code)}`}`
		)
	if (envelope.data == null)
		throw new Error('GoldRushFoundational_Rest: response data is missing')
	if (envelope.data.items.length === 0)
		throw new Error('GoldRushFoundational_Rest: transaction not found')
	if (envelope.data.items.length !== 1)
		throw new Error('GoldRushFoundational_Rest: transaction response is ambiguous')
	if (envelope.data.chain_id !== chainId || envelope.data.chain_name !== chainName)
		throw new Error('GoldRushFoundational_Rest: response chain does not match request')
	if (envelope.data.items[0].tx_hash.toLowerCase() !== txHash.toLowerCase())
		throw new Error('GoldRushFoundational_Rest: response transaction does not match request')

	return {
		transaction: envelope.data.items[0],
		updatedAt: envelope.data.updated_at,
		chainId: envelope.data.chain_id,
		chainName: envelope.data.chain_name,
	}
}
