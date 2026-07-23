import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	SnapshotHubGraphqlResponse,
	SnapshotHubObservation,
	SnapshotHubPage,
	SnapshotHubProposal,
	SnapshotHubProposalState,
	SnapshotHubSpace,
	SnapshotHubStrategy,
	SnapshotHubVote,
} from '$/sources/SnapshotHub/Graphql/types.ts'
import {
	isJsonArray,
	isJsonNumber,
} from '$/typescript/JsonValue.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const snapshotHubGraphqlEndpoint = 'https://hub.snapshot.org/graphql' as const
export const maximumSnapshotHubGraphqlResponseBytes = 2_000_000

const proposalFields = `
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
		name
		network
		params
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
`

const spaceFields = `
	id
	name
	about
	avatar
	network
	symbol
	strategies {
		name
		network
		params
	}
	admins
	members
	categories
	proposalsCount
	votesCount
	created
`

const voteFields = `
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
`

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.target.kind !== SourceTargetKind.Global
		|| binding.target.key !== 'snapshot-hub'
		|| binding.wireProtocol !== WireProtocol.Graphql
		|| binding.apiFamily !== ApiFamily.GraphqlHttp
		|| binding.delivery !== SourceDelivery.BrowserDirect
		|| firstHttpUrlForBinding(binding) !== snapshotHubGraphqlEndpoint
	)
		throw new Error('SnapshotHub_Graphql: expected canonical public Hub binding')
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

const assertSafeNonnegativeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`SnapshotHub_Graphql: invalid ${label}`)
}

const assertFiniteNonnegativeNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0)
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

const readBoundedResponse = async (
	response: Response
) => {
	const declaredLength = Number(response.headers.get('content-length'))
	if (
		Number.isFinite(declaredLength)
		&& declaredLength > maximumSnapshotHubGraphqlResponseBytes
	)
		throw new Error('SnapshotHub_Graphql: response exceeds byte limit')
	if (response.body == null)
		throw new Error('SnapshotHub_Graphql: response body is missing')

	const reader = response.body.getReader()
	const chunks: Uint8Array[] = []
	let byteLength = 0

	for (;;) {
		const { done, value } = await reader.read()
		if (done)
			break
		byteLength += value.byteLength
		if (byteLength > maximumSnapshotHubGraphqlResponseBytes) {
			await reader.cancel()
			throw new Error('SnapshotHub_Graphql: response exceeds byte limit')
		}
		chunks.push(value)
	}

	const bytes = new Uint8Array(byteLength)
	let offset = 0
	for (const chunk of chunks) {
		bytes.set(chunk, offset)
		offset += chunk.byteLength
	}
	return new TextDecoder().decode(bytes)
}

const graphql = async <_Data>({
	binding,
	query,
	variables,
}: {
	binding: SourceBinding
	query: string
	variables: JsonValue
}) => {
	assertBinding(binding)
	const response = await sourceFetch(
		binding,
		snapshotHubGraphqlEndpoint,
		{
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		}
	)
	const responseText = await readBoundedResponse(response)
	if (!response.ok)
		throw new Error(`Snapshot Hub GraphQL: ${response.status} ${response.statusText}`)
	const payload = JSON.parse(
		responseText
	) as SnapshotHubGraphqlResponse<_Data>
	if (payload.errors?.[0]?.message != null)
		throw new Error(`SnapshotHub_Graphql: ${payload.errors[0].message}`)
	if (payload.data == null)
		throw new Error('SnapshotHub_Graphql: response is missing data')
	return payload.data
}

const observation = <_Value>(
	value: _Value
): SnapshotHubObservation<_Value> => ({
	value,
	observedBy: 'SnapshotHub_Graphql',
	endpoint: snapshotHubGraphqlEndpoint,
	resolvedAtMs: Date.now(),
})

const assertStrategy = (
	strategy: SnapshotHubStrategy
) => {
	assertOpaqueIdentity(strategy.name, 'strategy name')
	if (strategy.network != null)
		assertOpaqueIdentity(strategy.network, 'strategy network')
}

