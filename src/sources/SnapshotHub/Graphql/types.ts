import type { FragmentOf } from 'gql.tada'

import { graphql } from './client.ts'

export const SnapshotHubStrategyFragment = graphql(`
	fragment SnapshotHubStrategy on Strategy @_unmask {
		name
		network
		params
	}
`)

export const SnapshotHubSpaceFragment = graphql(`
	fragment SnapshotHubSpace on Space @_unmask {
		id
		name
		about
		avatar
		network
		symbol
		strategies {
			...SnapshotHubStrategy
		}
		admins
		members
		categories
		proposalsCount
		votesCount
		created
	}
`, [
	SnapshotHubStrategyFragment,
])

export const SnapshotHubProposalFragment = graphql(`
	fragment SnapshotHubProposal on Proposal @_unmask {
		id
		ipfs
		author
		created
		updated
		space {
			id
		}
		network
		symbol
		type
		strategies {
			...SnapshotHubStrategy
		}
		title
		body
		choices
		start
		end
		quorum
		quorumType
		snapshot
		state
		scores
		scores_by_strategy
		scores_state
		scores_total
		scores_updated
		votes
	}
`, [
	SnapshotHubStrategyFragment,
])

export const SnapshotHubVoteFragment = graphql(`
	fragment SnapshotHubVote on Vote @_unmask {
		id
		ipfs
		voter
		created
		space {
			id
		}
		proposal {
			id
			space {
				id
			}
			strategies {
				name
			}
		}
		choice
		reason
		vp
		vp_by_strategy
		vp_state
	}
`)

export type SnapshotHubStrategy = FragmentOf<typeof SnapshotHubStrategyFragment>
export type SnapshotHubSpace = FragmentOf<typeof SnapshotHubSpaceFragment>
export type SnapshotHubProposal = FragmentOf<typeof SnapshotHubProposalFragment>
export type SnapshotHubVote = FragmentOf<typeof SnapshotHubVoteFragment>

// Hub documents this closed set, but its schema currently exposes state as String.
export type SnapshotHubProposalState =
	| 'pending'
	| 'active'
	| 'closed'
