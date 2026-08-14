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
	getGovernor,
	getGovernorsPage,
	getProposal,
	getProposalsPage,
} = vi.hoisted(() => ({
	getGovernor: vi.fn(),
	getGovernorsPage: vi.fn(),
	getProposal: vi.fn(),
	getProposalsPage: vi.fn(),
}))

vi.mock('$/sources/Tally/Graphql/queries.ts', () => ({
	getGovernor,
	getGovernorsPage,
	getProposal,
	getProposalsPage,
}))

const {
	default: tally,
	resolveTallyGovernor,
	resolveTallyGovernors,
	resolveTallyProposal,
	resolveTallyProposals,
	tallyGovernorFields,
	tallyProposalFields,
} = await import('$/resolvers/Tally-Graphql.ts')

const governorId = 'eip155:1:0x7e90e03654732abedf89Faf87f05BcD03ACEeFdc'
const organizationId = '2207450143689540900'
const proposalId = '2207450143689540901'
const proposer = '0x1234567800000000000000000000000000000abc'

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 10,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const governor = {
	id: governorId,
	chainId: 'eip155:1',
	name: 'Uniswap',
	slug: 'uniswap',
	type: 'governorbravo',
	kind: 'single',
	quorum: '10987654321',
	timelockId: 'eip155:1:0x1a9C8182C09F50C8318d769245beA52c32BE546D',
	tokenId: null,
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
		quorumVotes: '1',
		proposalThreshold: '2',
		votingDelay: '3',
		votingPeriod: '4',
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
		eta: 1_700_200_000,
		ipfsHash: null,
		txHash: `0x${'ab'.repeat(32)}`,
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
		ens: 'alice.eth',
		name: 'Alice',
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
	],
}

