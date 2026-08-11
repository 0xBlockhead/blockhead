import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type {
	CosmosSdkProposalResponse,
	CosmosSdkVotesResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => {
	const originsForBinding = (binding: {
		endpoints: {
			locator: string
			corsEnabled?: boolean
		}[]
	}) => binding.endpoints.flatMap((endpoint) => (
		endpoint.locator.startsWith('env:') ?
			[]
		:
			[{
				origin: new URL(endpoint.locator).origin,
				corsEnabled: endpoint.corsEnabled === true,
			}]
	))

	return {
		firstHttpUrlForBinding: (binding: {
			endpoints: {
				locator: string
			}[]
		}) => binding.endpoints[0]?.locator,
		sourceFetch: async (
			binding: Parameters<typeof originsForBinding>[0],
			url: string,
			init: RequestInit
		) => new Response(JSON.stringify(await getJson(url, {
			origins: originsForBinding(binding),
			init,
		}))),
		sourceGetJson: (
			binding: Parameters<typeof originsForBinding>[0],
			url: string
		) => getJson(url, {
			origins: originsForBinding(binding),
		}),
	}
})

const {
	getBalances,
	getDelegationRewards,
	getDelegations,
	getDenomMetadata,
	getProposal,
	getProposalDeposit,
	getProposalDeposits,
	getProposalTally,
	getProposalVote,
	getProposalVotes,
	getProposals,
	getTx,
	getTransactionsByEvent,
	getValidators,
} = await import('$/sources/CosmosSdk/Rest/queries.ts')

describe('Cosmos SDK GetTxsEvent transport', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('requests one descending event page with the modern page and limit parameters', async () => {
		getJson.mockResolvedValueOnce({
			txs: [],
			tx_responses: [],
			total: '0',
		})

		await expect(getTransactionsByEvent({
			event: "message.sender='cosmos1sender'",
			page: 2,
			limit: 16,
		})).resolves.toEqual({
			txs: [],
			tx_responses: [],
			total: '0',
		})
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=message.sender%3D%27cosmos1sender%27&order_by=ORDER_BY_DESC&page=2&limit=16',
			expect.any(Object)
		)
	})

	it.each([
		{ page: 0, limit: 16 },
		{ page: 1.5, limit: 16 },
		{ page: 1, limit: 0 },
		{ page: 1, limit: 101 },
	])('rejects an invalid bounded page before transport', async ({ page, limit }) => {
		expect(() => getTransactionsByEvent({
			event: "message.sender='cosmos1sender'",
			page,
			limit,
		})).toThrow('CosmosSdk_Rest: invalid transaction')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects duplicate and unknown continuation fields before transport', async () => {
		getJson.mockResolvedValueOnce({
			balances: [{
				denom: 'uatom',
				amount: '1',
			}],
			pagination: {
				next_key: 'next',
			},
		})
		const firstPage = await getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
		})
		const duplicateKey = new URLSearchParams(firstPage.continuationToken)
		duplicateKey.append('key', 'other')
		const unknownField = new URLSearchParams(firstPage.continuationToken)
		unknownField.set('offset', '1')
		getJson.mockClear()

		for (const continuationToken of [
			duplicateKey.toString(),
			unknownField.toString(),
		])
			await expect(getBalances({
				network: 'cosmos:cosmoshub-4',
				address: 'cosmos1account',
				blockHeight: 1n,
				limit: 1,
				continuationToken,
			})).rejects.toThrow('invalid or foreign balance continuation')
		expect(getJson).not.toHaveBeenCalled()
	})
})

describe('Cosmos SDK validator transport', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('rejects an unbounded validator page before transport', () => {
		for (const limit of [0, 101, 1.5, Number.MAX_SAFE_INTEGER + 1])
			expect(() => getValidators({ limit })).toThrow('invalid validator page limit')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('requests a bounded validator page with the selected status', async () => {
		getJson.mockResolvedValueOnce({ validators: [], pagination: {} })

		await expect(getValidators({
			limit: 16,
			status: 'BOND_STATUS_BONDED',
		})).resolves.toEqual({ validators: [], pagination: {} })
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/staking/v1beta1/validators?pagination.limit=16&pagination.count_total=true&status=BOND_STATUS_BONDED',
			expect.any(Object)
		)
	})
})

