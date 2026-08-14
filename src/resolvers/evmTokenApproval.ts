import {
	EvmTokenApprovalKind,
	EvmTokenStandard,
} from '$/constants/Evm.ts'
import {
	EntityMetaKey,
	type Entity,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

const approvalTopic = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const approvalForAllTopic = '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'

const addressFromTopic = (topic: `0x${string}` | undefined) => (
	topic != null && /^0x0{24}[0-9a-f]{40}$/.test(topic) ?
		hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
	:
		undefined
)

const uint256FromHex = (hex: `0x${string}` | undefined) => (
	hex != null && /^0x[0-9a-f]{64}$/.test(hex) ?
		BigInt(hex)
	:
		undefined
)

export const evmTokenApprovalEntityFromLog = ({
	$log,
	topics,
	data,
	emitterAddress,
}: {
	$log: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector]
	topics: readonly `0x${string}`[]
	data: `0x${string}`
	emitterAddress: `0x${string}` | undefined
}): Entity<typeof schema, EntityType.EvmTokenApproval> | undefined => {
	const ownerAddress = addressFromTopic(topics.at(1))
	const approvedActorAddress = addressFromTopic(topics.at(2))
	if (
		emitterAddress == null
		|| ownerAddress == null
		|| approvedActorAddress == null
	)
		return

	const common = {
		[EntityMetaKey.Selector]: {
			$log,
		},
		$log: {
			[EntityMetaKey.Selector]: $log,
		},
		$tokenContract: {
			[EntityMetaKey.Selector]: {
				$network: $log.$transaction.$network,
				address: emitterAddress,
			},
		},
		$owner: {
			[EntityMetaKey.Selector]: {
				address: ownerAddress,
			},
		},
		$approvedActor: {
			[EntityMetaKey.Selector]: {
				address: approvedActorAddress,
			},
		},
	}

	if (topics.at(0) === approvalTopic) {
		if (topics.length === 3) {
			const amount = uint256FromHex(data)
			if (amount == null)
				return

			return {
				...common,
				approvalKind: EvmTokenApprovalKind.Allowance,
				standard: EvmTokenStandard.Erc20,
				amount,
			}
		}

		if (topics.length === 4 && data === '0x') {
			const tokenId = uint256FromHex(topics.at(3))
			if (tokenId == null)
				return

			return {
				...common,
				approvalKind: EvmTokenApprovalKind.Token,
				standard: EvmTokenStandard.Erc721,
				tokenId,
			}
		}

		return
	}

	if (topics.at(0) !== approvalForAllTopic || topics.length !== 3)
		return

	const approvedValue = uint256FromHex(data)
	if (approvedValue !== 0n && approvedValue !== 1n)
		return

	return {
		...common,
		approvalKind: EvmTokenApprovalKind.Operator,
		approved: approvedValue === 1n,
	}
}
