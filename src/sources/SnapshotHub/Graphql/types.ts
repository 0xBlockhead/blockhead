import type { FragmentOf } from 'gql.tada'
import { type as arktype } from 'arktype'

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
		cover
		website
		twitter
		github
		farcaster
		coingecko
		discussions
		terms
		location
		domain
		private
		network
		symbol
		strategies {
			...SnapshotHubStrategy
		}
		admins
		members
		moderators
		categories
		proposalsCount
		votesCount
		followersCount
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
		discussion
		choices
		labels
		start
		end
		quorum
		quorumType
		privacy
		snapshot
		state
		link
		app
		scores
		scores_by_strategy
		scores_state
		scores_total
		scores_total_value
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
		app
		vp
		vp_by_strategy
		vp_state
		vp_value
		metadata
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


const snapshotHubOpaqueIdentity = arktype('string >= 1').atMostLength(256)
const snapshotHubMessageIdentity = arktype('string').matching(
	/^(?:0x[0-9a-fA-F]{64}|Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{20,127})$/
)
const snapshotHubNonNegativeSafeInteger = arktype('number.integer >= 0')
const snapshotHubFiniteNonnegative = arktype('number >= 0')
const snapshotHubOptionalString = snapshotHubOpaqueIdentity.or(arktype('null'))
const snapshotHubOptionalNonNegativeSafeInteger = snapshotHubNonNegativeSafeInteger.or(arktype('null'))
const snapshotHubOptionalFiniteNonnegative = snapshotHubFiniteNonnegative.or(arktype('null'))
const snapshotHubOptionalStringList = snapshotHubOpaqueIdentity.array().or(arktype('null'))
const snapshotHubStringList = snapshotHubOpaqueIdentity.array()

export const snapshotHubStrategyEnvelope = arktype({
	name: snapshotHubOpaqueIdentity,
	'network?': snapshotHubOptionalString,
	'params?': 'unknown',
})

export const snapshotHubSpaceEnvelope = arktype({
	id: snapshotHubOpaqueIdentity,
	'name?': snapshotHubOptionalString,
	'about?': snapshotHubOptionalString,
	'avatar?': snapshotHubOptionalString,
	'cover?': snapshotHubOptionalString,
	'website?': snapshotHubOptionalString,
	'twitter?': snapshotHubOptionalString,
	'github?': snapshotHubOptionalString,
	'farcaster?': snapshotHubOptionalString,
	'coingecko?': snapshotHubOptionalString,
	'discussions?': snapshotHubOptionalString,
	'terms?': snapshotHubOptionalString,
	'location?': snapshotHubOptionalString,
	'domain?': snapshotHubOptionalString,
	'private?': arktype('boolean').or(arktype('null')),
	'network?': snapshotHubOptionalString,
	'symbol?': snapshotHubOptionalString,
	'strategies?': snapshotHubStrategyEnvelope.array().or(arktype('null')),
	'admins?': snapshotHubOptionalStringList,
	'members?': snapshotHubOptionalStringList,
	'moderators?': snapshotHubOptionalStringList,
	'categories?': snapshotHubOptionalStringList,
	'proposalsCount?': snapshotHubOptionalNonNegativeSafeInteger,
	'votesCount?': snapshotHubOptionalNonNegativeSafeInteger,
	'followersCount?': snapshotHubOptionalNonNegativeSafeInteger,
	created: snapshotHubNonNegativeSafeInteger,
})

export const snapshotHubProposalEnvelope = arktype({
	id: snapshotHubMessageIdentity,
	'ipfs?': snapshotHubOptionalString,
	author: snapshotHubOpaqueIdentity,
	created: snapshotHubNonNegativeSafeInteger,
	'updated?': snapshotHubOptionalNonNegativeSafeInteger,
	space: {
		id: snapshotHubOpaqueIdentity,
	},
	network: snapshotHubOpaqueIdentity,
	symbol: snapshotHubOpaqueIdentity,
	'type?': snapshotHubOptionalString,
	strategies: snapshotHubStrategyEnvelope.array(),
	title: snapshotHubOpaqueIdentity,
	'body?': snapshotHubOptionalString,
	discussion: 'string',
	choices: snapshotHubStringList,
	labels: snapshotHubStringList,
	start: snapshotHubNonNegativeSafeInteger,
	end: snapshotHubNonNegativeSafeInteger,
	quorum: snapshotHubFiniteNonnegative,
	quorumType: snapshotHubOpaqueIdentity,
	'privacy?': snapshotHubOptionalString,
	'snapshot?': snapshotHubOptionalNonNegativeSafeInteger,
	'state?': snapshotHubOptionalString,
	'link?': snapshotHubOptionalString,
	'app?': snapshotHubOptionalString,
	'scores?': snapshotHubFiniteNonnegative.array().or(arktype('null')),
	'scores_by_strategy?': 'unknown',
	'scores_state?': snapshotHubOptionalString,
	'scores_total?': snapshotHubOptionalFiniteNonnegative,
	'scores_total_value?': snapshotHubOptionalFiniteNonnegative,
	'scores_updated?': snapshotHubOptionalNonNegativeSafeInteger,
	'votes?': snapshotHubOptionalNonNegativeSafeInteger,
})

export const snapshotHubVoteEnvelope = arktype({
	id: snapshotHubMessageIdentity,
	'ipfs?': snapshotHubOptionalString,
	voter: snapshotHubOpaqueIdentity,
	created: snapshotHubNonNegativeSafeInteger,
	space: {
		id: snapshotHubOpaqueIdentity,
	},
	proposal: {
		id: snapshotHubMessageIdentity,
		space: {
			id: snapshotHubOpaqueIdentity,
		},
		strategies: arktype({
			name: snapshotHubOpaqueIdentity,
		}).array(),
	},
	choice: 'unknown',
	'reason?': snapshotHubOptionalString,
	'app?': snapshotHubOptionalString,
	'vp?': snapshotHubOptionalFiniteNonnegative,
	'vp_by_strategy?': snapshotHubFiniteNonnegative.array().or(arktype('null')),
	'vp_state?': snapshotHubOptionalString,
	'vp_value?': snapshotHubOptionalFiniteNonnegative,
	'metadata?': 'unknown',
})

export const snapshotHubSpaceDataEnvelope = arktype({
	'space?': snapshotHubSpaceEnvelope.or(arktype('null')),
})

export const snapshotHubSpacesPageEnvelope = arktype({
	spaces: snapshotHubSpaceEnvelope.array(),
})

export const snapshotHubProposalDataEnvelope = arktype({
	'proposal?': snapshotHubProposalEnvelope.or(arktype('null')),
})

export const snapshotHubProposalsPageEnvelope = arktype({
	proposals: snapshotHubProposalEnvelope.array(),
})

export const snapshotHubVoteDataEnvelope = arktype({
	'vote?': snapshotHubVoteEnvelope.or(arktype('null')),
})

export const snapshotHubVotesPageEnvelope = arktype({
	votes: snapshotHubVoteEnvelope.array(),
})