describe('Cosmos SDK transaction transport', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('accepts canonical hash casing and rejects a foreign transaction response', async () => {
		getJson
			.mockResolvedValueOnce({
				tx_response: {
					txhash: 'ABC123',
				},
			})
			.mockResolvedValueOnce({
				tx_response: {
					txhash: 'DEF456',
				},
			})

		await expect(getTx({ txHash: 'abc123' })).resolves.toMatchObject({
			tx_response: {
				txhash: 'ABC123',
			},
		})
		await expect(getTx({ txHash: 'ABC123' })).rejects.toThrow(
			'CosmosSdk_Rest: transaction response does not match request'
		)
	})
})

describe('Cosmos SDK public account module transport', () => {
	beforeEach(() => {
		getJson.mockReset()
		getJson.mockResolvedValue()
	})

	it('validates and normalizes an exact fixed-height balance page', async () => {
		getJson.mockResolvedValueOnce({
			balances: [
				{
					denom: 'uatom',
					amount: '900719925474099312345',
				},
				{
					denom: 'ibc/ABCDEF',
					amount: '0',
				},
			],
			pagination: {
				next_key: null,
				total: '2',
			},
		})

		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account/unsafe',
			blockHeight: 24_680_000n,
			limit: 2,
		})).resolves.toEqual({
			balances: [
				{
					denom: 'uatom',
					amount: 900_719_925_474_099_312_345n,
				},
				{
					denom: 'ibc/ABCDEF',
					amount: 0n,
				},
			],
			blockHeight: 24_680_000n,
			total: 2n,
		})
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/cosmos1account%2Funsafe?pagination.limit=2&pagination.count_total=true',
			{
				origins: expect.any(Array),
				init: {
					headers: {
						'x-cosmos-block-height': '24680000',
					},
				},
			}
		)
	})

	it('roundtrips an opaque continuation with exact binding, network, account, and height authority', async () => {
		getJson
			.mockResolvedValueOnce({
				balances: [{
					denom: 'uatom',
					amount: '1',
				}],
				pagination: {
					next_key: 'next+/=',
					total: '2',
				},
			})
			.mockResolvedValueOnce({
				balances: [{
					denom: 'ibc/ABCDEF',
					amount: '2',
				}],
				pagination: {
					next_key: null,
					total: '2',
				},
			})

		const firstPage = await getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 24_680_000n,
			limit: 1,
		})
		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 24_680_000n,
			limit: 1,
			continuationToken: firstPage.continuationToken,
		})).resolves.toEqual({
			balances: [{
				denom: 'ibc/ABCDEF',
				amount: 2n,
			}],
			blockHeight: 24_680_000n,
			total: 2n,
		})
		expect(getJson.mock.calls.map(([url, options]) => ({
			url,
			height: options.init.headers['x-cosmos-block-height'],
		}))).toEqual([
			{
				url: 'https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/cosmos1account?pagination.limit=1&pagination.count_total=true',
				height: '24680000',
			},
			{
				url: 'https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/cosmos1account?pagination.limit=1&pagination.count_total=true&pagination.key=next%2B%2F%3D',
				height: '24680000',
			},
		])
	})

	it('rejects a continuation issued by a foreign binding before transport', async () => {
		getJson.mockResolvedValueOnce({
			balances: [],
			pagination: {
				next_key: 'next',
			},
		})
		const firstPage = await getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
		})
		getJson.mockClear()
		const foreignContinuationToken = new URLSearchParams(firstPage.continuationToken)
		foreignContinuationToken.set('binding', 'CosmosSdk_Rest:eip155:foreign-1:BrowserDirect:Rest')

		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
			continuationToken: foreignContinuationToken.toString(),
		})).rejects.toThrow('invalid or foreign balance continuation')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('uses opaque bounded pagination for delegations and preserves exact reward scope', async () => {
		await getDelegations({
			delegatorAddress: 'cosmos1account/unsafe',
			limit: 37,
			paginationKey: 'next+/=',
		})
		await getDelegationRewards({
			delegatorAddress: 'cosmos1account/unsafe',
		})

		expect(getJson.mock.calls.map(([url]) => url)).toEqual([
			'https://rest.cosmos.directory/cosmoshub/cosmos/staking/v1beta1/delegations/cosmos1account%2Funsafe?pagination.limit=37&pagination.count_total=true&pagination.key=next%2B%2F%3D',
			'https://rest.cosmos.directory/cosmoshub/cosmos/distribution/v1beta1/delegators/cosmos1account%2Funsafe/rewards',
		])
	})

	it.each([
		() => getDelegations({ delegatorAddress: 'cosmos1account', limit: 0 }),
		() => getDelegations({ delegatorAddress: 'cosmos1account', limit: 101 }),
	])('rejects unbounded account module pages before transport', async (query) => {
		expect(query).toThrow('CosmosSdk_Rest: invalid')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		0,
		101,
	])('rejects balance page limit %s before transport', async (limit) => {
		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit,
		})).rejects.toThrow('CosmosSdk_Rest: invalid balance page limit')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		{
			label: 'missing balances',
			response: {},
			message: 'balances',
		},
		{
			label: 'empty denom',
			response: {
				balances: [{
					denom: '',
					amount: '1',
				}],
			},
			message: 'denom',
		},
		{
			label: 'negative amount',
			response: {
				balances: [{
					denom: 'uatom',
					amount: '-1',
				}],
			},
			message: 'amount',
		},
		{
			label: 'fractional amount',
			response: {
				balances: [{
					denom: 'uatom',
					amount: '1.5',
				}],
			},
			message: 'amount',
		},
		{
			label: 'duplicate denom',
			response: {
				balances: [
					{
						denom: 'uatom',
						amount: '1',
					},
					{
						denom: 'uatom',
						amount: '2',
					},
				],
			},
			message: 'duplicate denoms',
		},
		{
			label: 'malformed total',
			response: {
				balances: [],
				pagination: {
					total: '-1',
				},
			},
			message: 'total',
		},
	])('rejects $label before returning public balance rows', async ({
		response,
		message,
	}) => {
		getJson.mockResolvedValueOnce(response)

		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 2,
		})).rejects.toThrow(message)
	})

	it('rejects oversized and non-progress balance pages', async () => {
		getJson
			.mockResolvedValueOnce({
				balances: [
					{
						denom: 'uatom',
						amount: '1',
					},
					{
						denom: 'ibc/ABCDEF',
						amount: '2',
					},
				],
			})
			.mockResolvedValueOnce({
				balances: [{
					denom: 'uatom',
					amount: '1',
				}],
				pagination: {
					next_key: 'next',
				},
			})
			.mockResolvedValueOnce({
				balances: [{
					denom: 'ibc/ABCDEF',
					amount: '2',
				}],
				pagination: {
					next_key: 'next',
				},
			})

		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
		})).rejects.toThrow('exceeds its requested limit')
		const firstPage = await getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
		})
		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
			continuationToken: firstPage.continuationToken,
		})).rejects.toThrow('continuation did not advance')
	})

	it.each([
		{
			label: 'network',
			overrides: {
				network: 'cosmos:osmosis-1',
			},
		},
		{
			label: 'account',
			overrides: {
				address: 'cosmos1other',
			},
		},
		{
			label: 'height',
			overrides: {
				blockHeight: 2n,
			},
		},
	])('rejects a continuation for a foreign $label before transport', async ({
		overrides,
	}) => {
		getJson.mockResolvedValueOnce({
			balances: [{
				denom: 'uatom',
				amount: '1',
			}],
			pagination: {
				next_key: 'next',
			},
		})
		const firstPage = await getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
		})
		getJson.mockClear()

		await expect(getBalances({
			network: 'cosmos:cosmoshub-4',
			address: 'cosmos1account',
			blockHeight: 1n,
			limit: 1,
			continuationToken: firstPage.continuationToken,
			...overrides,
		})).rejects.toThrow('invalid or foreign balance continuation')
		expect(getJson).not.toHaveBeenCalled()
	})
})

