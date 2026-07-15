import type { paths } from '$/sources/Blockfrost/OpenApi/openapi.d.ts'

export type BlockfrostBlock = paths['/blocks/{hash_or_number}']['get']['responses'][200]['content']['application/json']
export type BlockfrostBlocks = paths['/blocks/{hash_or_number}/previous']['get']['responses'][200]['content']['application/json']
export type BlockfrostAssets = paths['/assets']['get']['responses'][200]['content']['application/json']
export type BlockfrostCommittee = paths['/governance/committee']['get']['responses'][200]['content']['application/json']
export type BlockfrostDReps = paths['/governance/dreps']['get']['responses'][200]['content']['application/json']
export type BlockfrostEpoch = paths['/epochs/latest']['get']['responses'][200]['content']['application/json']
export type BlockfrostGovernanceProposals = paths['/governance/proposals']['get']['responses'][200]['content']['application/json']
export type BlockfrostHealth = paths['/health']['get']['responses'][200]['content']['application/json']
export type BlockfrostNetwork = paths['/network']['get']['responses'][200]['content']['application/json']
export type BlockfrostProtocolParameters = paths['/epochs/latest/parameters']['get']['responses'][200]['content']['application/json']
export type BlockfrostStakePools = paths['/pools']['get']['responses'][200]['content']['application/json']
export type BlockfrostTransactions = paths['/blocks/latest/txs']['get']['responses'][200]['content']['application/json']
