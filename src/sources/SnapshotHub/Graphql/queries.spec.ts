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

const binding = bindings[Source.SnapshotHub_Graphql][0]

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
		type: 'weighted',
		choices: proposal.choices,
		start: proposal.start,
		end: proposal.end,
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
		100.123,
		23.333,
	],
	vp_state: 'final',
	vp_value: 123.456,
	metadata: {
		votingSystem: 'weighted',
	},
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
			expect.objectContaining({
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
				},
			})
		)
		expect(JSON.parse(String(sourceFetch.mock.calls[0]?.[2]?.body))).toEqual({
			query: expect.stringContaining('query SnapshotHubSpace($id: String!)'),
			variables: {
				id: spaceId,
			},
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			binding.endpoints[0].locator,
			expect.objectContaining({
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
				},
			})
		)
		expect(JSON.parse(String(sourceFetch.mock.calls[1]?.[2]?.body))).toEqual({
			query: expect.stringContaining('query SnapshotHubSpaces('),
			variables: {
				first: 1,
				skip: 40,
			},
		})
	})

	it('rejects duplicate space account identities within one role', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			space: {
				...space,
				admins: [
					author,
					author,
				],
			},
		}))

		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('space contains duplicate account identity')
	})

	it('rejects duplicate space treasuries', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			space: {
				...space,
				treasuries: [
					{
						name: 'ENS DAO',
						address: author,
						network: '1',
					},
					{
						name: 'ENS DAO 2',
						address: author,
						network: '1',
					},
				],
			},
		}))

		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('space contains duplicate treasury')
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

	it('rejects vote choices that exceed or contradict proposal choice authority', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					choice: {
						'4': 1,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					choice: {
						'01': 1,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					created: proposal.end + 1,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					choice: {
						'1': -1,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					proposal: {
						...vote.proposal,
						type: 'approval',
					},
					choice: [
						1,
						1,
					],
				},
			}))

		await expect(getVote({ voteId })).rejects.toThrow('does not match proposal choices')
		await expect(getVote({ voteId })).rejects.toThrow('invalid vote choice weights')
		await expect(getVote({ voteId })).rejects.toThrow('outside the proposal lifecycle')
		await expect(getVote({ voteId })).rejects.toThrow('invalid vote choice weights')
		await expect(getVote({ voteId })).rejects.toThrow('does not match proposal choices')
	})

	it('rejects a proposal score clock that predates the proposal creation', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch.mockResolvedValueOnce(jsonResponse({
			proposal: {
				...proposal,
				scores_updated: proposal.created - 1,
			},
		}))

		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('proposal score clock')
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

	it('hard-fails GraphQL HTTP errors and GraphQL error payloads', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(new Response('upstream unavailable', {
				status: 502,
				statusText: 'Bad Gateway',
				headers: {
					'content-type': 'text/plain',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				errors: [
					{
						message: 'rate limited',
					},
				],
			}), {
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(Response.json({}))

		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('502')
		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('rate limited')
		await expect(getVote({
			voteId,
		})).rejects.toThrow('response is missing data')
	})

	it('fails closed on arktype envelopes for malformed space, proposal, and vote wires', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				space: {
					...space,
					created: -1,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					quorum: Number.NaN,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				vote: {
					...vote,
					vp: -1,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				spaces: [
					{
						...space,
						id: '',
					},
				],
			}))

		await expect(getSpace({
			spaceId,
		})).rejects.toThrow('invalid space data envelope')
		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('invalid proposal data envelope')
		await expect(getVote({
			voteId,
		})).rejects.toThrow('invalid vote data envelope')
		await expect(getSpacesPage({
			limit: 1,
			offset: 0,
		})).rejects.toThrow('invalid spaces page envelope')
	})
})
