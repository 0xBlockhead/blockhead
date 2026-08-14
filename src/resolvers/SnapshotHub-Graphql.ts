import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import type {
	SnapshotHubProposal,
	SnapshotHubProposalState,
	SnapshotHubSpace,
	SnapshotHubStrategy,
	SnapshotHubVote,
} from '$/sources/SnapshotHub/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'


const zeroExAddress = (
	value: string
): `0x${string}` => (
	`0x${value.slice(2).toLowerCase()}`
)

const isEvmAddress = (
	value: string
) => (
	/^0x[0-9a-fA-F]{40}$/.test(value)
)

const snapshotOffset = (
	context: ResolverContext,
	label: string
) => {
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error(`SnapshotHub_Graphql: invalid ${label} continuation`)

	const offset = (
		context.providerContinuationToken == null ?
			context.pagination.offset ?? 0
		:
			Number(context.providerContinuationToken)
	)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`SnapshotHub_Graphql: invalid ${label} continuation`)

	return offset
}

const evmNetworkSelector = (
	chainId: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(chainId))
		throw new Error('SnapshotHub_Graphql: Snapshot network is not an EVM chain id')

	return {
		caip2: {
			namespace: 'eip155' as const,
			reference: chainId,
		},
	}
}

const evmNetworkAccount = (
	$network: ReturnType<typeof evmNetworkSelector>,
	address: string
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		$actor: {
			address: zeroExAddress(address),
		},
	},
})

const strategyFields = (
	strategy: SnapshotHubStrategy
) => ({
	name: strategy.name,
	...(strategy.network != null && {
		network: strategy.network,
	}),
	...(strategy.params != null && {
		params: strategy.params,
	}),
})

const spaceSelector = (
	spaceId: string
) => ({
	spaceId,
})

const proposalSelector = (
	proposalId: string
) => ({
	proposalId,
})

const voteSelector = (
	voteId: string
) => ({
	voteId,
})

export const snapshotSpaceFields = (
	space: SnapshotHubSpace
) => {
	const $network = (
		space.network != null ?
			evmNetworkSelector(space.network)
		:
			undefined
	)

	return {
		[EntityMetaKey.Selector]: spaceSelector(space.id),
		spaceId: space.id,
		...(space.name != null && {
			name: space.name,
		}),
		...(space.about != null && {
			about: space.about,
		}),
		...(space.avatar != null && {
			avatar: space.avatar,
			$avatar: mediaFromUrl(space.avatar, MediaType.Image),
		}),
		...(space.cover != null && {
			cover: space.cover,
		}),
		...(space.website != null && {
			website: space.website,
		}),
		...(space.twitter != null && {
			twitter: space.twitter,
		}),
		...(space.github != null && {
			github: space.github,
		}),
		...(space.farcaster != null && {
			farcaster: space.farcaster,
		}),
		...(space.coingecko != null && {
			coingecko: space.coingecko,
		}),
		...(space.discussions != null && {
			discussions: space.discussions,
		}),
		...(space.terms != null && {
			terms: space.terms,
		}),
		...(space.location != null && {
			location: space.location,
		}),
		...(space.domain != null && {
			domain: space.domain,
		}),
		...(space.private != null && {
			private: space.private,
		}),
		...(space.symbol != null && {
			symbol: space.symbol,
		}),
		...($network != null && {
			$network: {
				[EntityMetaKey.Selector]: $network,
			},
		}),
		strategies: (
			space.strategies
				?.filter((strategy) => strategy != null)
				.map(strategyFields)
			?? []
		),
		...(
			$network != null
			&& {
				$$admins: (
					space.admins
						?.filter((admin) => admin != null && isEvmAddress(admin))
						.map((admin) => evmNetworkAccount($network, admin))
					?? []
				),
				$$members: (
					space.members
						?.filter((member) => member != null && isEvmAddress(member))
						.map((member) => evmNetworkAccount($network, member))
					?? []
				),
				$$moderators: (
					space.moderators
						?.filter((moderator) => moderator != null && isEvmAddress(moderator))
						.map((moderator) => evmNetworkAccount($network, moderator))
					?? []
				),
			}
		),
		...(space.categories != null && {
			categories: space.categories.filter((category) => category != null),
		}),
		...(space.proposalsCount != null && {
			proposalsCount: space.proposalsCount,
		}),
		...(space.votesCount != null && {
			votesCount: space.votesCount,
		}),
		...(space.followersCount != null && {
			followersCount: space.followersCount,
		}),
		createdAtMs: space.created * 1000,
	}
}

