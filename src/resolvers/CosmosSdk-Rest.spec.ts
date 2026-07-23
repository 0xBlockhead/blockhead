import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
	indexSchema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CosmosAccountSelector } from '$/schema/CosmosAccount.ts'
import { CosmosGovernanceProposalSelector } from '$/schema/CosmosGovernanceProposal.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	getJson,
}))

const { default: cosmosSdk } = await import('$/resolvers/CosmosSdk-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Cosmos SDK endpoint resolver', () => {
	it('projects the declared executable REST endpoint as the field value', async () => {
		const networkSelector = {
			slug: 'cosmos',
		}
		const restEndpoints = await cosmosSdk.resolvers[0].resolve[NetworkSelector.Slug].resolve({
			slug: 'cosmos',
		}, context)

		expect(restEndpoints).toEqual([
			{
				url: 'https://rest.cosmos.directory/cosmoshub',
				transportType: TransportType.Http,
				providerName: 'Cosmos Directory',
			},
		])
		expect(cosmosSdk.resolvers[0].projections.Cosmos.restEndpoints(restEndpoints)).toEqual(restEndpoints)

		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[EntityType.Network][
			entityFieldAddressKey(EntityType.Network, ['Cosmos'], 'restEndpoints')
		]
		if (fieldDefinition == null)
			throw new Error('Cosmos REST endpoints field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.Network],
			parentSelector: networkSelector,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.Network],
				networkSelector
			),
			source: Source.CosmosSdk_Rest,
			fieldDefinition,
			value: cosmosSdk.resolvers[0].projections.Cosmos.restEndpoints(restEndpoints),
		})).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: {
					url: 'https://rest.cosmos.directory/cosmoshub',
					transportType: TransportType.Http,
					providerName: 'Cosmos Directory',
				},
				valueIndex: 0,
			}),
		])
	})
})

describe('Cosmos SDK account list resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('materializes base, module, and vesting accounts with timestamped auth state', async () => {
		getJson.mockResolvedValueOnce({
			accounts: [
				{
					'@type': '/cosmos.auth.v1beta1.BaseAccount',
					address: 'cosmos1base',
					account_number: '3',
					sequence: '5',
				},
				{
					'@type': '/cosmos.auth.v1beta1.ModuleAccount',
					base_account: {
						address: 'cosmos1module',
						account_number: '8',
						sequence: '0',
					},
				},
				{
					'@type': '/cosmos.vesting.v1beta1.ContinuousVestingAccount',
					base_vesting_account: {
						base_account: {
							address: 'cosmos1vesting',
							account_number: '13',
							sequence: '2',
						},
					},
				},
			],
			pagination: {
				total: '3691345',
			},
		})

		await expect(cosmosSdk.resolvers[16].resolve[NetworkSelector.Slug].resolve({
			slug: 'cosmos',
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'cosmos',
					},
					address: 'cosmos1base',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'cosmos',
					},
					address: 'cosmos1module',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'cosmos',
					},
					address: 'cosmos1vesting',
				},
			},
		])
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts?pagination.limit=2&pagination.count_total=true',
			expect.any(Object)
		)
	})

	it('resolves the truthful account cardinality from SDK pagination', async () => {
		getJson.mockResolvedValueOnce({
			accounts: [],
			pagination: {
				total: '3691345',
			},
		})

		await expect(cosmosSdk.resolvers[17].resolve[NetworkSelector.Caip2].resolve({
			caip2: {
				namespace: 'cosmos',
				reference: 'cosmoshub-4',
			},
		}, context)).resolves.toBe(3691345)
	})
})

describe('Cosmos SDK account detail resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('resolves the requested account into its timestamped public auth state', async () => {
		getJson.mockResolvedValueOnce({
			account: {
				'@type': '/cosmos.auth.v1beta1.BaseAccount',
				address: 'cosmos1account',
				account_number: '13',
				sequence: '8',
			},
		}).mockResolvedValueOnce({
			block_id: {
				hash: 'ABC123',
			},
			block: {
				header: {
					height: '1234',
					time: '2026-07-20T12:34:56.000Z',
					proposer_address: 'validator',
				},
				data: {},
			},
		})

		const snapshot = await cosmosSdk.resolvers[4].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}, context)

		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts/cosmos1account',
			expect.any(Object)
		)
		expect(cosmosSdk.resolvers[4].projections.$$timestamps(snapshot)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: {
							slug: 'cosmos',
						},
						address: 'cosmos1account',
					},
					timestampMs: Date.parse('2026-07-20T12:34:56.000Z'),
					source: Source.CosmosSdk_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: 13n,
					[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: 8n,
				},
			},
		])
		const cosmosAccount = {
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}
		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[
			EntityType.CosmosAccount
		][entityFieldAddressKey(EntityType.CosmosAccount, [], '$$timestamps')]
		if (fieldDefinition == null)
			throw new Error('Cosmos account timestamps field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.CosmosAccount],
			parentSelector: cosmosAccount,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.CosmosAccount],
				cosmosAccount
			),
			source: Source.CosmosSdk_Rest,
			fieldDefinition,
			value: cosmosSdk.resolvers[4].projections.$$timestamps(snapshot),
		})).toHaveLength(1)
	})

	it('rejects an unsupported network before transport', async () => {
		await expect(cosmosSdk.resolvers[4].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			address: 'cosmos1account',
		}, context)).rejects.toThrow('CosmosSdk_Rest: unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects missing and mismatched account responses', async () => {
		getJson.mockResolvedValueOnce({})

		await expect(cosmosSdk.resolvers[4].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}, context)).rejects.toThrow('CosmosSdk_Rest: account response is missing')

		getJson.mockResolvedValueOnce({
			account: {
				address: 'cosmos1different',
				account_number: '13',
				sequence: '8',
			},
		})

		await expect(cosmosSdk.resolvers[4].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}, context)).rejects.toThrow('CosmosSdk_Rest: account response does not match the subject')
	})
})