const assertSpace = (
	space: SnapshotHubSpace
) => {
	assertOpaqueIdentity(space.id, 'space ID')
	assertSafeNonnegativeInteger(space.created, 'space creation timestamp')
	for (const strategy of space.strategies ?? [])
		assertStrategy(strategy)
	if ((space.strategies?.length ?? 0) > 32)
		throw new Error('SnapshotHub_Graphql: space has too many strategies')
	for (const identity of [
		...space.admins ?? [],
		...space.members ?? [],
	])
		assertOpaqueIdentity(identity, 'space account identity')
	for (const count of [
		space.proposalsCount,
		space.votesCount,
	])
		if (count != null)
			assertSafeNonnegativeInteger(count, 'space aggregate count')
}

const assertProposal = (
	proposal: SnapshotHubProposal
) => {
	assertMessageIdentity(proposal.id, 'proposal ID')
	assertOpaqueIdentity(proposal.author, 'proposal author')
	if (proposal.space == null)
		throw new Error('SnapshotHub_Graphql: proposal space is missing')
	assertOpaqueIdentity(proposal.space.id, 'proposal space ID')
	assertOpaqueIdentity(proposal.network, 'proposal network')
	assertSafeNonnegativeInteger(proposal.created, 'proposal creation timestamp')
	assertSafeNonnegativeInteger(proposal.start, 'proposal start timestamp')
	assertSafeNonnegativeInteger(proposal.end, 'proposal end timestamp')
	if (proposal.created > proposal.end || proposal.start > proposal.end)
		throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle')
	if (proposal.updated != null) {
		assertSafeNonnegativeInteger(proposal.updated, 'proposal update timestamp')
		if (proposal.updated < proposal.created)
			throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle')
	}
	if (
		proposal.state !== 'pending'
		&& proposal.state !== 'active'
		&& proposal.state !== 'closed'
	)
		throw new Error('SnapshotHub_Graphql: invalid proposal lifecycle state')
	if (proposal.snapshot != null)
		assertSafeNonnegativeInteger(proposal.snapshot, 'proposal snapshot block')
	assertFiniteNonnegativeNumber(proposal.quorum, 'proposal quorum')
	assertOpaqueIdentity(proposal.quorumType, 'proposal quorum type')
	if (proposal.choices.length < 1 || proposal.choices.length > 1_000)
		throw new Error('SnapshotHub_Graphql: invalid proposal choice count')
	if (proposal.strategies.length > 32)
		throw new Error('SnapshotHub_Graphql: proposal has too many strategies')
	for (const strategy of proposal.strategies)
		assertStrategy(strategy)
	if (proposal.scores != null) {
		for (const score of proposal.scores)
			assertFiniteNonnegativeNumber(score, 'proposal choice score')
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
				if (!isJsonNumber(score))
					throw new Error('SnapshotHub_Graphql: invalid proposal strategy score')
				assertFiniteNonnegativeNumber(score, 'proposal strategy score')
			}
		}
	}
	if (proposal.scores_total != null)
		assertFiniteNonnegativeNumber(proposal.scores_total, 'proposal total score')
	if (proposal.scores_updated != null)
		assertSafeNonnegativeInteger(proposal.scores_updated, 'proposal score timestamp')
	if (proposal.votes != null)
		assertSafeNonnegativeInteger(proposal.votes, 'proposal vote count')
}

const assertVote = (
	vote: SnapshotHubVote
) => {
	assertMessageIdentity(vote.id, 'vote ID')
	assertOpaqueIdentity(vote.voter, 'voter identity')
	assertSafeNonnegativeInteger(vote.created, 'vote timestamp')
	assertOpaqueIdentity(vote.space.id, 'vote space ID')
	if (vote.proposal == null)
		throw new Error('SnapshotHub_Graphql: vote proposal is missing')
	assertMessageIdentity(vote.proposal.id, 'vote proposal ID')
	if (
		vote.proposal.space == null
		|| vote.proposal.space.id !== vote.space.id
	)
		throw new Error('SnapshotHub_Graphql: vote space and proposal space disagree')
	if (vote.vp != null)
		assertFiniteNonnegativeNumber(vote.vp, 'vote voting power')
	if (vote.vp_by_strategy != null) {
		for (const votingPower of vote.vp_by_strategy)
			assertFiniteNonnegativeNumber(votingPower, 'strategy voting power')
		if (
			vote.vp_by_strategy.length !== 0
			&& vote.vp_by_strategy.length !== vote.proposal.strategies.length
		)
			throw new Error('SnapshotHub_Graphql: voting power does not align with strategies')
	}
}