describe('Tally resolver field shaping', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps governor wire rows onto EVM network/contract selectors', () => {
		expect(tallyGovernorFields(governor)).toMatchObject({
			[EntityMetaKey.Selector]: {
				governorId,
			},
			name: 'Uniswap',
			$network: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: '0x7e90e03654732abedf89faf87f05bcd03aceefdc',
				},
			},
			organizationId,
			proposalStats: governor.proposalStats,
		})
	})

	it('projects governor/proposal leftovers without inventing tip observations', () => {
		expect(tallyGovernorFields({
			...governor,
			tokenId: 'eip155:1/erc20:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
		})).toMatchObject({
			tokenId: 'eip155:1/erc20:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
			organizationSlug: 'uniswap',
			parameters: governor.parameters,
			isPrimary: true,
		})
		expect(tallyProposalFields(proposal)).toMatchObject({
			organizationSlug: 'uniswap',
			organizationName: 'Uniswap',
			proposerEns: 'alice.eth',
			proposerName: 'Alice',
			voteStats: proposal.voteStats,
			quorum: proposal.quorum,
		})
		expect(tallyGovernorFields(governor)).not.toHaveProperty('$$timestamps')
		expect(tallyProposalFields(proposal)).not.toHaveProperty('$$timestamps')
	})

	it('maps proposal wire rows onto governor contract and lifecycle fields', () => {
		expect(tallyProposalFields(proposal)).toMatchObject({
			[EntityMetaKey.Selector]: {
				proposalId,
			},
			title: 'Fund public goods',
			status: 'active',
			startAtMs: 1_700_000_100_000,
			endAtMs: 1_700_100_000_000,
			etaMs: 1_700_200_000_000,
			$governor: {
				[EntityMetaKey.Selector]: {
					governorId,
				},
			},
			$governorContract: {
				[EntityMetaKey.Selector]: {
					address: '0x7e90e03654732abedf89faf87f05bcd03aceefdc',
				},
			},
			$proposer: {
				[EntityMetaKey.Selector]: {
					$actor: {
						address: '0x1234567800000000000000000000000000000abc',
					},
				},
			},
		})
	})

	it('resolves governors and proposals through lazy query imports', async () => {
		getGovernor.mockResolvedValue(governor)
		getGovernorsPage.mockResolvedValue({
			nodes: [
				governor,
			],
			pageInfo: {
				firstCursor: null,
				lastCursor: null,
				count: 1,
			},
		})
		getProposal.mockResolvedValue(proposal)
		getProposalsPage.mockResolvedValue({
			nodes: [
				proposal,
			],
			pageInfo: {
				firstCursor: null,
				lastCursor: null,
				count: 1,
			},
		})

		await expect(resolveTallyGovernor({
			governorId,
		})).resolves.toMatchObject({
			governorId,
			name: 'Uniswap',
		})
		await expect(resolveTallyGovernors({
			organizationId,
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				governorId,
			},
		}])
		await expect(resolveTallyProposal({
			proposalId,
		})).resolves.toMatchObject({
			proposalId,
			title: 'Fund public goods',
		})
		await expect(resolveTallyProposals({
			governorId,
		}, context)).resolves.toMatchObject({
			count: 1,
			rows: [{
				[EntityMetaKey.Selector]: {
					proposalId,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TallyProposal, [], 'status')]: proposal.status,
					[entityFieldAddressKey(EntityType.TallyProposal, [], 'title')]: 'Fund public goods',
					[entityFieldAddressKey(EntityType.TallyProposal, [], 'startAtMs')]: 1_700_000_100_000,
				},
			}],
			nextCursor: null,
		})
		expect(getProposalsPage).toHaveBeenCalledWith({
			governorId,
			limit: 10,
			afterCursor: undefined,
		})
	})

	it('registers Tally governor and proposal resolver facets that project enrolled fields', () => {
		expect(tally.source).toBe(Source.Tally)
		expect(tally.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.TallyGovernor,
			EntityType.TallyGovernor,
			EntityType.TallyGovernor,
			EntityType.TallyProposal,
		])
		const governorResolver = tally.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TallyGovernor
			&& 'governorId' in resolver.projections
		))
		const proposalResolver = tally.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TallyProposal
			&& 'title' in resolver.projections
		))
		const governorProposalsResolver = tally.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TallyGovernor
			&& '$$proposals' in resolver.projections
		))
		expect(governorResolver?.projections.name({ governorId, name: 'Uniswap' })).toBe('Uniswap')
		expect(proposalResolver?.projections.title({ proposalId, title: 'Fund public goods' })).toBe('Fund public goods')
		expect(proposalResolver?.projections.voteStats({
			proposalId,
			voteStats: proposal.voteStats,
		})).toEqual(proposal.voteStats)
		expect(governorProposalsResolver?.resolve).toHaveProperty('GovernorId')
	})

	it('continues governor proposal pages with the provider cursor', async () => {
		const governorProposalsResolver = tally.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TallyGovernor
			&& 'GovernorId' in resolver.resolve
			&& '$$proposals' in resolver.projections
		))
		if (governorProposalsResolver == null || !('GovernorId' in governorProposalsResolver.resolve))
			throw new Error('Tally spec missing governor proposals resolver')

		getProposalsPage.mockResolvedValueOnce({
			nodes: [proposal],
			pageInfo: {
				firstCursor: 'cursor-2',
				lastCursor: 'cursor-2',
				count: null,
			},
		})
		const page = await governorProposalsResolver.resolve.GovernorId.resolve({
			governorId,
		}, {
			...context,
			providerContinuationToken: 'cursor-1',
		})

		expect(getProposalsPage).toHaveBeenCalledWith({
			governorId,
			limit: 10,
			afterCursor: 'cursor-1',
		})
		expect(governorProposalsResolver.projections.$$proposals.select(page)).toMatchObject([{
			[EntityMetaKey.Selector]: { proposalId },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TallyProposal, [], 'status')]: proposal.status,
				[entityFieldAddressKey(EntityType.TallyProposal, [], 'title')]: 'Fund public goods',
			},
		}])
		expect(governorProposalsResolver.projections.$$proposals.continuation(page)).toEqual({
			operation: 'proposals',
			target: 'tally-api',
			terminal: false,
			token: 'cursor-2',
		})

		expect(governorProposalsResolver.projections.$$proposals.continuation({
			count: undefined,
			rows: [],
			nextCursor: null,
		})).toEqual({
			operation: 'proposals',
			target: 'tally-api',
			terminal: true,
		})
	})

	it('resolves the proposal count independently from proposal rows', async () => {
		const governorProposalCountResolver = tally.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TallyGovernor
			&& '$$proposals' in resolver.projections
			&& typeof resolver.projections.$$proposals === 'object'
			&& resolver.projections.$$proposals != null
			&& 'resolveCount' in resolver.projections.$$proposals
		))
		if (governorProposalCountResolver == null || !('GovernorId' in governorProposalCountResolver.resolve))
			throw new Error('Tally spec missing governor proposal count resolver')

		getProposalsPage.mockResolvedValueOnce({
			nodes: [],
			pageInfo: {
				firstCursor: null,
				lastCursor: null,
				count: 10,
			},
		})
		const count = await governorProposalCountResolver.resolve.GovernorId.resolve({ governorId })

		expect(getProposalsPage).toHaveBeenCalledWith({
			governorId,
			limit: 1,
		})
		expect(governorProposalCountResolver.projections.$$proposals.resolveCount(count)).toBe(10)
	})

	it('preserves an upstream proposal failure instead of materializing an empty proposal', async () => {
		getProposal.mockRejectedValueOnce(new Error('Tally GraphQL: 503 Service Unavailable'))

		await expect(resolveTallyProposal({
			proposalId,
		})).rejects.toThrow('503')
	})
})