export const snapshotProposalFields = (
	proposal: SnapshotHubProposal
) => {
	if (proposal.space == null)
		throw new Error('SnapshotHub_Graphql: proposal space is missing')

	const $network = evmNetworkSelector(proposal.network)

	return {
		[EntityMetaKey.Selector]: proposalSelector(proposal.id),
		proposalId: proposal.id,
		...(proposal.ipfs != null && {
			ipfs: proposal.ipfs,
		}),
		$space: {
			[EntityMetaKey.Selector]: spaceSelector(proposal.space.id),
		},
		$network: {
			[EntityMetaKey.Selector]: $network,
		},
		...(isEvmAddress(proposal.author) && {
			$authorAccount: evmNetworkAccount($network, proposal.author),
		}),
		author: proposal.author,
		symbol: proposal.symbol,
		...(proposal.type != null && {
			type: proposal.type,
		}),
		strategies: proposal.strategies
			.filter((strategy) => strategy != null)
			.map(strategyFields),
		title: proposal.title,
		...(proposal.body != null && {
			body: proposal.body,
		}),
		discussion: proposal.discussion,
		choices: proposal.choices.filter((choice) => choice != null),
		labels: proposal.labels.filter((label) => label != null),
		startAtMs: proposal.start * 1000,
		endAtMs: proposal.end * 1000,
		createdAtMs: proposal.created * 1000,
		...(proposal.updated != null && {
			updatedAtMs: proposal.updated * 1000,
		}),
		quorum: proposal.quorum,
		quorumType: proposal.quorumType,
		...(proposal.privacy != null && {
			privacy: proposal.privacy,
		}),
		...(proposal.snapshot != null && {
			snapshotBlock: proposal.snapshot,
		}),
		state: proposal.state,
		...(proposal.link != null && {
			link: proposal.link,
		}),
		...(proposal.app != null && {
			app: proposal.app,
		}),
		...(proposal.scores != null && {
			scores: proposal.scores.filter((score) => score != null),
		}),
		...(proposal.scores_by_strategy != null && {
			scoresByStrategy: proposal.scores_by_strategy,
		}),
		...(proposal.scores_state != null && {
			scoresState: proposal.scores_state,
		}),
		...(proposal.scores_total != null && {
			scoresTotal: proposal.scores_total,
		}),
		...(proposal.scores_total_value != null && {
			scoresTotalValue: proposal.scores_total_value,
		}),
		...(proposal.scores_updated != null && {
			scoresUpdatedAtMs: proposal.scores_updated * 1000,
		}),
		...(proposal.votes != null && {
			votesCount: proposal.votes,
		}),
	}
}

export const snapshotVoteFields = (
	vote: SnapshotHubVote
) => {
	if (vote.proposal == null)
		throw new Error('SnapshotHub_Graphql: vote proposal is missing')

	return {
		[EntityMetaKey.Selector]: voteSelector(vote.id),
		voteId: vote.id,
		...(vote.ipfs != null && {
			ipfs: vote.ipfs,
		}),
		$space: {
			[EntityMetaKey.Selector]: spaceSelector(vote.space.id),
		},
		$proposal: {
			[EntityMetaKey.Selector]: proposalSelector(vote.proposal.id),
		},
		voter: vote.voter,
		choice: vote.choice,
		...(vote.reason != null && {
			reason: vote.reason,
		}),
		...(vote.app != null && {
			app: vote.app,
		}),
		...(vote.vp != null && {
			votingPower: vote.vp,
		}),
		...(vote.vp_by_strategy != null && {
			votingPowerByStrategy: vote.vp_by_strategy.filter((value) => value != null),
		}),
		...(vote.vp_state != null && {
			votingPowerState: vote.vp_state,
		}),
		...(vote.vp_value != null && {
			votingPowerValue: vote.vp_value,
		}),
		...(vote.metadata != null && {
			metadata: vote.metadata,
		}),
		createdAtMs: vote.created * 1000,
	}
}

