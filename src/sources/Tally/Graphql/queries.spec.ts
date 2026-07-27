import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	getGovernor,
	getGovernorsPage,
	getOrganization,
	getOrganizationsPage,
	getProposal,
	getProposalsPage,
	maximumTallyGraphqlResponseBytes,
} from '$/sources/Tally/Graphql/queries.ts'
import * as runtimeHttp from '$/sources/_runtime/http.ts'

const binding = {
	source: Source.Tally_Graphql,
	target: {
		kind: SourceTargetKind.Global,
		key: 'tally-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.tally.xyz/query',
		origin: 'https://api.tally.xyz',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.Graphql,
	apiFamily: ApiFamily.GraphqlHttp,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
	}],
	proxyId: 'Tally_Graphql-fc5d2b1cde50',
	serverCredentialId: 'Tally_Graphql-fc5d2b1cde50',
	artifacts: [{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Tally/Graphql/types.ts',
		generated: false,
	}],
} as const satisfies SourceBinding

const organizationId = '2207450143689540900'
const governorAddress = `0x${'1'.repeat(40)}`
const governorId = `eip155:1:${governorAddress}`
const timelockId = `eip155:1:0x${'2'.repeat(40)}`
const proposalId = '2207450143689540901'
const onchainId = '113'
const creatorAddress = `0x${'3'.repeat(40)}`
const proposerAddress = `0x${'4'.repeat(40)}`

const organizationReference = {
	id: organizationId,
	slug: 'example-dao',
	name: 'Example DAO',
}

const organization = {
	...organizationReference,
	chainIds: [
		'eip155:1',
	],
	governorIds: [
		governorId,
	],
	metadata: {
		description: 'Example onchain organization',
		icon: 'https://static.example/icon.png',
	},
	hasActiveProposals: false,
	proposalsCount: 8,
}

const governorReference = {
	id: governorId,
	chainId: 'eip155:1',
	slug: 'example-governor',
	name: 'Example Governor',
}

const governor = {
	...governorReference,
	isIndexing: false,
	isBehind: false,
	isPrimary: true,
	kind: 'single' as const,
	organization: organizationReference,
	proposalStats: {
		total: 8,
		active: 0,
		failed: 2,
		passed: 6,
	},
	parameters: {
		quorumVotes: '4000000000000000000000000',
		proposalThreshold: '1000000000000000000000',
		votingDelay: '7200',
		votingPeriod: '50400',
		gracePeriod: '172800',
		quorumNumerator: '4',
		quorumDenominator: '100',
		clockMode: 'mode=blocknumber&from=default',
		countingMode: 'support=bravo&quorum=for,abstain',
	},
	quorum: '4000000000000000000000000',
	timelockId,
	tokenId: `eip155:1/erc20:0x${'5'.repeat(40)}`,
	type: 'openzeppelingovernor' as const,
}

const creator = {
	id: '4',
	address: creatorAddress,
	name: 'Proposal creator',
}

const proposer = {
	id: '5',
	address: proposerAddress,
	name: 'Draft proposer',
}

