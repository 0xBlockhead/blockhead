// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { CardanoTxInput as CardanoTxInputSchema } from '$/schema/CardanoTxInput.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { UtxoInput as UtxoInputSchema } from '$/schema/UtxoInput.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	const routeCandidates: (
		| {
			readonly entityType: EntityType.CardanoTxInput
			readonly selectorName: 'TransactionInputIndex'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoTxInput,
				'TransactionInputIndex'
			>
		}
		| {
			readonly entityType: EntityType.UtxoInput
			readonly selectorName: 'TransactionIndexInTransaction'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.UtxoInput,
				'TransactionIndexInTransaction'
			>
		}
	)[] = []

	if (projectionNetwork.namespace === 'Cardano' && matchNonNegativeInteger(params.inputIndex)) {
		const cardanoTxInputTransactionInputIndexSelector = parseEntitySelector(
			schema,
			CardanoTxInputSchema,
			{
				$transaction: parentData.selector,
				inputIndex: Number(params.inputIndex),
			}
		)
		if (!(cardanoTxInputTransactionInputIndexSelector instanceof arktype.errors) && '$transaction' in cardanoTxInputTransactionInputIndexSelector && 'inputIndex' in cardanoTxInputTransactionInputIndexSelector)
			routeCandidates.push({ entityType: EntityType.CardanoTxInput, selectorName: 'TransactionInputIndex', selector: cardanoTxInputTransactionInputIndexSelector })
	}

	if (((projectionNetwork.ledgerModels !== undefined && projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')) && [
	'Bitcoin',
	'BitcoinCash',
	'Dogecoin',
	'Elements',
	'Litecoin',
	'Zcash',
].includes(projectionNetwork.namespace)) && matchNonNegativeInteger(params.inputIndex)) {
		const utxoInputTransactionIndexInTransactionSelector = parseEntitySelector(
			schema,
			UtxoInputSchema,
			{
				$transaction: parentData.selector,
				indexInTransaction: Number(params.inputIndex),
			}
		)
		if (!(utxoInputTransactionIndexInTransactionSelector instanceof arktype.errors) && '$transaction' in utxoInputTransactionIndexInTransactionSelector && 'indexInTransaction' in utxoInputTransactionIndexInTransactionSelector)
			routeCandidates.push({ entityType: EntityType.UtxoInput, selectorName: 'TransactionIndexInTransaction', selector: utxoInputTransactionIndexInTransactionSelector })
	}

	if (routeCandidates.length === 0) error(404, 'Route selector not applicable')
	if (routeCandidates.length > 1) error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
