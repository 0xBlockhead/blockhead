import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Tally/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { maximumTallyGraphqlResponseBytes } from '$/sources/Tally/Graphql/client.ts'
import {
	getGovernor,
	getGovernorsPage,
	getProposal,
	getProposalsPage,
} from '$/sources/Tally/Graphql/queries.ts'
import * as runtimeHttp from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Tally][0]

const governorId = 'eip155:1:0x7e90e03654732abedf89Faf87f05BcD03ACEeFdc'
const organizationId = '2207450143689540900'
const proposalId = '2207450143689540901'
const proposer = '0x1234567800000000000000000000000000000abc'

const governor = {
	id: governorId,
	chainId: 'eip155:1',
	name: 'Uniswap',
	slug: 'uniswap',
	type: 'governorbravo',
	kind: 'single',
	quorum: '10987654321',
	timelockId: 'eip155:1:0x1a9C8182C09F50C8318d769245beA52c32BE546D',
	tokenId: 'eip155:1/erc20:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
	delegatesCount: 12,
	delegatesVotesCount: '10987654321',
	tokenOwnersCount: 100,
	isPrimary: true,
	organization: {
		id: organizationId,
		slug: 'uniswap',
		name: 'Uniswap',
	},
	proposalStats: {
		total: 10,
		active: 1,
		failed: 2,
		passed: 7,
	},
	parameters: {
		quorumVotes: '40000000000000000000000000',
		proposalThreshold: '2500000000000000000000000',
		votingDelay: '13140',
		votingPeriod: '40320',
		gracePeriod: null,
		clockMode: 'blocknumber',
		countingMode: 'support=bravo',
	},
	contracts: {
		governor: {
			address: '0x7e90e03654732abedf89Faf87f05BcD03ACEeFdc',
		},
	},
	metadata: {
		description: 'Uniswap governance',
	},
}