const proposal = {
	id: proposalId,
	onchainId,
	chainId: 'eip155:1',
	creator,
	end: {
		__typename: 'Block' as const,
		id: 'eip155:1:19100000',
		number: 19_100_000,
		timestamp: 1_700_100_000,
	},
	events: [
		{
			block: {
				id: 'eip155:1:19000000',
				number: 19_000_000,
				timestamp: 1_700_000_000,
			},
			chainId: 'eip155:1',
			createdAt: 1_700_000_000,
			type: 'created' as const,
			txHash: `0x${'6'.repeat(64)}`,
		},
		{
			block: {
				id: 'eip155:1:19110000',
				number: 19_110_000,
				timestamp: 1_700_110_000,
			},
			chainId: 'eip155:1',
			createdAt: 1_700_110_000,
			type: 'executed' as const,
			txHash: `0x${'7'.repeat(64)}`,
		},
	],
	executableCalls: [
		{
			calldata: '0xa9059cbb',
			chainId: 'eip155:1',
			index: 0,
			signature: 'transfer(address,uint256)',
			target: `0x${'8'.repeat(40)}`,
			type: 'erc20transfer' as const,
			value: '0',
		},
		{
			calldata: '0x',
			chainId: 'eip155:1',
			index: 1,
			signature: null,
			target: `0x${'9'.repeat(40)}`,
			type: 'nativetransfer' as const,
			value: '1000000000000000000',
		},
	],
	governor: governorReference,
	metadata: {
		title: 'Fund public goods',
		description: 'Transfer governance-approved funding.',
		eta: 1_700_105_000,
		ipfsHash: 'bafyproposal',
		previousEnd: null,
		timelockId,
		txHash: `0x${'6'.repeat(64)}`,
		discourseURL: 'https://forum.example/proposal/113',
		snapshotURL: null,
	},
	organization: organizationReference,
	proposer,
	quorum: '4000000000000000000000000',
	status: 'executed' as const,
	start: {
		__typename: 'Block' as const,
		id: 'eip155:1:19000000',
		number: 19_000_000,
		timestamp: 1_700_000_000,
	},
	voteStats: [
		{
			type: 'for' as const,
			votesCount: '5000000000000000000000000',
			votersCount: 120,
			percent: 80,
		},
		{
			type: 'against' as const,
			votesCount: '625000000000000000000000',
			votersCount: 10,
			percent: 10,
		},
		{
			type: 'abstain' as const,
			votesCount: '625000000000000000000000',
			votersCount: 8,
			percent: 10,
		},
	],
}

const pageInfo = {
	firstCursor: 'first-cursor',
	lastCursor: 'last-cursor',
	count: 0,
}

