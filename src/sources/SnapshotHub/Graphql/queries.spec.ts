import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/SnapshotHub/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { maximumSnapshotHubGraphqlResponseBytes } from '$/sources/SnapshotHub/Graphql/client.ts'
import {
	getProposal,
	getProposalsPage,
	getSpace,
	getSpacesPage,
	getVote,
	getVotesPage,
} from '$/sources/SnapshotHub/Graphql/queries.ts'
import * as runtimeHttp from '$/sources/_runtime/http.ts'

const binding = bindings[Source.SnapshotHub_Graphql]

const spaceId = 'ens.eth'
const proposalId = `0x${'1'.repeat(64)}`
const voteId = `0x${'2'.repeat(64)}`
const author = `0x${'3'.repeat(40)}`
const voter = `0x${'4'.repeat(40)}`

const strategies = [
	{
		name: 'delegation',
		network: '1',
		params: {
			symbol: 'ENS delegated',
		},
	},
	{
		name: 'erc20-votes',
		network: '1',
		params: {
			address: `0x${'5'.repeat(40)}`,
			decimals: 18,
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
			50_000.25,
			50_000,
		],
		[
			2,
			3,
		],
		[
			4,
			6,
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
		100.123,
		23.333,
	],
	vp_state: 'final',
}

const jsonResponse = (data: object) => (
	new Response(JSON.stringify({
		data,
	}), {
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('Snapshot Hub public governance reads', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns exact space strategies and offset pagination from the endpoint', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				space,
			}))
			.mockResolvedValueOnce(jsonResponse({
				spaces: [
					space,
				],
			}))

		await expect(getSpace({
			spaceId,
		})).resolves.toMatchObject({
			id: spaceId,
			strategies,
		})
		await expect(getSpacesPage({
			limit: 1,
			offset: 40,
		})).resolves.toEqual([
			space,
		])
		expect(sourceFetch).toHaveBeenNthCalledWith(
			1,
			binding,
			binding.endpoints[0].locator,
			expect.any(Object)
		)
	})

	it.each([
		{
			state: 'pending' as const,
			scores: [],
			scores_by_strategy: [],
		},
		{
			state: 'active' as const,
			scores: proposal.scores,
			scores_by_strategy: proposal.scores_by_strategy,
		},
		{
			state: 'closed' as const,
			scores: proposal.scores,
			scores_by_strategy: proposal.scores_by_strategy,
		},
	])('preserves $state lifecycle, snapshot block, quorum, and choice-major scores', async ({
		state,
		scores,
		scores_by_strategy,
	}) => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposal: {
				...proposal,
				state,
				scores,
				scores_by_strategy,
			},
		}))

		await expect(getProposal({
			proposalId,
		})).resolves.toMatchObject({
			id: proposalId,
			state,
			snapshot: 19_000_000,
			quorum: 100_000.25,
			quorumType: 'default',
			scores,
			scores_by_strategy,
		})
	})

	it('pages proposals by the Hub state predicate without widening the space subject', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposals: [
				proposal,
			],
		}))

		await expect(getProposalsPage({
			spaceId,
			state: 'closed',
			limit: 1,
			offset: 8,
		})).resolves.toEqual([
			proposal,
		])
		expect(JSON.parse(
			String(sourceFetch.mock.calls[0]?.[2]?.body)
		)).toMatchObject({
			variables: {
				first: 1,
				skip: 8,
				where: {
					space: spaceId,
					state: 'closed',
				},
			},
		})
	})

	it('keeps vote identity, weighted choice, decimal power, and strategy alignment exact', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch')
			.mockResolvedValueOnce(jsonResponse({
				vote,
			}))
			.mockResolvedValueOnce(jsonResponse({
				votes: [
					vote,
				],
			}))

		await expect(getVote({
			voteId,
		})).resolves.toMatchObject({
			id: voteId,
			voter,
			choice: vote.choice,
			vp: 123.456,
			vp_by_strategy: [
				100.123,
				23.333,
			],
		})
		await expect(getVotesPage({
			proposalId,
			limit: 1,
			offset: 0,
		})).resolves.toEqual([
			vote,
		])
	})

	it('rejects foreign spaces, proposals, votes, and invalid requested identities', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				space: {
					...space,
					id: 'foreign.eth',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposals: [{
					...proposal,
					space: {
						id: 'foreign.eth',
					},
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				votes: [{
					...vote,
					proposal: {
						...vote.proposal,
						id: `0x${'9'.repeat(64)}`,
					},
				}],
			}))

		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('foreign space')
		await expect(getProposalsPage({
			spaceId,
			state: 'closed',
			limit: 10,
			offset: 0,
		})).rejects.toThrow('foreign space')
		await expect(getVotesPage({
			proposalId,
			limit: 10,
			offset: 0,
		})).rejects.toThrow('foreign proposal')
		await expect(getProposal({
			proposalId: 'not-a-proposal',
		})).rejects.toThrow('invalid requested proposal ID')
		expect(sourceFetch).toHaveBeenCalledTimes(3)
	})

	it('rejects reversed lifecycle and misaligned choice, strategy, and vote score vectors', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					start: proposal.end + 1,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					scores_by_strategy: [
						[
							1,
						],
						[
							2,
						],
						[
							3,
						],
					],
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					vp_by_strategy: [
						1,
					],
				},
			}))

		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('invalid proposal lifecycle')
		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('do not align with strategies')
		await expect(getVote({
			voteId,
		})).rejects.toThrow('does not align with strategies')
	})

	it('enforces page bounds and the raw GraphQL response byte cap', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')

		await expect(getSpacesPage({
			limit: 101,
			offset: 0,
		})).rejects.toThrow('limit must be from 1 through 100')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValue(new Response(
			'x'.repeat(maximumSnapshotHubGraphqlResponseBytes + 1),
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		))
		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('response exceeds byte limit')
	})
})