export const resolveSnapshotSpace = async ({
	spaceId,
}: {
	spaceId: string
}) => {
	const { getSpace } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const space = await getSpace({
		spaceId,
	})
	if (space == null)
		throw new Error('SnapshotHub_Graphql: space not found')

	return snapshotSpaceFields(space)
}

export const resolveSnapshotSpaces = async (
	context: ResolverContext
) => {
	const { getSpacesPage } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const spaces = await getSpacesPage({
		limit: resolverContextRowLimit(context),
		offset: context.pagination.offset ?? 0,
	})
	return spaces.map((space) => {
		const fields = snapshotSpaceFields(space)
		return {
			[EntityMetaKey.Selector]: spaceSelector(space.id),
			[EntityMetaKey.Fields]: {
				...(fields.name != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'name')]: fields.name,
				}),
				...(fields.about != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'about')]: fields.about,
				}),
				...(fields.avatar != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'avatar')]: fields.avatar,
				}),
				...(fields.$avatar != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], '$avatar')]: fields.$avatar,
				}),
				...(fields.symbol != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'symbol')]: fields.symbol,
				}),
				...(fields.$network != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], '$network')]: fields.$network,
				}),
				...(fields.proposalsCount != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'proposalsCount')]: fields.proposalsCount,
				}),
				...(fields.votesCount != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'votesCount')]: fields.votesCount,
				}),
				...(fields.followersCount != null && {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'followersCount')]: fields.followersCount,
				}),
				[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'createdAtMs')]: fields.createdAtMs,
			},
		}
	})
}

export const resolveSnapshotProposal = async ({
	proposalId,
}: {
	proposalId: string
}) => {
	const { getProposal } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const proposal = await getProposal({
		proposalId,
	})
	if (proposal == null)
		throw new Error('SnapshotHub_Graphql: proposal not found')

	return snapshotProposalFields(proposal)
}

export const resolveSnapshotProposals = async ({
	spaceId,
	state,
}: {
	spaceId: string
	state?: SnapshotHubProposalState
},
	context: ResolverContext
) => {
	const { getProposalsPage } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const proposals = await getProposalsPage({
		spaceId,
		state,
		limit: resolverContextRowLimit(context),
		offset: context.pagination.offset ?? 0,
	})
	return proposals.map((proposal) => {
		const fields = snapshotProposalFields(proposal)
		return {
			[EntityMetaKey.Selector]: proposalSelector(proposal.id),
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], '$space')]: fields.$space,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], '$network')]: fields.$network,
				...(fields.$authorAccount != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], '$authorAccount')]: fields.$authorAccount,
				}),
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'author')]: fields.author,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'title')]: fields.title,
				...(fields.body != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'body')]: fields.body,
				}),
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'discussion')]: fields.discussion,
				...(fields.type != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'type')]: fields.type,
				}),
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'state')]: fields.state,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'choices')]: fields.choices,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'labels')]: fields.labels,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'startAtMs')]: fields.startAtMs,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'endAtMs')]: fields.endAtMs,
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'createdAtMs')]: fields.createdAtMs,
				...(fields.updatedAtMs != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'updatedAtMs')]: fields.updatedAtMs,
				}),
				[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'quorum')]: fields.quorum,
				...(fields.votesCount != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'votesCount')]: fields.votesCount,
				}),
				...(fields.scores != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'scores')]: fields.scores,
				}),
				...(fields.scoresTotal != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'scoresTotal')]: fields.scoresTotal,
				}),
				...(fields.link != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'link')]: fields.link,
				}),
				...(fields.app != null && {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'app')]: fields.app,
				}),
			},
		}
	})
}

export const resolveSnapshotVote = async ({
	voteId,
}: {
	voteId: string
}) => {
	const { getVote } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const vote = await getVote({
		voteId,
	})
	if (vote == null)
		throw new Error('SnapshotHub_Graphql: vote not found')

	return snapshotVoteFields(vote)
}

