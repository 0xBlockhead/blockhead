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

export type TallyGovernor = {
	id: string
	chainId: string
	name: string | null
	slug: string | null
	type: string | null
	kind: string | null
	quorum: string | null
	timelockId: string | null
	tokenId: string | null
	delegatesCount: number | null
	delegatesVotesCount: string | null
	tokenOwnersCount: number | null
	isPrimary: boolean | null
	organization: {
		id: string
		slug: string | null
		name: string | null
	} | null
	proposalStats: {
		total: number
		active: number
		failed: number
		passed: number
	} | null
	parameters: {
		quorumVotes: string | null
		proposalThreshold: string | null
		votingDelay: string | null
		votingPeriod: string | null
		gracePeriod: string | null
		clockMode: string | null
		countingMode: string | null
	} | null
	contracts: {
		governor: {
			address: string
		} | null
	} | null
	metadata: {
		description: string | null
	} | null
}

export type TallyProposal = {
	id: string
	onchainId: string | null
	chainId: string
	status: TallyProposalStatus
	quorum: string | null
	metadata: {
		title: string
		description: string
		eta: number | null
		ipfsHash: string | null
		txHash: string | null
		discourseURL: string | null
		snapshotURL: string | null
	} | null
	governor: {
		id: string
		chainId: string
		name: string | null
		slug: string | null
	}
	organization: {
		id: string
		slug: string | null
		name: string | null
	} | null
	proposer: {
		address: string
		ens: string | null
		name: string | null
	} | null
	start: {
		timestamp: string | null
	} | null
	end: {
		timestamp: string | null
	} | null
	voteStats: {
		type: string
		votesCount: string
		votersCount: number
		percent: number
	}[] | null
}

export type TallyPageInfo = {
	firstCursor: string | null
	lastCursor: string | null
	count: number | null
}
