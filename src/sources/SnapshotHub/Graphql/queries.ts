import {
	SnapshotHubProposalFragment,
	SnapshotHubSpaceFragment,
	SnapshotHubVoteFragment,
	snapshotHubProposalDataEnvelope,
	snapshotHubProposalEnvelope,
	snapshotHubProposalsPageEnvelope,
	snapshotHubSpaceDataEnvelope,
	snapshotHubSpaceEnvelope,
	snapshotHubSpacesPageEnvelope,
	snapshotHubStrategyEnvelope,
	snapshotHubVoteDataEnvelope,
	snapshotHubVoteEnvelope,
	snapshotHubVotesPageEnvelope,
	type SnapshotHubProposal,
	type SnapshotHubProposalState,
	type SnapshotHubSpace,
	type SnapshotHubStrategy,
	type SnapshotHubVote,
} from '$/sources/SnapshotHub/Graphql/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	isJsonArray,
	isJsonNumber,
} from '$/typescript/JsonValue.ts'

import {
	graphql,
	querySnapshotHub,
} from './client.ts'

const SnapshotHubSpace = graphql(`
	query SnapshotHubSpace($id: String!) {
		space(id: $id) {
			...SnapshotHubSpace
		}
	}
`, [
	SnapshotHubSpaceFragment,
])

const SnapshotHubSpaces = graphql(`
	query SnapshotHubSpaces(
		$first: Int!
		$skip: Int!
	) {
		spaces(
			first: $first
			skip: $skip
			orderBy: "created"
			orderDirection: desc
		) {
			...SnapshotHubSpace
		}
	}
`, [
	SnapshotHubSpaceFragment,
])

const SnapshotHubProposal = graphql(`
	query SnapshotHubProposal($id: String!) {
		proposal(id: $id) {
			...SnapshotHubProposal
		}
	}
`, [
	SnapshotHubProposalFragment,
])

const SnapshotHubProposals = graphql(`
	query SnapshotHubProposals(
		$first: Int!
		$skip: Int!
		$where: ProposalWhere
	) {
		proposals(
			first: $first
			skip: $skip
			where: $where
			orderBy: "created"
			orderDirection: desc
		) {
			...SnapshotHubProposal
		}
	}
`, [
	SnapshotHubProposalFragment,
])

const SnapshotHubVote = graphql(`
	query SnapshotHubVote($id: String!) {
		vote(id: $id) {
			...SnapshotHubVote
		}
	}
`, [
	SnapshotHubVoteFragment,
])

const SnapshotHubVotes = graphql(`
	query SnapshotHubVotes(
		$first: Int!
		$skip: Int!
		$where: VoteWhere
	) {
		votes(
			first: $first
			skip: $skip
			where: $where
			orderBy: "created"
			orderDirection: desc
		) {
			...SnapshotHubVote
		}
	}
`, [
	SnapshotHubVoteFragment,
])

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`SnapshotHub_Graphql: invalid ${label}`)
	}
}

const assertOpaqueIdentity = (
	value: string,
	label: string,
	maximumLength = 256
) => {
	if (
		value.length < 1
		|| value.length > maximumLength
		|| /[\u0000-\u001f\u007f]/.test(value)
	)
		throw new Error(`SnapshotHub_Graphql: invalid ${label}`)
}

const assertMessageIdentity = (
	value: string,
	label: string
) => {
	if (
		!/^0x[0-9a-fA-F]{64}$/.test(value)
		&& !/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(value)
		&& !/^b[a-z2-7]{20,127}$/.test(value)
	)
		throw new Error(`SnapshotHub_Graphql: invalid ${label}`)
}

const assertPage = ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('SnapshotHub_Graphql: page limit must be from 1 through 100')
	if (!Number.isSafeInteger(offset) || offset < 0 || offset > 1_000_000)
		throw new Error('SnapshotHub_Graphql: page offset must be from 0 through 1000000')
}

const assertStrategy = (
	strategy: SnapshotHubStrategy
) => {
	assertEnvelope(
		'strategy envelope',
		snapshotHubStrategyEnvelope,
		strategy
	)
	assertOpaqueIdentity(strategy.name, 'strategy name')
	if (strategy.network != null)
		assertOpaqueIdentity(strategy.network, 'strategy network')
}