const jsonResponse = (
	data: object
) => (
	new Response(JSON.stringify({
		data,
	}), {
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('Tally documented governance reads', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('uses only the canonical runtime-secret proxy and preserves organization cursor provenance', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				organization,
			}))
			.mockResolvedValueOnce(jsonResponse({
				organizations: {
					nodes: [{
						__typename: 'Organization',
						...organization,
					}],
					pageInfo,
				},
			}))

		await expect(getOrganization({
			binding,
			slug: organization.slug,
		})).resolves.toMatchObject({
			value: {
				id: organizationId,
				slug: organization.slug,
				governorIds: [
					governorId,
				],
			},
			observedBy: 'Tally_Graphql',
			endpoint: 'https://api.tally.xyz/query',
		})
		await expect(getOrganizationsPage({
			binding,
			chainId: 'eip155:1',
			limit: 1,
			afterCursor: 'previous-cursor',
		})).resolves.toMatchObject({
			value: {
				items: [{
					id: organizationId,
				}],
				pageInfo,
				nextCursor: 'last-cursor',
			},
		})

		const request = sourceFetch.mock.calls[1]?.[2]
		expect(new Headers(request?.headers).has('Api-Key')).toBe(false)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			binding.endpoints[0].locator,
			expect.any(Object)
		)
		expect(String(request?.body)).not.toContain('mutation')
		expect(JSON.parse(String(request?.body))).toMatchObject({
			variables: {
				input: {
					filters: {
						chainId: 'eip155:1',
					},
					page: {
						afterCursor: 'previous-cursor',
						limit: 1,
					},
				},
			},
		})
	})

	it('preserves governor CAIP identities, protocol units, indexing state, and organization subject', async () => {
		vi.spyOn(runtimeHttp, 'sourceFetch')
			.mockResolvedValueOnce(jsonResponse({
				governor,
			}))
			.mockResolvedValueOnce(jsonResponse({
				governors: {
					nodes: [{
						__typename: 'Governor',
						...governor,
					}],
					pageInfo,
				},
			}))

		await expect(getGovernor({
			binding,
			governorId,
		})).resolves.toMatchObject({
			value: {
				id: governorId,
				chainId: 'eip155:1',
				quorum: '4000000000000000000000000',
				parameters: {
					votingDelay: '7200',
					votingPeriod: '50400',
					clockMode: 'mode=blocknumber&from=default',
				},
				isIndexing: false,
				isBehind: false,
			},
		})
		await expect(getGovernorsPage({
			binding,
			organizationId,
			limit: 1,
		})).resolves.toMatchObject({
			value: {
				items: [{
					id: governorId,
					organization: {
						id: organizationId,
					},
				}],
				nextCursor: 'last-cursor',
			},
		})
	})

	it.each([
		'active',
		'queued',
		'executed',
	] as const)('preserves the %s lifecycle, proposer, window, quorum, tallies, and execution plan', async (status) => {
		vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposal: {
				...proposal,
				status,
			},
		}))

		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).resolves.toMatchObject({
			value: {
				id: proposalId,
				onchainId,
				status,
				creator: {
					address: creatorAddress,
				},
				proposer: {
					address: proposerAddress,
				},
				start: {
					number: 19_000_000,
					timestamp: 1_700_000_000,
				},
				end: {
					number: 19_100_000,
					timestamp: 1_700_100_000,
				},
				quorum: '4000000000000000000000000',
				voteStats: proposal.voteStats,
				executableCalls: proposal.executableCalls,
				events: proposal.events,
			},
		})
	})

	it('pages only non-draft proposals for the exact governor and retains For/Against/Abstain totals', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch').mockResolvedValue(jsonResponse({
			proposals: {
				nodes: [{
					__typename: 'Proposal',
					...proposal,
				}],
				pageInfo,
			},
		}))

		await expect(getProposalsPage({
			binding,
			governorId,
			limit: 1,
		})).resolves.toMatchObject({
			value: {
				items: [{
					id: proposalId,
					voteStats: proposal.voteStats,
				}],
				nextCursor: 'last-cursor',
			},
		})
		expect(JSON.parse(
			String(sourceFetch.mock.calls[0]?.[2]?.body)
		)).toMatchObject({
			variables: {
				input: {
					filters: {
						governorId,
						isDraft: false,
					},
					sort: {
						isDescending: true,
						sortBy: 'id',
					},
				},
			},
		})
	})

	it('rejects substituted organization, governor, and proposal subjects', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				organization: {
					...organization,
					slug: 'foreign-dao',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				governor: {
					...governor,
					id: `eip155:1:0x${'a'.repeat(40)}`,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					onchainId: '114',
				},
			}))

		await expect(getOrganization({
			binding,
			slug: organization.slug,
		})).rejects.toThrow('foreign organization')
		await expect(getGovernor({
			binding,
			governorId,
		})).rejects.toThrow('foreign governor')
		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).rejects.toThrow('foreign proposal')
	})

	it('rejects malformed units, reversed voting windows, and duplicate execution or vote dimensions', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					quorum: '1.5',
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					start: {
						...proposal.start,
						timestamp: proposal.end.timestamp + 1,
					},
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					executableCalls: [
						proposal.executableCalls[0],
						{
							...proposal.executableCalls[1],
							index: 0,
						},
					],
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				proposal: {
					...proposal,
					voteStats: [
						proposal.voteStats[0],
						proposal.voteStats[0],
					],
				},
			}))

		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).rejects.toThrow('invalid proposal quorum')
		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).rejects.toThrow('invalid proposal voting window')
		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).rejects.toThrow('duplicate executable call index')
		await expect(getProposal({
			binding,
			governorId,
			onchainId,
		})).rejects.toThrow('duplicate proposal vote type')
	})

	it('enforces the documented 20-item page limit, advancing cursors, binding credentials, and response cap', async () => {
		const sourceFetch = vi.spyOn(runtimeHttp, 'sourceFetch')

		await expect(getOrganizationsPage({
			binding,
			limit: 21,
		})).rejects.toThrow('limit must be from 1 through 20')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(jsonResponse({
			organizations: {
				nodes: [{
					__typename: 'Organization',
					...organization,
				}],
				pageInfo: {
					...pageInfo,
					lastCursor: 'same-cursor',
				},
			},
		}))
		await expect(getOrganizationsPage({
			binding,
			limit: 1,
			afterCursor: 'same-cursor',
		})).rejects.toThrow('no advancing cursor')

		sourceFetch.mockResolvedValueOnce(new Response(
			'x'.repeat(maximumTallyGraphqlResponseBytes + 1),
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		))
		await expect(getOrganization({
			binding,
			organizationId,
		})).rejects.toThrow('response exceeds byte limit')

	})
})
