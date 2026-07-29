import type { JsonValue } from '$/typescript/JsonValue.ts'

export type SnapshotHubStrategy = {
	name: string
	network: string | null
	params: JsonValue
}

export type SnapshotHubSpaceReference = {
	id: string
}

export type SnapshotHubSpace = {
	id: string
	name: string | null
	about: string | null
	avatar: string | null
	network: string | null
	symbol: string | null
	strategies: SnapshotHubStrategy[] | null
	admins: string[] | null
	members: string[] | null
	categories: string[] | null
	proposalsCount: number | null
	votesCount: number | null
	created: number
}

export type SnapshotHubProposalState =
	| 'pending'
	| 'active'
	| 'closed'

export type SnapshotHubProposal = {
	id: string
	ipfs: string | null
	author: string
	created: number
	updated: number | null
	space: SnapshotHubSpaceReference | null
	network: string
	symbol: string
	type: string | null
	strategies: SnapshotHubStrategy[]
	title: string
	body: string | null
	choices: string[]
	start: number
	end: number
	quorum: number
	quorumType: string
	snapshot: number | null
	state: SnapshotHubProposalState | null
	scores: number[] | null
	scores_by_strategy: JsonValue
	scores_state: string | null
	scores_total: number | null
	scores_updated: number | null
	votes: number | null
}

export type SnapshotHubVoteProposalReference = {
	id: string
	space: SnapshotHubSpaceReference | null
	strategies: {
		name: string
	}[]
}

export type SnapshotHubVote = {
	id: string
	ipfs: string | null
	voter: string
	created: number
	space: SnapshotHubSpaceReference
	proposal: SnapshotHubVoteProposalReference | null
	choice: JsonValue
	reason: string | null
	vp: number | null
	vp_by_strategy: number[] | null
	vp_state: string | null
}

export type SnapshotHubObservation<_Value> = {
	value: _Value
	observedBy: 'SnapshotHub_Graphql'
	endpoint: 'https://hub.snapshot.org/graphql'
	resolvedAtMs: number
}

export type SnapshotHubPage<_Value> = {
	items: _Value[]
	nextOffset?: number
}
