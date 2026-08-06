// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import CardanoTxOutputSchema from '$/schema/CardanoTxOutput.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import UtxoOutputSchema from '$/schema/UtxoOutput.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.CardanoTxOutput
			readonly selectorName: 'TransactionOutputIndex'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CardanoTxOutput,
				'TransactionOutputIndex'
			>
		}
		| {
			readonly entityType: EntityType.UtxoOutput
			readonly selectorName: 'TransactionIndexInTransaction'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.UtxoOutput,
				'TransactionIndexInTransaction'
			>
		}
	)[] = []

	if (parentData.projectionNetwork.namespace === 'Cardano' && matchNonNegativeInteger(params.outputIndex)) {
		const cardanoTxOutputTransactionOutputIndexSelector = parseEntitySelector(
			schema,
			CardanoTxOutputSchema,
			{
				$transaction: parentData.selector,
				outputIndex: Number(params.outputIndex),
			},
			'TransactionOutputIndex'
		)
		if (!(cardanoTxOutputTransactionOutputIndexSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CardanoTxOutput,
				selectorName: 'TransactionOutputIndex',
				selector: cardanoTxOutputTransactionOutputIndexSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.ledgerModels !== undefined
				&& parentData.projectionNetwork.ledgerModels.some((value: string | number | boolean | null) => value === 'Utxo')
			)
			&& [
				'Bitcoin',
				'BitcoinCash',
				'Dogecoin',
				'Elements',
				'Litecoin',
				'Zcash',
			].includes(parentData.projectionNetwork.namespace)
		)
		&& matchNonNegativeInteger(params.outputIndex)
	) {
		const utxoOutputTransactionIndexInTransactionSelector = parseEntitySelector(
			schema,
			UtxoOutputSchema,
			{
				$transaction: parentData.selector,
				indexInTransaction: Number(params.outputIndex),
			},
			'TransactionIndexInTransaction'
		)
		if (!(utxoOutputTransactionIndexInTransactionSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.UtxoOutput,
				selectorName: 'TransactionIndexInTransaction',
				selector: utxoOutputTransactionIndexInTransactionSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