describe('Cosmos SDK governance proposal resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses required canonical x/gov v1 display fields without promoting legacy Any content', async () => {
		getJson
			.mockResolvedValueOnce({
				proposals: [{
					id: '1',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: '',
					summary: '',
					messages: [{
						'@type': '/cosmos.gov.v1beta1.TextProposal',
						content: {
							title: 'Legacy content title',
							description: 'Legacy content summary',
						},
					}],
				}],
			})
			.mockResolvedValueOnce({
				proposal: {
					id: '1',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: '',
					summary: '',
					messages: [{
						'@type': '/cosmos.gov.v1beta1.TextProposal',
						content: {
							title: 'Legacy content title',
							description: 'Legacy content summary',
						},
					}],
				},
			})
			.mockResolvedValueOnce({
				proposal: {
					id: '2',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: 'Canonical title',
					summary: 'Canonical summary',
				},
			})
			.mockResolvedValueOnce({
				proposal: {
					id: '3',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: 'Wrong proposal',
					summary: 'Wrong proposal summary',
				},
			})

		await expect(cosmosSdk.resolvers[20].resolve[NetworkSelector.Slug].resolve({
			slug: 'cosmos',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'cosmos',
				},
				proposalId: '1',
			},
		}])
		await expect(cosmosSdk.resolvers[9].resolve[
			CosmosGovernanceProposalSelector.NetworkProposalId
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '1',
		}, context)).resolves.toMatchObject({
			title: '',
			summary: '',
		})
		await expect(cosmosSdk.resolvers[9].resolve[
			CosmosGovernanceProposalSelector.NetworkProposalId
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '2',
		}, context)).resolves.toMatchObject({
			title: 'Canonical title',
			summary: 'Canonical summary',
		})
		await expect(cosmosSdk.resolvers[9].resolve[
			CosmosGovernanceProposalSelector.NetworkProposalId
		].resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '4',
		}, context)).rejects.toThrow('governance proposal response does not match the subject')
	})
})