export const resolveSnapshotVotes = async ({
	proposalId,
}: {
	proposalId: string
},
	context: ResolverContext
) => {
	const { getVotesPage } = await import('$/sources/SnapshotHub/Graphql/queries.ts')
	const votes = await getVotesPage({
		proposalId,
		limit: resolverContextRowLimit(context),
		offset: context.pagination.offset ?? 0,
	})
	return votes.map((vote) => {
		const fields = snapshotVoteFields(vote)
		return {
			[EntityMetaKey.Selector]: voteSelector(vote.id),
			[EntityMetaKey.Fields]: {
				...(fields.ipfs != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'ipfs')]: fields.ipfs,
				}),
				[entityFieldAddressKey(EntityType.SnapshotVote, [], '$space')]: fields.$space,
				[entityFieldAddressKey(EntityType.SnapshotVote, [], '$proposal')]: fields.$proposal,
				[entityFieldAddressKey(EntityType.SnapshotVote, [], 'voter')]: fields.voter,
				[entityFieldAddressKey(EntityType.SnapshotVote, [], 'choice')]: fields.choice,
				...(fields.reason != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'reason')]: fields.reason,
				}),
				...(fields.app != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'app')]: fields.app,
				}),
				...(fields.votingPower != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'votingPower')]: fields.votingPower,
				}),
				...(fields.votingPowerByStrategy != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'votingPowerByStrategy')]: fields.votingPowerByStrategy,
				}),
				...(fields.votingPowerState != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'votingPowerState')]: fields.votingPowerState,
				}),
				...(fields.votingPowerValue != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'votingPowerValue')]: fields.votingPowerValue,
				}),
				...(fields.metadata != null && {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'metadata')]: fields.metadata,
				}),
				[entityFieldAddressKey(EntityType.SnapshotVote, [], 'createdAtMs')]: fields.createdAtMs,
			},
		}
	})
}

