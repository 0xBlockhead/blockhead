import { type as arktype } from 'arktype'


export const tallyProposalStatuses = [
	'active',
	'archived',
	'canceled',
	'callexecuted',
	'defeated',
	'draft',
	'executed',
	'expired',
	'extended',
	'pending',
	'queued',
	'pendingexecution',
	'submitted',
	'succeeded',
	'crosschainexecuted',
	'vetovoteopen',
	'vetoquorummet',
	'vetoed',
] as const

export type TallyProposalStatus = typeof tallyProposalStatuses[number]

const tallyProposalStatusWire = arktype.enumerated(...tallyProposalStatuses)

const tallyIntIdWire = arktype('string | number')

const tallyNullableString = arktype('string | null')

const tallyOrganizationWire = arktype({
	id: tallyIntIdWire,
	slug: tallyNullableString,
	name: tallyNullableString,
})

const tallyProposalStatsWire = arktype({
	total: 'number.integer >= 0',
	active: 'number.integer >= 0',
	failed: 'number.integer >= 0',
	passed: 'number.integer >= 0',
})

const tallyGovernorParametersWire = arktype({
	quorumVotes: tallyNullableString,
	proposalThreshold: tallyNullableString,
	votingDelay: tallyNullableString,
	votingPeriod: tallyNullableString,
	gracePeriod: tallyNullableString,
	clockMode: tallyNullableString,
	countingMode: tallyNullableString,
})

const tallyGovernorContractsWire = arktype({
	governor: arktype({
		address: 'string',
	}).or(arktype('null')),
})

const tallyGovernorMetadataWire = arktype({
	description: tallyNullableString,
})

export const tallyGovernorWire = arktype({
	id: 'string',
	chainId: 'string',
	name: tallyNullableString,
	slug: tallyNullableString,
	type: tallyNullableString,
	kind: tallyNullableString,
	quorum: tallyNullableString,
	timelockId: tallyNullableString,
	tokenId: tallyNullableString,
	delegatesCount: arktype('number.integer >= 0').or(arktype('null')),
	delegatesVotesCount: tallyNullableString,
	tokenOwnersCount: arktype('number.integer >= 0').or(arktype('null')),
	isPrimary: arktype('boolean').or(arktype('null')),
	organization: tallyOrganizationWire.or(arktype('null')),
	proposalStats: tallyProposalStatsWire.or(arktype('null')),
	parameters: tallyGovernorParametersWire.or(arktype('null')),
	contracts: tallyGovernorContractsWire.or(arktype('null')),
	metadata: tallyGovernorMetadataWire.or(arktype('null')),
})

const tallyProposalMetadataWire = arktype({
	title: 'string',
	description: 'string',
	eta: arktype('number.integer >= 0').or(arktype('null')),
	ipfsHash: tallyNullableString,
	txHash: tallyNullableString,
	discourseURL: tallyNullableString,
	snapshotURL: tallyNullableString,
})

const tallyProposalGovernorWire = arktype({
	id: 'string',
	chainId: 'string',
	name: tallyNullableString,
	slug: tallyNullableString,
})

const tallyProposalProposerWire = arktype({
	address: 'string',
	ens: tallyNullableString,
	name: tallyNullableString,
})

const tallyBlockTimestampWire = arktype({
	timestamp: tallyNullableString,
})

const tallyVoteStatWire = arktype({
	type: 'string',
	votesCount: 'string',
	votersCount: 'number.integer >= 0',
	percent: 'number',
})

export const tallyProposalWire = arktype({
	id: tallyIntIdWire,
	onchainId: tallyNullableString,
	chainId: 'string',
	status: tallyProposalStatusWire,
	quorum: tallyNullableString,
	metadata: tallyProposalMetadataWire.or(arktype('null')),
	governor: tallyProposalGovernorWire,
	organization: tallyOrganizationWire.or(arktype('null')),
	proposer: tallyProposalProposerWire.or(arktype('null')),
	start: tallyBlockTimestampWire.or(arktype('null')),
	end: tallyBlockTimestampWire.or(arktype('null')),
	voteStats: tallyVoteStatWire.array().or(arktype('null')),
})

export const tallyPageInfoWire = arktype({
	firstCursor: tallyNullableString,
	lastCursor: tallyNullableString,
	count: arktype('number.integer >= 0').or(arktype('null')),
})

export const tallyGovernorDataWire = arktype({
	governor: tallyGovernorWire.or(arktype('null')),
})

export const tallyGovernorsPageDataWire = arktype({
	governors: arktype({
		nodes: tallyGovernorWire.or(arktype('null')).array().or(arktype('null')),
		pageInfo: tallyPageInfoWire,
	}).or(arktype('null')),
})

export const tallyProposalDataWire = arktype({
	proposal: tallyProposalWire.or(arktype('null')),
})

export const tallyProposalsPageDataWire = arktype({
	proposals: arktype({
		nodes: tallyProposalWire.or(arktype('null')).array().or(arktype('null')),
		pageInfo: tallyPageInfoWire,
	}).or(arktype('null')),
})

export type TallyGovernor = typeof tallyGovernorWire.infer
export type TallyProposal = typeof tallyProposalWire.infer
export type TallyPageInfo = typeof tallyPageInfoWire.infer
