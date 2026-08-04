import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
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
		...(proposal.symbol != null && {
			symbol: proposal.symbol,
		}),
		...(proposal.type != null && {
			type: proposal.type,
		}),
		strategies: proposal.strategies
			.filter((strategy) => strategy != null)
			.map(strategyFields),
		...(proposal.title != null && {
			title: proposal.title,
		}),
		...(proposal.body != null && {
			body: proposal.body,
		}),
		choices: proposal.choices,
		startAtMs: proposal.start * 1000,
		endAtMs: proposal.end * 1000,
		createdAtMs: proposal.created * 1000,
		...(proposal.updated != null && {
			updatedAtMs: proposal.updated * 1000,
		}),
		quorum: proposal.quorum,
		quorumType: proposal.quorumType,
		...(proposal.snapshot != null && {
			snapshotBlock: proposal.snapshot,
		}),
		state: proposal.state,
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
		...(vote.vp != null && {
			votingPower: vote.vp,
		}),
		...(vote.vp_by_strategy != null && {
			votingPowerByStrategy: vote.vp_by_strategy.filter((value) => value != null),
		}),
		...(vote.vp_state != null && {
			votingPowerState: vote.vp_state,
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
	return spaces.map((space) => ({
		[EntityMetaKey.Selector]: spaceSelector(space.id),
	}))
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
	return proposals.map((proposal) => ({
		[EntityMetaKey.Selector]: proposalSelector(proposal.id),
	}))
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
	return votes.map((vote) => ({
		[EntityMetaKey.Selector]: voteSelector(vote.id),
	}))
}

export default {
	source: Source.SnapshotHub_Graphql,
	resolvers: [],
} satisfies RegisteredSourceResolverModule