describe('Cosmos SDK denom metadata transport', () => {
	const metadata = {
		metadata: {
			name: 'Atom',
			description: 'The native staking token of the Cosmos Hub.',
			base: 'uatom',
			display: 'atom',
			symbol: 'ATOM',
			denom_units: [
				{
					denom: 'uatom',
					exponent: 0,
					aliases: ['microatom'],
				},
				{
					denom: 'atom',
					exponent: 6,
					aliases: [],
				},
			],
		},
	}

	beforeEach(() => {
		getJson.mockReset()
	})

	it('safely encodes an opaque denom and preserves complete fixed-height metadata', async () => {
		getJson.mockResolvedValueOnce(metadata)

		await expect(getDenomMetadata({
			denom: 'factory/cosmos1creator/subdenom',
			blockHeight: 24_680_000n,
		})).resolves.toEqual(metadata)
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/denoms_metadata/factory%2Fcosmos1creator%2Fsubdenom',
			{
				origins: expect.any(Array),
				init: {
					headers: {
						'x-cosmos-block-height': '24680000',
					},
				},
			}
		)
	})

	it.each([
		{
			label: 'missing field',
			response: {
				metadata: {
					...metadata.metadata,
					name: undefined,
				},
			},
			message: 'name',
		},
		{
			label: 'uint32 overflow exponent',
			response: {
				metadata: {
					...metadata.metadata,
					denom_units: [{
						denom: 'uatom',
						exponent: 4_294_967_296,
						aliases: [],
					}],
				},
			},
			message: 'exponent',
		},
		{
			label: 'duplicate unit',
			response: {
				metadata: {
					...metadata.metadata,
					denom_units: [
						metadata.metadata.denom_units[0],
						metadata.metadata.denom_units[0],
						metadata.metadata.denom_units[1],
					],
				},
			},
			message: 'duplicate units',
		},
		{
			label: 'duplicate alias',
			response: {
				metadata: {
					...metadata.metadata,
					denom_units: [
						{
							...metadata.metadata.denom_units[0],
							aliases: ['microatom', 'microatom'],
						},
						metadata.metadata.denom_units[1],
					],
				},
			},
			message: 'duplicate aliases',
		},
		{
			label: 'foreign base',
			response: {
				metadata: {
					...metadata.metadata,
					base: 'missing',
				},
			},
			message: 'base unit is missing',
		},
		{
			label: 'foreign display',
			response: {
				metadata: {
					...metadata.metadata,
					display: 'missing',
				},
			},
			message: 'display unit is missing',
		},
	])('rejects $label metadata', async ({
		response,
		message,
	}) => {
		getJson.mockResolvedValueOnce(response)

		await expect(getDenomMetadata({
			denom: 'uatom',
		})).rejects.toThrow(message)
	})
})

