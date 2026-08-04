import type { paths } from '$/sources/Blockfrost/OpenApi/openapi.d.ts'
import type {
	CardanoGovernanceAction,
	CardanoGovernanceActionTag,
} from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'
import { type } from 'arktype'

export type BlockfrostAccount = paths['/accounts/{stake_address}']['get']['responses'][200]['content']['application/json']
export type BlockfrostAccountAddresses = paths['/accounts/{stake_address}/addresses']['get']['responses'][200]['content']['application/json']
export type BlockfrostAddress = paths['/addresses/{address}']['get']['responses'][200]['content']['application/json']
export type BlockfrostAddressTotal = paths['/addresses/{address}/total']['get']['responses'][200]['content']['application/json']
export type BlockfrostAddressTransactions = paths['/addresses/{address}/transactions']['get']['responses'][200]['content']['application/json']
export type BlockfrostAddressUtxos = paths['/addresses/{address}/utxos']['get']['responses'][200]['content']['application/json']
export type BlockfrostAsset = paths['/assets/{asset}']['get']['responses'][200]['content']['application/json']
export type BlockfrostBlock = paths['/blocks/{hash_or_number}']['get']['responses'][200]['content']['application/json']
export type BlockfrostBlocks = paths['/blocks/{hash_or_number}/previous']['get']['responses'][200]['content']['application/json']
export type BlockfrostAssets = paths['/assets']['get']['responses'][200]['content']['application/json']
export type BlockfrostCommittee = paths['/governance/committee']['get']['responses'][200]['content']['application/json']
export type BlockfrostCommitteeVotes = paths['/governance/committee/votes']['get']['responses'][200]['content']['application/json']
export type BlockfrostDReps = paths['/governance/dreps']['get']['responses'][200]['content']['application/json']
export const blockfrostDRepIdentityMetadata = type({
	body: {
		givenName: 'string',
	},
})
export type BlockfrostDRepListItem = Omit<BlockfrostDReps[number], 'metadata'> & {
	displayName?: string
}
export type BlockfrostDRep = paths['/governance/dreps/{drep_id}']['get']['responses'][200]['content']['application/json']
export type BlockfrostDRepMetadata = paths['/governance/dreps/{drep_id}/metadata']['get']['responses'][200]['content']['application/json']
export type BlockfrostDRepIdentity = Pick<BlockfrostDRepMetadata, 'url' | 'hash'> & {
	displayName?: string
}
export type BlockfrostDRepVotes = paths['/governance/dreps/{drep_id}/votes']['get']['responses'][200]['content']['application/json']
export type BlockfrostEpoch = paths['/epochs/latest']['get']['responses'][200]['content']['application/json']
export type BlockfrostGovernanceProposals = paths['/governance/proposals']['get']['responses'][200]['content']['application/json']
export type BlockfrostGovernanceProposalWire = paths['/governance/proposals/{tx_hash}/{cert_index}']['get']['responses'][200]['content']['application/json']
export type BlockfrostGovernanceProposal = Omit<
	BlockfrostGovernanceProposalWire,
	'governance_description'
> & {
	governance_description: CardanoGovernanceAction | null
}
export const blockfrostGovernanceActionTagByGovernanceType = {
	hard_fork_initiation: 'HardForkInitiation',
	new_committee: 'UpdateCommittee',
	new_constitution: 'NewConstitution',
	info_action: 'InfoAction',
	no_confidence: 'NoConfidence',
	parameter_change: 'ParameterChange',
	treasury_withdrawals: 'TreasuryWithdrawals',
} as const satisfies Record<
	BlockfrostGovernanceProposalWire['governance_type'],
	CardanoGovernanceActionTag
>
export type BlockfrostGovernanceProposalMetadata = paths['/governance/proposals/{tx_hash}/{cert_index}/metadata']['get']['responses'][200]['content']['application/json']
export type BlockfrostGovernanceProposalVotes = paths['/governance/proposals/{tx_hash}/{cert_index}/votes']['get']['responses'][200]['content']['application/json']
export type BlockfrostHealth = paths['/health']['get']['responses'][200]['content']['application/json']
export type BlockfrostNetwork = paths['/network']['get']['responses'][200]['content']['application/json']
export type BlockfrostProtocolParameters = paths['/epochs/latest/parameters']['get']['responses'][200]['content']['application/json']
export type BlockfrostStakePools = paths['/pools']['get']['responses'][200]['content']['application/json']
export type BlockfrostStakePool = paths['/pools/{pool_id}']['get']['responses'][200]['content']['application/json']
export type BlockfrostStakePoolMetadata = paths['/pools/{pool_id}/metadata']['get']['responses'][200]['content']['application/json']
export type BlockfrostTransaction = paths['/txs/{hash}']['get']['responses'][200]['content']['application/json']
export type BlockfrostTransactionUtxos = paths['/txs/{hash}/utxos']['get']['responses'][200]['content']['application/json']
export type BlockfrostTransactions = paths['/blocks/latest/txs']['get']['responses'][200]['content']['application/json']