const proposal = {
	id: proposalId,
	onchainId: '42',
	chainId: 'eip155:1',
	status: 'active' as const,
	quorum: '10987654321',
	metadata: {
		title: 'Fund public goods',
		description: 'Proposal body',
		eta: null,
		ipfsHash: null,
		txHash: null,
		discourseURL: null,
		snapshotURL: null,
	},
	governor: {
		id: governorId,
		chainId: 'eip155:1',
		name: 'Uniswap',
		slug: 'uniswap',
	},
	organization: {
		id: organizationId,
		slug: 'uniswap',
		name: 'Uniswap',
	},
	proposer: {
		address: proposer,
		ens: null,
		name: null,
	},
	start: {
		timestamp: '1700000100',
	},
	end: {
		timestamp: '1700100000',
	},
	voteStats: [
		{
			type: 'for',
			votesCount: '100000',
			votersCount: 3,
			percent: 80,
		},
		{
			type: 'against',
			votesCount: '20000',
			votersCount: 1,
			percent: 16,
		},
		{
			type: 'abstain',
			votesCount: '5000',
			votersCount: 1,
			percent: 4,
		},
	],
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

describe('Tally onchain governance reads', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns governor identity, parameters, and organization scope from the endpoint', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			governor,
		}))

		await expect(getGovernor({
			governorId,
		})).resolves.toMatchObject({
			id: governorId,
			name: 'Uniswap',
			proposalStats: governor.proposalStats,
			parameters: governor.parameters,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			binding.endpoints[0].locator,
			expect.objectContaining({
				method: 'POST',
			})
		)
		expect(JSON.parse(
			String(sourceFetch.mock.calls[0]?.[2]?.body)
		)).toMatchObject({
			variables: {
				input: {
					id: governorId,
				},
			},
		})
	})

	it('pages governors by organization without widening the subject', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			governors: {
				nodes: [
					governor,
				],
				pageInfo: {
					firstCursor: 'a',
					lastCursor: 'a',
					count: 1,
				},
			},
		}))

		await expect(getGovernorsPage({
			organizationId,
			limit: 1,
			afterCursor: 'prev',
		})).resolves.toEqual({
			nodes: [
				governor,
			],
			pageInfo: {
				firstCursor: 'a',
				lastCursor: 'a',
				count: 1,
			},
		})
		expect(JSON.parse(
			String(sourceFetch.mock.calls[0]?.[2]?.body)
		)).toMatchObject({
			variables: {
				input: {
					filters: {
						organizationId,
						includeInactive: false,
					},
					page: {
						limit: 1,
						afterCursor: 'prev',
					},
				},
			},
		})
	})

	it('preserves proposal lifecycle, vote stats, and governor binding', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposal,
		}))

		await expect(getProposal({
			proposalId,
		})).resolves.toMatchObject({
			id: proposalId,
			status: 'active',
			voteStats: proposal.voteStats,
			governor: {
				id: governorId,
			},
		})
	})

	it('pages proposals by governor without widening the subject', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposals: {
				nodes: [
					proposal,
				],
				pageInfo: {
					firstCursor: null,
					lastCursor: null,
					count: 1,
				},
			},
		}))

		await expect(getProposalsPage({
			governorId,
			limit: 1,
		})).resolves.toEqual({
			nodes: [
				proposal,
			],
			pageInfo: {
				firstCursor: null,
				lastCursor: null,
				count: 1,
			},
		})
		expect(JSON.parse(
			String(sourceFetch.mock.calls[0]?.[2]?.body)
		)).toMatchObject({
			variables: {
				input: {
					filters: {
						governorId,
					},
					page: {
						limit: 1,
					},
				},
			},
		})
	})

	it('hard-fails foreign rows, invalid identities, GraphQL errors, and oversized responses', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				governor: {
					...governor,
					id: 'eip155:1:0x0000000000000000000000000000000000000001',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				governors: {
					nodes: [{
						...governor,
						organization: {
							...governor.organization,
							id: '1',
						},
					}],
					pageInfo: {
						firstCursor: null,
						lastCursor: null,
						count: 1,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposals: {
					nodes: [{
						...proposal,
						governor: {
							...proposal.governor,
							id: 'eip155:1:0x0000000000000000000000000000000000000001',
						},
					}],
					pageInfo: {
						firstCursor: null,
						lastCursor: null,
						count: 1,
					},
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				errors: [{
					message: 'unauthorized',
				}],
			}), {
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					governor,
				},
			}), {
				headers: {
					'content-type': 'application/json',
					'content-length': String(maximumTallyGraphqlResponseBytes + 1),
				},
			}))

		await expect(getGovernor({
			governorId,
		})).rejects.toThrow('foreign governor')
		await expect(getGovernorsPage({
			organizationId,
			limit: 1,
		})).rejects.toThrow('foreign organization')
		await expect(getProposalsPage({
			governorId,
			limit: 1,
		})).rejects.toThrow('foreign governor')
		await expect(getGovernor({
			governorId,
		})).rejects.toThrow('unauthorized')
		await expect(getGovernor({
			governorId,
		})).rejects.toThrow('byte limit')
		await expect(getGovernor({
			governorId: 'not-a-caip10',
		})).rejects.toThrow('invalid requested governor ID')
		await expect(getProposal({
			proposalId: '',
		})).rejects.toThrow('invalid requested proposal ID')
		await expect(getGovernorsPage({
			organizationId,
			limit: 21,
		})).rejects.toThrow('page limit')
	})

	it('rejects a proposal governor whose account identity is on another chain', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposal: {
				...proposal,
				governor: {
					...proposal.governor,
					id: 'eip155:10:0x0000000000000000000000000000000000000001',
				},
			},
		}))

		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('proposal governor chain disagrees with ID')
	})

	it('fails closed on invalid native page cursors and unsafe counts', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				governors: {
					nodes: [],
					pageInfo: {
						firstCursor: '\n',
						lastCursor: null,
						count: 0,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposals: {
					nodes: [],
					pageInfo: {
						firstCursor: null,
						lastCursor: null,
						count: Number.MAX_SAFE_INTEGER + 1,
					},
				},
			}))

		await expect(getGovernorsPage({
			organizationId,
			limit: 1,
		})).rejects.toThrow('invalid first cursor')
		await expect(getProposalsPage({
			governorId,
			limit: 1,
		})).rejects.toThrow('invalid page count')
	})

	it('fails closed on malformed governor/proposal arktype envelopes', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				governor: {
					...governor,
					delegatesCount: -1,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				governor: {
					...governor,
					proposalStats: {
						total: 1,
						active: 1,
						failed: 0,
						passed: 'seven',
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					status: 'not-a-status',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					voteStats: [{
						type: 'for',
						votesCount: '1',
						votersCount: 1,
						percent: 'eighty',
					}],
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				governors: {
					nodes: [
						governor,
					],
					pageInfo: {
						firstCursor: null,
						lastCursor: null,
						count: -3,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposals: {
					nodes: [
						proposal,
					],
					pageInfo: {
						firstCursor: 12,
						lastCursor: null,
						count: 1,
					},
				},
			}))

		await expect(getGovernor({
			governorId,
		})).rejects.toThrow('invalid governor envelope')
		await expect(getGovernor({
			governorId,
		})).rejects.toThrow('invalid governor envelope')
		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('invalid proposal envelope')
		await expect(getProposal({
			proposalId,
		})).rejects.toThrow('invalid proposal envelope')
		await expect(getGovernorsPage({
			organizationId,
			limit: 1,
		})).rejects.toThrow('invalid governors page envelope')
		await expect(getProposalsPage({
			governorId,
			limit: 1,
		})).rejects.toThrow('invalid proposals page envelope')
	})
})