describe('Cosmos SDK x/gov v1 transport', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it.each([
		{
			query: () => getProposal({ proposalId: '123/../../params' }),
			url: 'https://rest.cosmos.directory/cosmoshub/cosmos/gov/v1/proposals/123%2F..%2F..%2Fparams',
		},
		{
			query: () => getProposalVote({
				proposalId: '123',
				voter: 'cosmos1voter/unsafe',
			}),
			url: 'https://rest.cosmos.directory/cosmoshub/cosmos/gov/v1/proposals/123/votes/cosmos1voter%2Funsafe',
		},
		{
			query: () => getProposalDeposit({
				proposalId: '123',
				depositor: 'cosmos1depositor/unsafe',
			}),
			url: 'https://rest.cosmos.directory/cosmoshub/cosmos/gov/v1/proposals/123/deposits/cosmos1depositor%2Funsafe',
		},
		{
			query: () => getProposalTally({ proposalId: '123' }),
			url: 'https://rest.cosmos.directory/cosmoshub/cosmos/gov/v1/proposals/123/tally',
		},
	])('requests $url through the registered Cosmos origins', async ({ query, url }) => {
		getJson.mockResolvedValueOnce()

		await query()

		expect(getJson).toHaveBeenCalledWith(url, {
			origins: expect.arrayContaining([
				expect.objectContaining({
					origin: 'https://rest.cosmos.directory',
				}),
			]),
		})
	})

	it.each([
		{
			query: () => getProposals({
				limit: 7,
				paginationKey: 'next+/=',
			}),
			path: 'proposals',
		},
		{
			query: () => getProposalVotes({
				proposalId: '123',
				limit: 7,
				paginationKey: 'next+/=',
			}),
			path: 'proposals/123/votes',
		},
		{
			query: () => getProposalDeposits({
				proposalId: '123',
				limit: 7,
				paginationKey: 'next+/=',
			}),
			path: 'proposals/123/deposits',
		},
	])('carries opaque pagination keys for $path', async ({ query, path }) => {
		getJson.mockResolvedValueOnce()

		await query()

		expect(getJson.mock.calls[0]?.[0]).toBe(
			`https://rest.cosmos.directory/cosmoshub/cosmos/gov/v1/${path}?pagination.limit=7&pagination.count_total=true&pagination.key=next%2B%2F%3D`
		)
	})

	it('preserves the official proposal, Any, lifecycle, tally, coin, vote, and pagination wire values', async () => {
		const proposalResponse = {
			proposal: {
				id: '9007199254740993',
				messages: [
					{
						'@type': '/cosmos.bank.v1beta1.MsgSend',
						from_address: 'cosmos1from',
						amount: [{ denom: 'uatom', amount: '18446744073709551615' }],
					},
				],
				status: 'PROPOSAL_STATUS_VOTING_PERIOD',
				final_tally_result: {
					yes_count: '100000000000000000001',
					abstain_count: '2',
					no_count: '3',
					no_with_veto_count: '4',
				},
				submit_time: '2026-07-22T01:02:03.123456789Z',
				deposit_end_time: '2026-07-23T01:02:03.123456789Z',
				total_deposit: [{ denom: 'uatom', amount: '250000000' }],
				voting_start_time: '2026-07-22T02:02:03.123456789Z',
				voting_end_time: '2026-08-05T02:02:03.123456789Z',
				metadata: 'ipfs://bafyproposal',
				title: 'Canonical title',
				summary: 'Canonical summary',
			},
		} satisfies CosmosSdkProposalResponse
		const votesResponse = {
			votes: [{
				proposal_id: '9007199254740993',
				voter: 'cosmos1voter',
				options: [
					{ option: 'VOTE_OPTION_YES', weight: '0.666666666666666667' },
					{ option: 'VOTE_OPTION_NO', weight: '0.333333333333333333' },
				],
			}],
			pagination: { next_key: 'opaque+/=', total: '9007199254740993' },
		} satisfies CosmosSdkVotesResponse
		getJson
			.mockResolvedValueOnce(proposalResponse)
			.mockResolvedValueOnce(votesResponse)

		await expect(getProposal({ proposalId: '9007199254740993' })).resolves.toBe(proposalResponse)
		await expect(getProposalVotes({ proposalId: '9007199254740993' })).resolves.toBe(votesResponse)
	})

	it.each([
		{},
		{ proposal: null },
		{ votes: null, pagination: { total: 'not-an-integer' } },
	])('does not forge public entities from empty or malformed wire payloads', async (response) => {
		getJson.mockResolvedValueOnce(response)

		await expect(getProposal({ proposalId: '1' })).resolves.toBe(response)
	})
})

