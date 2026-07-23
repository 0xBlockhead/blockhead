import { describe, expect, it } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	findNormalizedBridgeTransactionRow,
	readNormalizedLocalInternal,
} from '$/resolvers/Local/Internal/catalog.ts'
import localResolver from '$/resolvers/Local.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


const bridgeTransactionSelector = {
	$account: {
		address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	},
	$sourceTx: {
		$network: {
			caip2: networkBySlug.ethereum.caip2,
		},
		txHash: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
	},
	createdAt: 0,
} satisfies EntitySelector<typeof schema, EntityType.BlockheadBridgeTransaction>

describe('Local_Internal catalog selectors', () => {
	it('does not synthesize locally enrolled accounts', () => {
		expect(readNormalizedLocalInternal()).not.toHaveProperty('blockheadAccounts')
		expect(localResolver.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BlockheadAccount
	))).toBe(false)
	})

	it('finds a bridge transaction through equivalent Network Caip2 and Slug selectors', () => {
		expect(findNormalizedBridgeTransactionRow(
			readNormalizedLocalInternal(),
			bridgeTransactionSelector
		)).toMatchObject({
			chainId: 1,
		})

		expect(findNormalizedBridgeTransactionRow(
			readNormalizedLocalInternal(),
			{
				...bridgeTransactionSelector,
				$sourceTx: {
					...bridgeTransactionSelector.$sourceTx,
					$network: {
						slug: networkBySlug.ethereum.slug,
					},
				},
			}
		)).toMatchObject({
			chainId: 1,
		})
	})
})
