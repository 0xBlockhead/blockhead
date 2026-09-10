import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getProposal,
	getProposalsPage,
	getSpace,
	getSpacesPage,
	getVote,
	getVotesPage,
} = vi.hoisted(() => ({
	getProposal: vi.fn(),
	getProposalsPage: vi.fn(),
	getSpace: vi.fn(),
	getSpacesPage: vi.fn(),
	getVote: vi.fn(),
	getVotesPage: vi.fn(),
}))

vi.mock('$/sources/SnapshotHub/Graphql/queries.ts', () => ({
	getProposal,
	getProposalsPage,
	getSpace,
	getSpacesPage,
	getVote,
	getVotesPage,
}))

const {
	default: snapshotHubGraphql,
	resolveSnapshotProposal,
	resolveSnapshotProposals,
	resolveSnapshotSpace,
	resolveSnapshotSpaces,
	resolveSnapshotVote,
	resolveSnapshotVotes,
	snapshotProposalFields,
	snapshotSpaceFields,
	snapshotVoteFields,
} = await import('$/resolvers/SnapshotHub-Graphql.ts')

const spaceId = 'ens.eth'
const proposalId = `0x${'1'.repeat(64)}`
const voteId = `0x${'2'.repeat(64)}`
const author = `0x${'A'.repeat(40)}`
const voter = `0x${'B'.repeat(40)}`
const network = {
	caip2: {
		namespace: 'eip155' as const,
		reference: '1',
	},
}

const strategies = [
	{
		name: 'delegation',
		network: '1',
		params: {
			symbol: 'ENS delegated',
		},
	},
]

const space = {
	id: spaceId,
	name: 'ENS',
	about: 'ENS governance',
	avatar: 'ipfs://avatar',
	cover: 'ipfs://cover',
	website: 'https://ens.domains',
	twitter: 'ensdomains',
	github: 'ensdomains',
	farcaster: 'ensdomains',
	coingecko: 'ethereum-name-service',
	discussions: 'https://discuss.ens.domains',
	terms: 'https://ens.domains/terms',
	location: 'Ethereum',
	domain: 'vote.ens.domains',
	private: false,
	network: '1',
	symbol: 'ENS',
	strategies,
	admins: [
		author,
	],
	members: [],
	moderators: [
		author,
	],
		categories: [
			'protocol',
		],
		delegationPortal: {
			delegationType: 'compound-governor',
			delegationContract: author,
			delegationNetwork: '1',
			delegationApi: 'https://api.snapshot.org',
		},
		treasuries: [
			{
				name: 'ENS DAO',
				address: author,
				network: '1',
			},
		],
		proposalsCount: 1,
	votesCount: 1,
	followersCount: 42,
	created: 1_700_000_000,
}

const proposal = {
	id: proposalId,
	ipfs: null,
	author,
	created: 1_700_000_000,
	updated: null,
	space: {
		id: spaceId,
	},
	network: '1',
	symbol: 'ENS',
	type: 'basic',
	strategies,
	title: 'Fund public goods',
	body: 'Proposal body',
	discussion: 'https://discuss.ens.domains/t/fund-public-goods',
	choices: [
		'For',
		'Against',
		'Abstain',
	],
	labels: [
		'treasury',
	],
	start: 1_700_000_100,
	end: 1_700_100_000,
	quorum: 100_000.25,
	quorumType: 'default',
	privacy: null,
	snapshot: 19_000_000,
	state: 'closed' as const,
	link: 'https://snapshot.org/#/ens.eth/proposal/0x1',
	app: 'snapshot',
	scores: [
		100_000.25,
		5,
		10,
	],
	scores_by_strategy: [
		[
			100_000.25,
		],
		[
			5,
		],
		[
			10,
		],
	],
	scores_state: 'final',
	scores_total: 100_015.25,
	scores_total_value: 100_015.25,
	scores_updated: 1_700_100_001,
	votes: 3,
}