describe('Cosmos SDK IBC queries', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('reads channel / connection / client / denom-trace / sequence paths', async () => {
		const {
			getIbcChannel,
			getIbcClientState,
			getIbcConnection,
			getIbcDenomTrace,
			getIbcNextSequenceSend,
		} = await import('$/sources/CosmosSdk/Rest/queries.ts')

		getJson
			.mockResolvedValueOnce({
				channel: {
					state: 'STATE_OPEN',
					ordering: 'ORDER_UNORDERED',
					counterparty: {
						port_id: 'transfer',
						channel_id: 'channel-0',
					},
					connection_hops: [
						'connection-257',
					],
					version: 'ics20-1',
				},
			})
			.mockResolvedValueOnce({
				connection: {
					client_id: '07-tendermint-1',
					state: 'STATE_OPEN',
					counterparty: {
						client_id: '07-tendermint-0',
						connection_id: 'connection-0',
					},
					delay_period: '0',
				},
			})
			.mockResolvedValueOnce({
				client_state: {
					'@type': '/ibc.lightclients.tendermint.v1.ClientState',
					chain_id: 'osmosis-1',
					trust_level: {
						numerator: '1',
						denominator: '3',
					},
					trusting_period: '1209600s',
					unbonding_period: '1814400s',
					max_clock_drift: '600s',
					frozen_height: {
						revision_number: '0',
						revision_height: '0',
					},
					latest_height: {
						revision_number: '1',
						revision_height: '9',
					},
				},
			})
			.mockResolvedValueOnce({
				denom_trace: {
					path: 'transfer/channel-141',
					base_denom: 'uatom',
				},
			})
			.mockResolvedValueOnce({
				next_sequence_send: '42',
			})

		await expect(getIbcChannel({
			portId: 'transfer',
			channelId: 'channel-141',
		})).resolves.toMatchObject({
			channel: {
				state: 'STATE_OPEN',
			},
		})
		await expect(getIbcConnection({
			connectionId: 'connection-257',
		})).resolves.toMatchObject({
			connection: {
				client_id: '07-tendermint-1',
			},
		})
		await expect(getIbcClientState({
			clientId: '07-tendermint-1',
		})).resolves.toMatchObject({
			client_state: {
				chain_id: 'osmosis-1',
			},
		})
		await expect(getIbcDenomTrace({
			hash: 'a'.repeat(64),
		})).resolves.toMatchObject({
			denom_trace: {
				base_denom: 'uatom',
			},
		})
		await expect(getIbcNextSequenceSend({
			portId: 'transfer',
			channelId: 'channel-141',
		})).resolves.toEqual({
			next_sequence_send: '42',
		})

		expect(getJson.mock.calls.map((call) => call[0])).toEqual([
			'https://rest.cosmos.directory/cosmoshub/ibc/core/channel/v1/channels/channel-141/ports/transfer',
			'https://rest.cosmos.directory/cosmoshub/ibc/core/connection/v1/connections/connection-257',
			'https://rest.cosmos.directory/cosmoshub/ibc/core/client/v1/client_states/07-tendermint-1',
			`https://rest.cosmos.directory/cosmoshub/ibc/apps/transfer/v1/denom_traces/${'a'.repeat(64)}`,
			'https://rest.cosmos.directory/cosmoshub/ibc/core/channel/v1/channels/channel-141/ports/transfer/next_sequence_send',
		])
	})

	it('fail-closes malformed IBC channel envelopes', async () => {
		const {
			getIbcChannel,
		} = await import('$/sources/CosmosSdk/Rest/queries.ts')
		getJson.mockResolvedValueOnce({
			channel: {
				state: 'STATE_OPEN',
			},
		})
		await expect(getIbcChannel({
			portId: 'transfer',
			channelId: 'channel-141',
		})).rejects.toThrow()
	})

	it('lists IBC channels / clients / connections with pagination totals', async () => {
		const {
			getIbcChannels,
			getIbcClientStates,
			getIbcConnections,
		} = await import('$/sources/CosmosSdk/Rest/queries.ts')

		getJson
			.mockResolvedValueOnce({
				channels: [
					{
						state: 'STATE_OPEN',
						ordering: 'ORDER_UNORDERED',
						counterparty: {
							port_id: 'transfer',
							channel_id: 'channel-0',
						},
						connection_hops: [
							'connection-0',
						],
						version: 'ics20-1',
						port_id: 'transfer',
						channel_id: 'channel-141',
					},
				],
				pagination: {
					total: '42',
				},
			})
			.mockResolvedValueOnce({
				client_states: [
					{
						client_id: '07-tendermint-1',
						client_state: {
							'@type': '/ibc.lightclients.tendermint.v1.ClientState',
							chain_id: 'osmosis-1',
							trust_level: {
								numerator: '1',
								denominator: '3',
							},
							trusting_period: '1209600s',
							unbonding_period: '1814400s',
							max_clock_drift: '600s',
							frozen_height: {
								revision_number: '0',
								revision_height: '0',
							},
							latest_height: {
								revision_number: '1',
								revision_height: '9',
							},
						},
					},
				],
				pagination: {
					total: '7',
				},
			})
			.mockResolvedValueOnce({
				connections: [
					{
						id: 'connection-0',
						client_id: '07-tendermint-1',
						state: 'STATE_OPEN',
						counterparty: {
							client_id: '07-tendermint-0',
							connection_id: 'connection-0',
						},
						delay_period: '0',
					},
				],
				pagination: {
					total: '3',
				},
			})

		await expect(getIbcChannels({
			limit: 16,
		})).resolves.toMatchObject({
			channels: [
				{
					channel_id: 'channel-141',
				},
			],
			pagination: {
				total: '42',
			},
		})
		await expect(getIbcClientStates({
			limit: 16,
		})).resolves.toMatchObject({
			client_states: [
				{
					client_id: '07-tendermint-1',
				},
			],
		})
		await expect(getIbcConnections({
			limit: 16,
		})).resolves.toMatchObject({
			connections: [
				{
					id: 'connection-0',
				},
			],
		})

		expect(getJson.mock.calls.map((call) => call[0])).toEqual([
			'https://rest.cosmos.directory/cosmoshub/ibc/core/channel/v1/channels?pagination.limit=16&pagination.count_total=true',
			'https://rest.cosmos.directory/cosmoshub/ibc/core/client/v1/client_states?pagination.limit=16&pagination.count_total=true',
			'https://rest.cosmos.directory/cosmoshub/ibc/core/connection/v1/connections?pagination.limit=16&pagination.count_total=true',
		])
	})

	it('lists connection channels and client connections', async () => {
		const {
			getIbcClientConnections,
			getIbcConnectionChannels,
		} = await import('$/sources/CosmosSdk/Rest/queries.ts')

		getJson
			.mockResolvedValueOnce({
				channels: [
					{
						state: 'STATE_OPEN',
						ordering: 'ORDER_UNORDERED',
						counterparty: {
							port_id: 'transfer',
							channel_id: 'channel-0',
						},
						connection_hops: [
							'connection-0',
						],
						version: 'ics20-1',
						port_id: 'transfer',
						channel_id: 'channel-141',
					},
				],
				pagination: {
					total: '5',
				},
			})
			.mockResolvedValueOnce({
				connection_paths: [
					'connections/connection-0',
				],
			})

		await expect(getIbcConnectionChannels({
			connectionId: 'connection-0',
			limit: 16,
		})).resolves.toMatchObject({
			channels: [
				{
					channel_id: 'channel-141',
				},
			],
			pagination: {
				total: '5',
			},
		})
		await expect(getIbcClientConnections({
			clientId: '07-tendermint-1',
		})).resolves.toEqual({
			connection_paths: [
				'connections/connection-0',
			],
		})

		expect(getJson.mock.calls.map((call) => call[0])).toEqual([
			'https://rest.cosmos.directory/cosmoshub/ibc/core/channel/v1/connections/connection-0/channels?pagination.limit=16&pagination.count_total=true',
			'https://rest.cosmos.directory/cosmoshub/ibc/core/connection/v1/client_connections/07-tendermint-1',
		])
	})
})