const assertSpace = (
	space: SnapshotHubSpace
) => {
	assertEnvelope(
		'space envelope',
		snapshotHubSpaceEnvelope,
		space
	)
	assertOpaqueIdentity(space.id, 'space ID')
	for (const strategy of space.strategies ?? []) {
		if (strategy == null)
			throw new Error('SnapshotHub_Graphql: space contains an empty strategy')

		assertStrategy(strategy)
	}
	if ((space.strategies?.length ?? 0) > 32)
		throw new Error('SnapshotHub_Graphql: space has too many strategies')
	for (const identity of [
		...space.admins ?? [],
		...space.members ?? [],
		...space.moderators ?? [],
	]) {
		if (identity == null)
			throw new Error('SnapshotHub_Graphql: space contains an empty account identity')

		assertOpaqueIdentity(identity, 'space account identity')
	}
}

const assertProposal = (
	proposal: SnapshotHubProposal
) => {
	assertEnvelope(
		'proposal envelope',
		snapshotHubProposalEnvelope,
		proposal
	)
	assertMessageIdentity(proposal.id, 'proposal ID')
	assertOpaqueIdentity(proposal.author, 'proposal author')
	if (proposal.space == null)
		throw new Error('SnapshotHub_Graphql: proposal space is missing')
	assertOpaqueIdentity(proposal.space.id, 'proposal space ID')
	if (proposal.created > proposal.end || proposal.start > proposal.end)
		throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle')
	if (proposal.updated != null && proposal.updated < proposal.created)
		throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle')
	if (
		proposal.state !== 'pending'
		&& proposal.state !== 'active'
		&& proposal.state !== 'closed'
	)
		throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle state')
	if (proposal.choices.length < 1 || proposal.choices.length > 1_000)
		throw new Error('SnapshotHub_Graphql: invalid proposal choice count')
	if (proposal.strategies.length > 32)
		throw new Error('SnapshotHub_Graphql: proposal has too many strategies')
	for (const strategy of proposal.strategies) {
		if (strategy == null)
			throw new Error('SnapshotHub_Graphql: proposal contains an empty strategy')

		assertStrategy(strategy)
	}
	if (proposal.scores != null) {
		for (const score of proposal.scores) {
			if (score == null)
				throw new Error('SnapshotHub_Graphql: proposal contains an empty score')
		}
		if (
			proposal.scores.length !== 0
			&& proposal.scores.length !== proposal.choices.length
		)
			throw new Error('SnapshotHub_Graphql: proposal scores do not align with choices')
	}
	if (proposal.scores_by_strategy != null) {
		if (!isJsonArray(proposal.scores_by_strategy))
			throw new Error('SnapshotHub_Graphql: invalid proposal strategy scores')
		if (
			proposal.scores_by_strategy.length !== 0
			&& proposal.scores_by_strategy.length !== proposal.choices.length
		)
			throw new Error('SnapshotHub_Graphql: strategy scores do not align with choices')
		for (const choiceScores of proposal.scores_by_strategy) {
			if (
				!isJsonArray(choiceScores)
				|| choiceScores.length !== proposal.strategies.length
			)
				throw new Error('SnapshotHub_Graphql: strategy scores do not align with strategies')
			for (const score of choiceScores) {
				if (!isJsonNumber(score) || !Number.isFinite(score) || score < 0)
					throw new Error('SnapshotHub_Graphql: invalid proposal strategy score')
			}
		}
	}
}

const assertVote = (
	vote: SnapshotHubVote
) => {
	assertEnvelope(
		'vote envelope',
		snapshotHubVoteEnvelope,
		vote
	)
	assertMessageIdentity(vote.id, 'vote ID')
	assertOpaqueIdentity(vote.voter, 'voter identity')
	assertOpaqueIdentity(vote.space.id, 'vote space ID')
	if (vote.proposal == null)
		throw new Error('SnapshotHub_Graphql: vote proposal is missing')
	assertMessageIdentity(vote.proposal.id, 'vote proposal ID')
	if (
		vote.proposal.space == null
		|| vote.proposal.space.id !== vote.space.id
	)
		throw new Error('SnapshotHub_Graphql: vote space and proposal space disagree')
	if (vote.vp_by_strategy != null) {
		for (const votingPower of vote.vp_by_strategy) {
			if (votingPower == null)
				throw new Error('SnapshotHub_Graphql: vote contains empty strategy voting power')
		}
		if (
			vote.vp_by_strategy.length !== 0
			&& vote.vp_by_strategy.length !== vote.proposal.strategies.length
		)
			throw new Error('SnapshotHub_Graphql: voting power does not align with strategies')
	}
}

export const getSpace = async ({
	binding,
	spaceId,
}: {
	binding: SourceBinding
	spaceId: string
}) => {
	assertOpaqueIdentity(spaceId, 'requested space ID')
	const { space } = assertEnvelope(
		'space data envelope',
		snapshotHubSpaceDataEnvelope,
		await querySnapshotHub(binding, SnapshotHubSpace, {
			id: spaceId,
		})
	)
	if (space == null)
		return null
	assertSpace(space)
	if (space.id !== spaceId)
		throw new Error('SnapshotHub_Graphql: returned a foreign space')
	return space
}

