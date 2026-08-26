// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoTxInputSchema from '$/schema/CardanoTxInput.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import UtxoInputSchema from '$/schema/UtxoInput.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const cardanoTxInputTransactionInputIndexSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchNonNegativeInteger(params.inputIndex)))
			return

		const cardanoTxInputTransactionInputIndexSelector = parseRouteEntitySelector(
			schema,
			CardanoTxInputSchema,
			{
				$transaction: parentData.selector,
				inputIndex: Number(params.inputIndex),
			},
			'TransactionInputIndex'
		)
		if ((!(cardanoTxInputTransactionInputIndexSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CardanoTxInput,
				selectorName: 'TransactionInputIndex',
				selector: cardanoTxInputTransactionInputIndexSelector,
			} as const
	})()

	const utxoInputTransactionIndexInTransactionSelectorCandidate = (() => {
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
			&& matchNonNegativeInteger(params.inputIndex)
		))
			return

		const utxoInputTransactionIndexInTransactionSelector = parseRouteEntitySelector(
			schema,
			UtxoInputSchema,
			{
				$transaction: parentData.selector,
				indexInTransaction: Number(params.inputIndex),
			},
			'TransactionIndexInTransaction'
		)
		if ((!(utxoInputTransactionIndexInTransactionSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.UtxoInput,
				selectorName: 'TransactionIndexInTransaction',
				selector: utxoInputTransactionIndexInTransactionSelector,
			} as const
	})()

	const routeCandidates = [
		cardanoTxInputTransactionInputIndexSelectorCandidate,
		utxoInputTransactionIndexInTransactionSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
