import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
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
	network: '1',
	symbol: 'ENS',
	strategies,
	admins: [
		author,
	],
	members: [],
	categories: [
		'protocol',
	],
	proposalsCount: 1,
	votesCount: 1,
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
	choices: [
		'For',
		'Against',
		'Abstain',
	],
	start: 1_700_000_100,
	end: 1_700_100_000,
	quorum: 100_000.25,
	quorumType: 'default',
	snapshot: 19_000_000,
	state: 'closed' as const,
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
	vp: 123.456,
	vp_by_strategy: [
		123.456,
	],
	vp_state: 'final',
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

	it('registers under SnapshotHub_Graphql pending APP entity wiring', () => {
		expect(snapshotHubGraphql.source).toBe(Source.SnapshotHub_Graphql)
		expect(snapshotHubGraphql.resolvers).toEqual([])
	})

	it('projects space identity, EVM network, strategies, and admin accounts', () => {
		expect(snapshotSpaceFields(space)).toMatchObject({
			[EntityMetaKey.Selector]: {
				spaceId,
			},
			spaceId,
			name: 'ENS',
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
			state: 'closed',
			snapshotBlock: 19_000_000,
			quorum: 100_000.25,
			scoresTotal: 100_015.25,
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
			votingPower: 123.456,
			votingPowerByStrategy: [
				123.456,
			],
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
		await expect(resolveSnapshotSpaces(context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					spaceId,
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
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					proposalId,
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
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					voteId,
				},
			},
		])
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
