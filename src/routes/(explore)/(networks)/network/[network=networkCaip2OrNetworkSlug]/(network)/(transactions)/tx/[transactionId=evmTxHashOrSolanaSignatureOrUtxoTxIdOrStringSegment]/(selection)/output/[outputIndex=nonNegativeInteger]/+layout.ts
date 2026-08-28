// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoTransactionSchema from '$/schema/CardanoTransaction.ts'
import CardanoTxOutputSchema from '$/schema/CardanoTxOutput.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import UtxoOutputSchema from '$/schema/UtxoOutput.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const cardanoTxOutputTransactionOutputIndexSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchNonNegativeInteger(params.outputIndex)))
			return

		const cardanoTransactionNetworkHashParentSelector = parseRouteEntitySelector(
			schema,
			CardanoTransactionSchema,
			parentData.selector,
			'NetworkHash'
		)
		if (cardanoTransactionNetworkHashParentSelector instanceof arktype.errors)
			return

		const cardanoTxOutputTransactionOutputIndexSelector = parseRouteEntitySelector(
			schema,
			CardanoTxOutputSchema,
			{
				$transaction: cardanoTransactionNetworkHashParentSelector,
				outputIndex: Number(params.outputIndex),
			},
			'TransactionOutputIndex'
		)
		if ((!(cardanoTxOutputTransactionOutputIndexSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CardanoTxOutput,
				selectorName: 'TransactionOutputIndex',
				selector: cardanoTxOutputTransactionOutputIndexSelector,
			} as const
	})()

	const utxoOutputTransactionIndexInTransactionSelectorCandidate = (() => {
		if (!(
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
		))
			return

		const utxoTransactionNetworkTxIdParentSelector = parseRouteEntitySelector(
			schema,
			UtxoTransactionSchema,
			parentData.selector,
			'NetworkTxId'
		)
		if (utxoTransactionNetworkTxIdParentSelector instanceof arktype.errors)
			return

		const utxoOutputTransactionIndexInTransactionSelector = parseRouteEntitySelector(
			schema,
			UtxoOutputSchema,
			{
				$transaction: utxoTransactionNetworkTxIdParentSelector,
				indexInTransaction: Number(params.outputIndex),
			},
			'TransactionIndexInTransaction'
		)
		if ((!(utxoOutputTransactionIndexInTransactionSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.UtxoOutput,
				selectorName: 'TransactionIndexInTransaction',
				selector: utxoOutputTransactionIndexInTransactionSelector,
			} as const
	})()

	const routeCandidates = [
		cardanoTxOutputTransactionOutputIndexSelectorCandidate,
		utxoOutputTransactionIndexInTransactionSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