describe('Cosmos SDK account transaction resolver', () => {
	const cosmosAccount = {
		$network: {
			slug: 'cosmos',
		},
		address: 'cosmos1account',
	}
	const transactionA = {
		tx: {},
		tx_response: {
			height: '101',
			txhash: 'A',
			code: 0,
			gas_wanted: '100',
			gas_used: '90',
			raw_log: '',
		},
	}
	const transactionB = {
		tx: {
			body: {
				memo: 'account activity',
				timeout_height: '120',
				messages: [
					{
						'@type': '/cosmos.bank.v1beta1.MsgSend',
						from_address: cosmosAccount.address,
					},
				],
			},
			auth_info: {
				fee: {
					amount: [
						{
							denom: 'uatom',
							amount: '2500',
						},
					],
					gas_limit: '200000',
				},
			},
			signatures: ['signature-b'],
		},
		tx_response: {
			height: '100',
			txhash: 'B',
			code: 0,
			codespace: '',
			gas_wanted: '200000',
			gas_used: '150000',
			raw_log: '[]',
			events: [
				{
					type: 'message',
				},
				{
					type: 'transfer',
				},
			],
		},
	}
	const transactionC = {
		tx: {},
		tx_response: {
			height: '98',
			txhash: 'C',
			code: 0,
			gas_wanted: '80',
			gas_used: '70',
			raw_log: '',
		},
	}
	const transactionD = {
		tx: {},
		tx_response: {
			height: '99',
			txhash: 'D',
			code: 5,
			gas_wanted: '75',
			gas_used: '60',
			raw_log: 'failed',
		},
	}

	beforeEach(() => {
		getJson.mockReset()
	})

	it('merges sender and recipient activity into stable card-ready pages', async () => {
		getJson.mockResolvedValueOnce({
			txs: [transactionB.tx, transactionD.tx],
			tx_responses: [transactionB.tx_response, transactionD.tx_response],
			total: '2',
		})
		getJson.mockResolvedValueOnce({
			txs: [transactionA.tx, transactionB.tx, transactionC.tx],
			tx_responses: [transactionA.tx_response, transactionB.tx_response, transactionC.tx_response],
			total: '3',
		})

		const page = await cosmosSdk.resolvers[23].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve(cosmosAccount, {
			...context,
			pagination: {
				limit: 3,
			},
		})
		const transactions = cosmosSdk.resolvers[23].projections.$$transactions.select(
			page,
			cosmosAccount,
			context
		)

		expect(getJson.mock.calls.map(([url]) => url)).toEqual([
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=message.sender%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=3',
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=3',
		])
		expect(transactions.map((transaction) => transaction[EntityMetaKey.Selector].txHash)).toEqual([
			'A',
			'B',
			'D',
		])
		expect(transactions[1]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'code')]: 0,
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'gasUsed')]: 150000n,
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'feeAmount')]: [
				{
					denom: 'uatom',
					amount: 2500n,
				},
			],
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'memo')]: 'account activity',
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'signerAddresses')]: [cosmosAccount.address],
			[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'eventTypes')]: [
				'message',
				'transfer',
			],
		})
		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[
			EntityType.CosmosAccount
		][entityFieldAddressKey(EntityType.CosmosAccount, [], '$$transactions')]
		if (fieldDefinition == null)
			throw new Error('Cosmos account transactions field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.CosmosAccount],
			parentSelector: cosmosAccount,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.CosmosAccount],
				cosmosAccount
			),
			source: Source.CosmosSdk_Rest,
			fieldDefinition,
			value: transactions,
		})).toHaveLength(3)
		expect(cosmosSdk.resolvers[23].projections.$$transactions.continuation(
			page,
			cosmosAccount,
			context
		)).toEqual({
			operation: 'account-transactions',
			target: cosmosAccount.address,
			terminal: false,
			token: '3',
		})

		getJson.mockReset()
		getJson.mockResolvedValueOnce({
			txs: [transactionB.tx, transactionD.tx],
			tx_responses: [transactionB.tx_response, transactionD.tx_response],
			total: '2',
		})
		getJson.mockResolvedValueOnce({
			txs: [transactionA.tx, transactionB.tx, transactionC.tx],
			tx_responses: [transactionA.tx_response, transactionB.tx_response, transactionC.tx_response],
			total: '3',
		})

		const continuedPage = await cosmosSdk.resolvers[23].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve(cosmosAccount, {
			...context,
			pagination: {
				limit: 3,
			},
			providerContinuationToken: '3',
		})
		expect(cosmosSdk.resolvers[23].projections.$$transactions.select(
			continuedPage,
			cosmosAccount,
			context
		).map((transaction) => transaction[EntityMetaKey.Selector].txHash)).toEqual(['C'])
		expect(getJson.mock.calls.map(([url]) => url)).toEqual([
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=message.sender%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=6',
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=6',
		])
		expect(cosmosSdk.resolvers[23].projections.$$transactions.continuation(
			continuedPage,
			cosmosAccount,
			context
		).terminal).toBe(true)
	})

	it('resolves two authoritative empty streams as a terminal empty page', async () => {
		getJson.mockResolvedValue({
			txs: [],
			tx_responses: [],
			total: '0',
		})

		const page = await cosmosSdk.resolvers[23].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve(cosmosAccount, context)

		expect(cosmosSdk.resolvers[23].projections.$$transactions.select(
			page,
			cosmosAccount,
			context
		)).toEqual([])
		expect(cosmosSdk.resolvers[23].projections.$$transactions.continuation(
			page,
			cosmosAccount,
			context
		).terminal).toBe(true)
	})

	it.each([
		{
			response: {
				txs: [{}, {}],
				tx_responses: [transactionA.tx_response, transactionA.tx_response],
				total: '2',
			},
			error: 'invalid duplicate identities',
		},
		{
			response: {
				txs: [{}, {}],
				tx_responses: [
					{
						...transactionA.tx_response,
						height: '-1',
					},
					transactionD.tx_response,
				],
				total: '2',
			},
			error: 'invalid transaction height',
		},
		{
			response: {
				txs: [{}],
				tx_responses: [transactionA.tx_response],
				total: '9007199254740993',
			},
			error: 'invalid transaction search total',
		},
	])('rejects malformed or lossy indexed activity before materialization', async ({ response, error }) => {
		getJson.mockResolvedValueOnce(response).mockResolvedValueOnce({
			txs: [],
			tx_responses: [],
			total: '0',
		})

		await expect(cosmosSdk.resolvers[23].resolve[
			CosmosAccountSelector.NetworkAddress
		].resolve(cosmosAccount, context)).rejects.toThrow(error)
	})
})