const vote = {
	id: voteId,
	ipfs: null,
	voter,
	created: 1_700_050_000,
	space: {
		id: spaceId,
	},
	proposal: {
		id: proposalId,
		space: {
			id: spaceId,
		},
		strategies: strategies.map(({ name }) => ({
			name,
		})),
	},
	choice: {
		'1': 75.5,
		'2': 24.5,
	},
	reason: 'Weighted preference',
	app: 'snapshot',
	vp: 123.456,
	vp_by_strategy: [
		123.456,
	],
	vp_state: 'final',
	vp_value: 123.456,
	metadata: {
		votingSystem: 'weighted',
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
		offset: 4,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('SnapshotHub GraphQL resolvers', () => {
	beforeEach(() => {
		getProposal.mockReset()
		getProposalsPage.mockReset()
		getSpace.mockReset()
		getSpacesPage.mockReset()
		getVote.mockReset()
		getVotesPage.mockReset()
	})

	it('registers Snapshot space, proposal, and vote resolver facets that project enrolled fields', () => {
		expect(snapshotHubGraphql.source).toBe(Source.SnapshotHub_Graphql)
		expect(snapshotHubGraphql.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType._Global,
			EntityType.SnapshotSpace,
			EntityType.SnapshotSpace,
			EntityType.SnapshotSpace,
			EntityType.SnapshotProposal,
			EntityType.SnapshotProposal,
			EntityType.SnapshotProposal,
			EntityType.SnapshotVote,
		])
		const spaceResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotSpace
			&& 'spaceId' in resolver.projections
		))
		const globalResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType._Global
		))
		const proposalResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotProposal
			&& 'title' in resolver.projections
		))
		const proposalVotesResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotProposal
			&& '$$votes' in resolver.projections
		))
		const voteResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotVote
		))
		expect(spaceResolver?.projections.spaceId({ spaceId, name: 'ENS' })).toBe(spaceId)
		expect(spaceResolver?.projections.name({ spaceId, name: 'ENS' })).toBe('ENS')
		expect(globalResolver?.projections.$$snapshotSpaces.select({
			$$snapshotSpaces: [{ [EntityMetaKey.Selector]: { spaceId } }],
		})).toEqual([{ [EntityMetaKey.Selector]: { spaceId } }])
		expect(proposalResolver?.projections.title({ proposalId, title: 'Upgrade' })).toBe('Upgrade')
		expect(proposalVotesResolver?.resolve).toHaveProperty('ProposalId')
		expect(voteResolver?.resolve).toHaveProperty('VoteId')
	})

	it('projects space identity, EVM network, strategies, and admin accounts', () => {
		expect(snapshotSpaceFields(space)).toMatchObject({
			[EntityMetaKey.Selector]: {
				spaceId,
			},
			spaceId,
			name: 'ENS',
			$avatar: {
				[EntityMetaKey.Selector]: {
					url: 'https://ipfs.io/ipfs/avatar',
				},
			},
			cover: 'ipfs://cover',
			website: 'https://ens.domains',
			twitter: 'ensdomains',
			followersCount: 42,
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			strategies,
			$$admins: [
				{
					[EntityMetaKey.Selector]: {
						$network: network,
						$actor: {
							address: author.toLowerCase(),
						},
					},
				},
			],
			$$moderators: [
				{
					[EntityMetaKey.Selector]: {
						$network: network,
						$actor: {
							address: author.toLowerCase(),
						},
					},
				},
			],
			delegationType: 'compound-governor',
			delegationContract: author,
			delegationNetwork: '1',
			delegationApi: 'https://api.snapshot.org',
			treasuries: [
				{
					name: 'ENS DAO',
					address: author,
					network: '1',
				},
			],
			createdAtMs: 1_700_000_000_000,
		})
	})

	it('projects proposal lifecycle, quorum, scores, and author account', () => {
		expect(snapshotProposalFields(proposal)).toMatchObject({
			[EntityMetaKey.Selector]: {
				proposalId,
			},
			$space: {
				[EntityMetaKey.Selector]: {
					spaceId,
				},
			},
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			$authorAccount: {
				[EntityMetaKey.Selector]: {
					$network: network,
					$actor: {
						address: author.toLowerCase(),
					},
				},
			},
			discussion: proposal.discussion,
			labels: [
				'treasury',
			],
			link: proposal.link,
			app: 'snapshot',
			state: 'closed',
			snapshotBlock: 19_000_000,
			quorum: 100_000.25,
			quorumType: 'default',
			strategies,
			scoresByStrategy: proposal.scores_by_strategy,
			scoresState: 'final',
			scoresTotal: 100_015.25,
			scoresTotalValue: 100_015.25,
			startAtMs: 1_700_000_100_000,
			endAtMs: 1_700_100_000_000,
		})
	})

	it('projects vote choice, decimal voting power, and parent refs', () => {
		expect(snapshotVoteFields(vote)).toMatchObject({
			[EntityMetaKey.Selector]: {
				voteId,
			},
			$space: {
				[EntityMetaKey.Selector]: {
					spaceId,
				},
			},
			$proposal: {
				[EntityMetaKey.Selector]: {
					proposalId,
				},
			},
			choice: vote.choice,
			app: 'snapshot',
			votingPower: 123.456,
			votingPowerByStrategy: [
				123.456,
			],
			votingPowerValue: 123.456,
			metadata: {
				votingSystem: 'weighted',
			},
			createdAtMs: 1_700_050_000_000,
		})
	})

	it('resolves spaces and proposals into schema-shaped selectors with pagination', async () => {
		getSpace.mockResolvedValueOnce(space)
		getSpacesPage.mockResolvedValueOnce([
			space,
		])
		getProposal.mockResolvedValueOnce(proposal)
		getProposalsPage.mockResolvedValueOnce([
			proposal,
		])

		await expect(resolveSnapshotSpace({
			spaceId,
		})).resolves.toMatchObject({
			spaceId,
			name: 'ENS',
		})
		await expect(resolveSnapshotSpaces(context)).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					spaceId,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'name')]: 'ENS',
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'proposalsCount')]: 1,
					[entityFieldAddressKey(EntityType.SnapshotSpace, [], 'createdAtMs')]: 1_700_000_000_000,
				},
			},
		])
		expect(getSpacesPage).toHaveBeenCalledWith({
			limit: 2,
			offset: 4,
		})
		await expect(resolveSnapshotProposal({
			proposalId,
		})).resolves.toMatchObject({
			proposalId,
			state: 'closed',
		})
		await expect(resolveSnapshotProposals({
			spaceId,
			state: 'closed',
		}, context)).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					proposalId,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'title')]: 'Fund public goods',
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'state')]: 'closed',
					[entityFieldAddressKey(EntityType.SnapshotProposal, [], 'createdAtMs')]: 1_700_000_000_000,
				},
			},
		])
		expect(getProposalsPage).toHaveBeenCalledWith({
			spaceId,
			state: 'closed',
			limit: 2,
			offset: 4,
		})
	})

	it('resolves votes into schema-shaped selectors', async () => {
		getVote.mockResolvedValueOnce(vote)
		getVotesPage.mockResolvedValueOnce([
			vote,
		])

		await expect(resolveSnapshotVote({
			voteId,
		})).resolves.toMatchObject({
			voteId,
			votingPower: 123.456,
		})
		await expect(resolveSnapshotVotes({
			proposalId,
		}, context)).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					voteId,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'voter')]: voter,
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'choice')]: vote.choice,
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'createdAtMs')]: 1_700_050_000_000,
				},
			},
		])
	})

	it('registers vote detail without interpreting opaque choice or metadata scalars', async () => {
		const voteResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotVote
			&& 'VoteId' in resolver.resolve
		))
		if (voteResolver == null || !('VoteId' in voteResolver.resolve))
			throw new Error('SnapshotHub_Graphql spec missing SnapshotVote.VoteId resolver')

		getVote.mockResolvedValueOnce(vote)
		const snapshot = await voteResolver.resolve.VoteId.resolve({ voteId })

		expect(voteResolver.projections.choice(snapshot)).toBe(vote.choice)
		expect(voteResolver.projections.metadata(snapshot)).toBe(vote.metadata)
		expect(snapshot).toMatchObject({
			voteId,
			voter,
			votingPower: 123.456,
			createdAtMs: 1_700_050_000_000,
		})
	})

	it('registers proposal vote pagination with an opaque offset continuation', async () => {
		const proposalVotesResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotProposal
			&& 'ProposalId' in resolver.resolve
			&& '$$votes' in resolver.projections
		))
		if (proposalVotesResolver == null || !('ProposalId' in proposalVotesResolver.resolve))
			throw new Error('SnapshotHub_Graphql spec missing SnapshotProposal.$$votes resolver')

		getVotesPage.mockResolvedValueOnce([
			vote,
			{
				...vote,
				id: `0x${'3'.repeat(64)}`,
			},
		])
		const page = await proposalVotesResolver.resolve.ProposalId.resolve({
			proposalId,
		}, {
			...context,
			pagination: { limit: 2 },
			providerContinuationToken: '6',
		})

		expect(getVotesPage).toHaveBeenCalledWith({
			proposalId,
			limit: 2,
			offset: 6,
		})
		expect(proposalVotesResolver.projections.$$votes.select(page)).toMatchObject([
			{
				[EntityMetaKey.Selector]: { voteId },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'voter')]: voter,
				},
			},
			{
				[EntityMetaKey.Selector]: { voteId: `0x${'3'.repeat(64)}` },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SnapshotVote, [], 'voter')]: voter,
				},
			},
		])
		expect(proposalVotesResolver.projections.$$votes.continuation(page)).toEqual({
			operation: 'votes',
			target: 'snapshot-hub',
			terminal: false,
			token: '8',
		})

		getVotesPage.mockResolvedValueOnce([
			vote,
		])
		const terminalPage = await proposalVotesResolver.resolve.ProposalId.resolve({
			proposalId,
		}, {
			...context,
			pagination: { limit: 2 },
			providerContinuationToken: '8',
		})
		expect(proposalVotesResolver.projections.$$votes.continuation(terminalPage)).toEqual({
			operation: 'votes',
			target: 'snapshot-hub',
			terminal: true,
		})
	})

	it('resolves proposal and vote counts independently from their pages', async () => {
		const spaceProposalCountResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotSpace
			&& '$$proposals' in resolver.projections
			&& typeof resolver.projections.$$proposals === 'object'
			&& resolver.projections.$$proposals != null
			&& 'resolveCount' in resolver.projections.$$proposals
		))
		const proposalVoteCountResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotProposal
			&& '$$votes' in resolver.projections
			&& typeof resolver.projections.$$votes === 'object'
			&& resolver.projections.$$votes != null
			&& 'resolveCount' in resolver.projections.$$votes
		))
		if (
			spaceProposalCountResolver == null
			|| !('SpaceId' in spaceProposalCountResolver.resolve)
			|| proposalVoteCountResolver == null
			|| !('ProposalId' in proposalVoteCountResolver.resolve)
		)
			throw new Error('SnapshotHub_Graphql count resolvers are missing')

		getSpace.mockResolvedValueOnce(space)
		getProposal.mockResolvedValueOnce(proposal)
		const proposalCount = await spaceProposalCountResolver.resolve.SpaceId.resolve({ spaceId })
		const voteCount = await proposalVoteCountResolver.resolve.ProposalId.resolve({ proposalId })

		expect(spaceProposalCountResolver.projections.$$proposals.resolveCount(proposalCount)).toBe(1)
		expect(proposalVoteCountResolver.projections.$$votes.resolveCount(voteCount)).toBe(3)
		expect(getProposalsPage).not.toHaveBeenCalled()
		expect(getVotesPage).not.toHaveBeenCalled()
	})

	it('continues Snapshot space and proposal entry lists with opaque offsets', async () => {
		const spacesResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType._Global
			&& 'Scope' in resolver.resolve
			&& '$$snapshotSpaces' in resolver.projections
		))
		const proposalsResolver = snapshotHubGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.SnapshotSpace
			&& 'SpaceId' in resolver.resolve
			&& '$$proposals' in resolver.projections
		))
		if (spacesResolver == null || !('Scope' in spacesResolver.resolve))
			throw new Error('SnapshotHub_Graphql spec missing global Snapshot spaces resolver')
		if (proposalsResolver == null || !('SpaceId' in proposalsResolver.resolve))
			throw new Error('SnapshotHub_Graphql spec missing Snapshot space proposals resolver')

		await expect(spacesResolver.resolve.Scope.resolve({}, {
			...context,
			providerContinuationToken: '1e2',
		})).rejects.toThrow('invalid spaces continuation')

		getSpacesPage.mockResolvedValueOnce([
			space,
			{
				...space,
				id: 'ethdao.eth',
			},
		])
		const spacesPage = await spacesResolver.resolve.Scope.resolve({}, {
			...context,
			pagination: { limit: 2 },
			providerContinuationToken: '6',
		})
		expect(getSpacesPage).toHaveBeenCalledWith({
			limit: 2,
			offset: 6,
		})
		expect(spacesResolver.projections.$$snapshotSpaces.continuation(spacesPage)).toEqual({
			operation: 'spaces',
			target: 'snapshot-hub',
			terminal: false,
			token: '8',
		})

		getProposalsPage.mockResolvedValueOnce([
			proposal,
			{
				...proposal,
				id: `0x${'3'.repeat(64)}`,
			},
		])
		const proposalsPage = await proposalsResolver.resolve.SpaceId.resolve({ spaceId }, {
			...context,
			pagination: { limit: 2 },
			providerContinuationToken: '8',
		})
		expect(getProposalsPage).toHaveBeenCalledWith({
			spaceId,
			limit: 2,
			offset: 8,
		})
		expect(proposalsResolver.projections.$$proposals.continuation(proposalsPage)).toEqual({
			operation: 'proposals',
			target: 'snapshot-hub',
			terminal: false,
			token: '10',
		})
	})

	it('hard-fails missing entities and upstream HTTP errors instead of soft-empty', async () => {
		getSpace.mockResolvedValueOnce(null)
		getProposal.mockRejectedValueOnce(new Error('SnapshotHub_Graphql GraphQL: 502 Bad Gateway'))
		getVote.mockResolvedValueOnce(null)

		await expect(resolveSnapshotSpace({
			spaceId,
		})).rejects.toThrow('space not found')
		await expect(resolveSnapshotProposal({
			proposalId,
		})).rejects.toThrow('502')
		await expect(resolveSnapshotVote({
			voteId,
		})).rejects.toThrow('vote not found')
	})
})