export default {
	source: Source.SnapshotHub_Graphql,
	resolvers: [
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const offset = snapshotOffset(context, 'spaces')

						return {
							offset,
							limit: resolverContextRowLimit(context),
							$$snapshotSpaces: await resolveSnapshotSpaces({
								...context,
								pagination: {
									...context.pagination,
									offset,
								},
							}),
						}
					},
				},
			},
		})({
			$$snapshotSpaces: {
				select: (snapshot) => snapshot.$$snapshotSpaces,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.$$snapshotSpaces.length
					return {
						operation: 'spaces',
						target: 'snapshot-hub',
						terminal: snapshot.$$snapshotSpaces.length < snapshot.limit,
						...(snapshot.$$snapshotSpaces.length === snapshot.limit && {
							token: String(nextOffset),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.SnapshotSpace,
			resolve: {
				SpaceId: {
					resolve: async ({ spaceId }) => (
						resolveSnapshotSpace({
							spaceId,
						})
					),
				},
			},
		})({
			spaceId: (space) => space.spaceId,
			name: (space) => space.name,
			about: (space) => space.about,
			avatar: (space) => space.avatar,
			$avatar: (space) => space.$avatar,
			symbol: (space) => space.symbol,
			$network: (space) => space.$network,
			proposalsCount: (space) => space.proposalsCount,
			votesCount: (space) => space.votesCount,
			followersCount: (space) => space.followersCount,
			createdAtMs: (space) => space.createdAtMs,
		}),

		defineResolver({
			entityType: EntityType.SnapshotSpace,
			resolve: {
				SpaceId: {
					resolve: async ({ spaceId }, context) => {
						const offset = snapshotOffset(context, 'proposals')

						return {
							offset,
							limit: resolverContextRowLimit(context),
							$$proposals: await resolveSnapshotProposals({
								spaceId,
							}, {
								...context,
								pagination: {
									...context.pagination,
									offset,
								},
							}),
						}
					},
				},
			},
		})({
			$$proposals: {
				select: (snapshot) => snapshot.$$proposals,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.$$proposals.length
					return {
						operation: 'proposals',
						target: 'snapshot-hub',
						terminal: snapshot.$$proposals.length < snapshot.limit,
						...(snapshot.$$proposals.length === snapshot.limit && {
							token: String(nextOffset),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.SnapshotSpace,
			resolve: {
				SpaceId: {
					resolve: async ({ spaceId }) => {
						const proposalsCount = (await resolveSnapshotSpace({
							spaceId,
						})).proposalsCount
						if (proposalsCount == null)
							throw new Error('SnapshotHub_Graphql: space proposal count is unavailable')

						return proposalsCount
					},
				},
			},
		})({
			$$proposals: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.SnapshotProposal,
			resolve: {
				ProposalId: {
					resolve: async ({ proposalId }) => (
						resolveSnapshotProposal({
							proposalId,
						})
					),
				},
			},
		})({
			proposalId: (proposal) => proposal.proposalId,
			$space: (proposal) => proposal.$space,
			$network: (proposal) => proposal.$network,
			$authorAccount: (proposal) => proposal.$authorAccount,
			author: (proposal) => proposal.author,
			title: (proposal) => proposal.title,
			body: (proposal) => proposal.body,
			discussion: (proposal) => proposal.discussion,
			type: (proposal) => proposal.type,
			state: (proposal) => proposal.state,
			choices: (proposal) => proposal.choices,
			labels: (proposal) => proposal.labels,
			startAtMs: (proposal) => proposal.startAtMs,
			endAtMs: (proposal) => proposal.endAtMs,
			createdAtMs: (proposal) => proposal.createdAtMs,
			updatedAtMs: (proposal) => proposal.updatedAtMs,
			quorum: (proposal) => proposal.quorum,
			votesCount: (proposal) => proposal.votesCount,
			scores: (proposal) => proposal.scores,
			scoresTotal: (proposal) => proposal.scoresTotal,
			link: (proposal) => proposal.link,
			app: (proposal) => proposal.app,
		}),

		defineResolver({
			entityType: EntityType.SnapshotProposal,
			resolve: {
				ProposalId: {
					resolve: async ({ proposalId }, context) => {
						const offset = snapshotOffset(context, 'votes')

						return {
							offset,
							limit: resolverContextRowLimit(context),
							$$votes: await resolveSnapshotVotes({
								proposalId,
							}, {
								...context,
								pagination: {
									...context.pagination,
									offset,
								},
							}),
						}
					},
				},
			},
		})({
			$$votes: {
				select: (snapshot) => snapshot.$$votes,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.$$votes.length
					return {
						operation: 'votes',
						target: 'snapshot-hub',
						terminal: snapshot.$$votes.length < snapshot.limit,
						...(snapshot.$$votes.length === snapshot.limit && {
							token: String(nextOffset),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.SnapshotProposal,
			resolve: {
				ProposalId: {
					resolve: async ({ proposalId }) => {
						const votesCount = (await resolveSnapshotProposal({
							proposalId,
						})).votesCount
						if (votesCount == null)
							throw new Error('SnapshotHub_Graphql: proposal vote count is unavailable')

						return votesCount
					},
				},
			},
		})({
			$$votes: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.SnapshotVote,
			resolve: {
				VoteId: {
					resolve: async ({ voteId }) => (
						resolveSnapshotVote({
							voteId,
						})
					),
				},
			},
		})({
			voteId: (vote) => vote.voteId,
			ipfs: (vote) => vote.ipfs,
			$space: (vote) => vote.$space,
			$proposal: (vote) => vote.$proposal,
			voter: (vote) => vote.voter,
			choice: (vote) => vote.choice,
			reason: (vote) => vote.reason,
			app: (vote) => vote.app,
			votingPower: (vote) => vote.votingPower,
			votingPowerByStrategy: (vote) => vote.votingPowerByStrategy,
			votingPowerState: (vote) => vote.votingPowerState,
			votingPowerValue: (vote) => vote.votingPowerValue,
			metadata: (vote) => vote.metadata,
			createdAtMs: (vote) => vote.createdAtMs,
		}),
	],
} satisfies RegisteredSourceResolverModule
