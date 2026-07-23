export type TallyIntId = string
export type TallyUint256 = string

export type TallyAccount = {
	id: string
	address: string
	name: string
}

export type TallyOrganizationReference = {
	id: TallyIntId
	slug: string
	name: string
}

export type TallyOrganization = TallyOrganizationReference & {
	chainIds: string[]
	governorIds: string[]
	metadata: {
		description: string | null
		icon: string | null
	} | null
	hasActiveProposals: boolean
	proposalsCount: number
}

export type TallyGovernorReference = {
	id: string
	chainId: string
	slug: string
	name: string
}

export type TallyGovernor = TallyGovernorReference & {
	isIndexing: boolean
	isBehind: boolean
	isPrimary: boolean
	kind:
		| 'single'
		| 'multiprimary'
		| 'multisecondary'
		| 'multiother'
		| 'hub'
		| 'spoke'
	organization: TallyOrganizationReference
	proposalStats: {
		total: number
		active: number
		failed: number
		passed: number
	}
	parameters: {
		quorumVotes: TallyUint256 | null
		proposalThreshold: TallyUint256 | null
		votingDelay: TallyUint256 | null
		votingPeriod: TallyUint256 | null
		gracePeriod: TallyUint256 | null
		quorumNumerator: TallyUint256 | null
		quorumDenominator: TallyUint256 | null
		clockMode: string | null
		countingMode: string | null
	}
	quorum: TallyUint256
	timelockId: string | null
	tokenId: string
	type:
		| 'governoralpha'
		| 'governorbravo'
		| 'openzeppelingovernor'
		| 'aave'
		| 'nounsfork'
		| 'nomineeelection'
		| 'memberelection'
		| 'hub'
		| 'spoke'
}

export type TallyBlock = {
	__typename: 'Block'
	id: string
	number: number
	timestamp: number
}

export type TallyBlocklessTimestamp = {
	__typename: 'BlocklessTimestamp'
	timestamp: number
}

export type TallyBlockOrTimestamp =
	| TallyBlock
	| TallyBlocklessTimestamp

export type TallyProposalEventType =
	| 'activated'
	| 'canceled'
	| 'created'
	| 'defeated'
	| 'drafted'
	| 'executed'
	| 'expired'
	| 'extended'
	| 'pendingexecution'
	| 'queued'
	| 'succeeded'
	| 'callexecuted'
	| 'crosschainexecuted'

export type TallyProposalStatus =
	| 'active'
	| 'archived'
	| 'canceled'
	| 'callexecuted'
	| 'defeated'
	| 'draft'
	| 'executed'
	| 'expired'
	| 'extended'
	| 'pending'
	| 'queued'
	| 'pendingexecution'
	| 'submitted'
	| 'succeeded'
	| 'crosschainexecuted'
	| 'vetovoteopen'
	| 'vetoquorummet'
	| 'vetoed'

export type TallyVoteType =
	| 'abstain'
	| 'against'
	| 'for'
	| 'pendingabstain'
	| 'pendingagainst'
	| 'pendingfor'

export type TallyExecutableCallType =
	| 'custom'
	| 'erc20transfer'
	| 'erc20transferarbitrum'
	| 'empty'
	| 'nativetransfer'
	| 'orcamanagepod'
	| 'other'
	| 'reward'
	| 'swap'

export type TallyProposalEvent = {
	block: Omit<TallyBlock, '__typename'> | null
	chainId: string
	createdAt: number
	type: TallyProposalEventType
	txHash: string | null
}

export type TallyExecutableCall = {
	calldata: string
	chainId: string
	index: number
	signature: string | null
	target: string
	type: TallyExecutableCallType | null
	value: TallyUint256
}

export type TallyVoteStats = {
	type: TallyVoteType
	votesCount: TallyUint256
	votersCount: number
	percent: number
}

export type TallyProposal = {
	id: TallyIntId
	onchainId: string | null
	chainId: string | null
	creator: TallyAccount | null
	end: TallyBlockOrTimestamp
	events: TallyProposalEvent[] | null
	executableCalls: TallyExecutableCall[] | null
	governor: TallyGovernorReference | null
	metadata: {
		title: string
		description: string
		eta: number | null
		ipfsHash: string | null
		previousEnd: number | null
		timelockId: string | null
		txHash: string | null
		discourseURL: string | null
		snapshotURL: string | null
	}
	organization: TallyOrganizationReference
	proposer: TallyAccount | null
	quorum: TallyUint256 | null
	status: TallyProposalStatus
	start: TallyBlockOrTimestamp
	voteStats: TallyVoteStats[] | null
}

export type TallyPageInfo = {
	firstCursor: string | null
	lastCursor: string | null
	count: number | null
}

export type TallyPage<_Value> = {
	items: _Value[]
	pageInfo: TallyPageInfo
	nextCursor?: string
}

export type TallyObservation<_Value> = {
	value: _Value
	observedBy: 'Tally_Graphql'
	endpoint: 'https://api.tally.xyz/query'
	resolvedAtMs: number
}

export type TallyGraphqlResponse<_Data> = {
	data?: _Data
	errors?: {
		message?: string
	}[]
}