export const getSpacesPage = async ({
	binding,
	limit,
	offset,
}: {
	binding: SourceBinding
	limit: number
	offset: number
}) => {
	assertPage({
		limit,
		offset,
	})
	const { spaces } = assertEnvelope(
		'spaces page envelope',
		snapshotHubSpacesPageEnvelope,
		await querySnapshotHub(binding, SnapshotHubSpaces, {
			first: limit,
			skip: offset,
		})
	)
	if (spaces.length > limit)
		throw new Error('SnapshotHub_Graphql: space page exceeds requested limit')
	const spaceIds = new Set<string>()
	for (const space of spaces) {
		assertSpace(space)
		if (spaceIds.has(space.id))
			throw new Error('SnapshotHub_Graphql: duplicate space in page')
		spaceIds.add(space.id)
	}
	return spaces
}

export const getProposal = async ({
	binding,
	proposalId,
}: {
	binding: SourceBinding
	proposalId: string
}) => {
	assertMessageIdentity(proposalId, 'requested proposal ID')
	const { proposal } = assertEnvelope(
		'proposal data envelope',
		snapshotHubProposalDataEnvelope,
		await querySnapshotHub(binding, SnapshotHubProposal, {
			id: proposalId,
		})
	)
	if (proposal == null)
		return null
	assertProposal(proposal)
	if (proposal.id !== proposalId)
		throw new Error('SnapshotHub_Graphql: returned a foreign proposal')
	return proposal
}

export const getProposalsPage = async ({
	binding,
	spaceId,
	state,
	limit,
	offset,
}: {
	binding: SourceBinding
	spaceId: string
	state?: SnapshotHubProposalState
	limit: number
	offset: number
}) => {
	assertOpaqueIdentity(spaceId, 'requested space ID')
	assertPage({
		limit,
		offset,
	})
	const { proposals } = assertEnvelope(
		'proposals page envelope',
		snapshotHubProposalsPageEnvelope,
		await querySnapshotHub(binding, SnapshotHubProposals, {
			first: limit,
			skip: offset,
			where: {
				space: spaceId,
				...(state != null && {
					state,
				}),
			},
		})
	)
	if (proposals.length > limit)
		throw new Error('SnapshotHub_Graphql: proposal page exceeds requested limit')
	const proposalIds = new Set<string>()
	for (const proposal of proposals) {
		assertProposal(proposal)
		if (proposal.space?.id !== spaceId)
			throw new Error('SnapshotHub_Graphql: returned a proposal from a foreign space')
		if (state != null && proposal.state !== state)
			throw new Error('SnapshotHub_Graphql: proposal state filter was violated')
		if (proposalIds.has(proposal.id))
			throw new Error('SnapshotHub_Graphql: duplicate proposal in page')
		proposalIds.add(proposal.id)
	}
	return proposals
}

export const getVote = async ({
	binding,
	voteId,
}: {
	binding: SourceBinding
	voteId: string
}) => {
	assertMessageIdentity(voteId, 'requested vote ID')
	const { vote } = assertEnvelope(
		'vote data envelope',
		snapshotHubVoteDataEnvelope,
		await querySnapshotHub(binding, SnapshotHubVote, {
			id: voteId,
		})
	)
	if (vote == null)
		return null
	assertVote(vote)
	if (vote.id !== voteId)
		throw new Error('SnapshotHub_Graphql: returned a foreign vote')
	return vote
}

export const getVotesPage = async ({
	binding,
	proposalId,
	limit,
	offset,
}: {
	binding: SourceBinding
	proposalId: string
	limit: number
	offset: number
}) => {
	assertMessageIdentity(proposalId, 'requested proposal ID')
	assertPage({
		limit,
		offset,
	})
	const { votes } = assertEnvelope(
		'votes page envelope',
		snapshotHubVotesPageEnvelope,
		await querySnapshotHub(binding, SnapshotHubVotes, {
			first: limit,
			skip: offset,
			where: {
				proposal: proposalId,
			},
		})
	)
	if (votes.length > limit)
		throw new Error('SnapshotHub_Graphql: vote page exceeds requested limit')
	const voteIds = new Set<string>()
	for (const vote of votes) {
		assertVote(vote)
		if (vote.proposal?.id !== proposalId)
			throw new Error('SnapshotHub_Graphql: returned a vote for a foreign proposal')
		if (voteIds.has(vote.id))
			throw new Error('SnapshotHub_Graphql: duplicate vote in page')
		voteIds.add(vote.id)
	}
	return votes
}
