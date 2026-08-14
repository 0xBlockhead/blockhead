import {
	EvmTokenApprovalKind,
	EvmTokenStandard,
} from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { describe, expect, it } from 'vitest'
import { evmTokenApprovalEntityFromLog } from './evmTokenApproval.ts'

const $log = {
	$transaction: {
		$network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		txHash: `0x${'11'.repeat(32)}`,
	},
	indexInTransaction: 2,
} as const
const ownerTopic = `0x${'00'.repeat(12)}${'22'.repeat(20)}` as const
const approvedActorTopic = `0x${'00'.repeat(12)}${'33'.repeat(20)}` as const
const emitterAddress = `0x${'44'.repeat(20)}` as const

describe('EVM token approvals', () => {
	it('decodes exact ERC-20, ERC-721, and operator approval wire shapes', () => {
		const allowance = evmTokenApprovalEntityFromLog({
			$log,
			topics: [
				'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
				ownerTopic,
				approvedActorTopic,
			],
			data: `0x${'0'.repeat(63)}a`,
			emitterAddress,
		})
		const token = evmTokenApprovalEntityFromLog({
			$log,
			topics: [
				'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
				ownerTopic,
				approvedActorTopic,
				`0x${'0'.repeat(63)}b`,
			],
			data: '0x',
			emitterAddress,
		})
		const operator = evmTokenApprovalEntityFromLog({
			$log,
			topics: [
				'0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
				ownerTopic,
				approvedActorTopic,
			],
			data: `0x${'0'.repeat(63)}1`,
			emitterAddress,
		})

		expect(allowance).toMatchObject({
			[EntityMetaKey.Selector]: { $log },
			approvalKind: EvmTokenApprovalKind.Allowance,
			standard: EvmTokenStandard.Erc20,
			amount: 10n,
		})
		expect(token).toMatchObject({
			approvalKind: EvmTokenApprovalKind.Token,
			standard: EvmTokenStandard.Erc721,
			tokenId: 11n,
		})
		expect(operator).toMatchObject({
			approvalKind: EvmTokenApprovalKind.Operator,
			approved: true,
		})
	})

	it('rejects malformed or ambiguous event shapes', () => {
		expect(evmTokenApprovalEntityFromLog({
			$log,
			topics: [
				'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
				ownerTopic,
				approvedActorTopic,
			],
			data: '0x01',
			emitterAddress,
		})).toBeUndefined()
		expect(evmTokenApprovalEntityFromLog({
			$log,
			topics: [
				'0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
				ownerTopic,
				approvedActorTopic,
			],
			data: `0x${'0'.repeat(62)}02`,
			emitterAddress,
		})).toBeUndefined()
	})
})