const page = <_Value>(
	items: _Value[],
	limit: number,
	offset: number
): SnapshotHubPage<_Value> => ({
	items,
	...(items.length === limit && {
		nextOffset: offset + limit,
	}),
})

export const getSpace = async ({
	binding,
	spaceId,
}: {
	binding: SourceBinding
	spaceId: string
}) => {
	assertOpaqueIdentity(spaceId, 'requested space ID')
	const { space } = await graphql<{
		space: SnapshotHubSpace | null
	}>({
		binding,
		query: `query Space($id: String!) {
			space(id: $id) {
				${spaceFields}
			}
		}`,
		variables: {
			id: spaceId,
		},
	})
	if (space == null)
		return observation(null)
	assertSpace(space)
	if (space.id !== spaceId)
		throw new Error('SnapshotHub_Graphql: returned a foreign space')
	return observation(space)
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
	const { spaces } = await graphql<{
		spaces: SnapshotHubSpace[]
	}>({
		binding,
		query: `query Spaces($first: Int!, $skip: Int!) {
			spaces(
				first: $first
				skip: $skip
				orderBy: "created"
				orderDirection: desc
			) {
				${spaceFields}
			}
		}`,
		variables: {
			first: limit,
			skip: offset,
		},
	})
	if (spaces.length > limit)
		throw new Error('SnapshotHub_Graphql: space page exceeds requested limit')
	const spaceIds = new Set<string>()
	for (const space of spaces) {
		assertSpace(space)
		if (spaceIds.has(space.id))
			throw new Error('SnapshotHub_Graphql: duplicate space in page')
		spaceIds.add(space.id)
	}
	return observation(page(
		spaces,
		limit,
		offset
	))
}

export const getProposal = async ({
	binding,
	proposalId,
}: {
	binding: SourceBinding
	proposalId: string
}) => {
	assertMessageIdentity(proposalId, 'requested proposal ID')
	const { proposal } = await graphql<{
		proposal: SnapshotHubProposal | null
	}>({
		binding,
		query: `query Proposal($id: String!) {
			proposal(id: $id) {
				${proposalFields}
			}
		}`,
		variables: {
			id: proposalId,
		},
	})
	if (proposal == null)
		return observation(null)
	assertProposal(proposal)
	if (proposal.id !== proposalId)
		throw new Error('SnapshotHub_Graphql: returned a foreign proposal')
	return observation(proposal)
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
	const { proposals } = await graphql<{
		proposals: SnapshotHubProposal[]
	}>({
		binding,
		query: `query Proposals(
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
				${proposalFields}
			}
		}`,
		variables: {
			first: limit,
			skip: offset,
			where: {
				space: spaceId,
				...(state != null && {
					state,
				}),
			},
		},
	})
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
	return observation(page(
		proposals,
		limit,
		offset
	))
}

export const getVote = async ({
	binding,
	voteId,
}: {
	binding: SourceBinding
	voteId: string
}) => {
	assertMessageIdentity(voteId, 'requested vote ID')
	const { vote } = await graphql<{
		vote: SnapshotHubVote | null
	}>({
		binding,
		query: `query Vote($id: String!) {
			vote(id: $id) {
				${voteFields}
			}
		}`,
		variables: {
			id: voteId,
		},
	})
	if (vote == null)
		return observation(null)
	assertVote(vote)
	if (vote.id !== voteId)
		throw new Error('SnapshotHub_Graphql: returned a foreign vote')
	return observation(vote)
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
	const { votes } = await graphql<{
		votes: SnapshotHubVote[]
	}>({
		binding,
		query: `query Votes(
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
				${voteFields}
			}
		}`,
		variables: {
			first: limit,
			skip: offset,
			where: {
				proposal: proposalId,
			},
		},
	})
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
	return observation(page(
		votes,
		limit,
		offset
	))
}
