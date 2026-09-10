import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

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
import { TransportType } from '$/constants/TransportType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/lib/http.ts')>(),
	getJson,
	corsFetch: async (
		url: string,
		options: {
			init?: RequestInit
		}
	) => new Response(JSON.stringify((await getJson(url, {
		init: options.init,
	})) ?? null)),
}))

const { default: cosmosSdk } = await import('$/resolvers/CosmosSdk-Rest.ts')

const context = {
	...createResolverContext(),
	pagination: {
		limit: 2,
	},
}

const latestBlock = {
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
}


const restEndpointsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& 'restEndpoints' in resolver.projections.Cosmos
))
const networkTimestampsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))
const accountsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$accounts' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$accounts === 'object'
	&& resolver.projections.Cosmos.$$accounts != null
	&& 'select' in resolver.projections.Cosmos.$$accounts
))
const accountDetailResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosAccount
	&& 'NetworkAddress' in resolver.resolve
	&& '$$timestamps' in resolver.projections
))
const validatorResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosValidator
	&& 'NetworkOperatorAddress' in resolver.resolve
	&& 'moniker' in resolver.projections
))
const validatorsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$validators' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$validators === 'object'
	&& resolver.projections.Cosmos.$$validators != null
	&& 'select' in resolver.projections.Cosmos.$$validators
))
const messageResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosMessage
	&& 'TransactionIndexInTransaction' in resolver.resolve
))
const transactionResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosTransaction
	&& 'NetworkTxHash' in resolver.resolve
))
const governanceProposalsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$governanceProposals' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$governanceProposals === 'object'
	&& resolver.projections.Cosmos.$$governanceProposals != null
	&& 'select' in resolver.projections.Cosmos.$$governanceProposals
))
const governanceProposalResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosGovernanceProposal
	&& 'NetworkProposalId' in resolver.resolve
))
const accountTransactionsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosAccount
	&& 'NetworkAddress' in resolver.resolve
	&& '$$transactions' in resolver.projections
	&& typeof resolver.projections.$$transactions === 'object'
	&& resolver.projections.$$transactions != null
	&& 'select' in resolver.projections.$$transactions
))

if (
	restEndpointsResolver == null
	|| networkTimestampsResolver == null
	|| accountsListResolver == null
	|| accountDetailResolver == null
	|| validatorResolver == null
	|| validatorsListResolver == null
	|| messageResolver == null
	|| transactionResolver == null
	|| governanceProposalsListResolver == null
	|| governanceProposalResolver == null
	|| accountTransactionsResolver == null
)
	throw new Error('CosmosSdk REST resolvers missing')

describe('Cosmos SDK endpoint resolver', () => {
	it('keeps paired Network CAIP-2 / Slug selectors exact', () => {
		const pairedResolvers = cosmosSdk.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Caip2' in resolver.resolve
			&& 'Slug' in resolver.resolve
		))
		expect(pairedResolvers.length).toBeGreaterThan(0)

		for (const resolver of pairedResolvers) {
			if (!('Caip2' in resolver.resolve) || !('Slug' in resolver.resolve))
				throw new Error('Cosmos SDK paired network resolver is incomplete')

			expect(resolver.resolve.Caip2.resolve).toBe(resolver.resolve.Slug.resolve)
			expect(resolver.resolve.Caip2.appliesTo).toEqual([{
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			}])
			expect(resolver.resolve.Slug.appliesTo).toEqual([{
				slug: 'cosmos',
			}])
		}
	})

	it('projects the declared executable REST endpoint as the field value', async () => {
		const networkSelector = {
			slug: 'cosmos',
		}
		const restEndpoints = await restEndpointsResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)

		expect(restEndpoints).toEqual([
			{
				url: 'https://rest.cosmos.directory/cosmoshub',
				transportType: TransportType.Http,
				providerName: 'Cosmos Directory',
			},
		])
		expect(restEndpointsResolver.projections.Cosmos.restEndpoints(restEndpoints)).toEqual(restEndpoints)

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
			value: restEndpointsResolver.projections.Cosmos.restEndpoints(restEndpoints),
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

describe('Cosmos SDK network observation discovery', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('discovers the current observation at the authoritative source-head clock', async () => {
		getJson.mockResolvedValueOnce(latestBlock)

		await expect(networkTimestampsResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'cosmos',
				},
				timestampMs: Date.parse(latestBlock.block.header.time),
				source: Source.CosmosSdk_Rest,
			},
		}])
	})

	it('rejects a source head without a valid observation clock', async () => {
		getJson.mockResolvedValueOnce({
			...latestBlock,
			block: {
				...latestBlock.block,
				header: {
					...latestBlock.block.header,
					time: 'not-a-timestamp',
				},
			},
		})

		await expect(networkTimestampsResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)).rejects.toThrow('latest block has an invalid timestamp')
	})
})

describe('Cosmos SDK account list resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('materializes base, module, and vesting account selectors with their authoritative count', async () => {
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

		const snapshot = await accountsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)
		expect(accountsListResolver.projections.Cosmos.$$accounts.select(
			snapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toEqual([
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
		expect(accountsListResolver.projections.Cosmos.$$accounts.resolveCount(
			snapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toBe(3_691_345)
		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts?pagination.limit=2&pagination.count_total=true',
			{
				init: undefined,
			}
		)
	})

	it('resolves the truthful account cardinality from SDK pagination', async () => {
		getJson.mockResolvedValueOnce({
			accounts: [],
			pagination: {
				total: '3691345',
			},
		})

		const snapshot = await accountsListResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'cosmos',
				reference: 'cosmoshub-4',
			},
		}, context)
		expect(accountsListResolver.projections.Cosmos.$$accounts.resolveCount(
			snapshot,
			{
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			},
			context
		)).toBe(3_691_345)
	})

	it('rejects duplicate account identities from a provider page', async () => {
		getJson.mockResolvedValueOnce({
			accounts: [
				{
					address: 'cosmos1duplicate',
				},
				{
					address: 'cosmos1duplicate',
				},
			],
			pagination: {
				total: '2',
			},
		})

		await expect(accountsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)).rejects.toThrow('CosmosSdk_Rest: account list contains duplicate identities')
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
		}).mockResolvedValueOnce(latestBlock)

		const snapshot = await accountDetailResolver.resolve.NetworkAddress.resolve({
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}, context)

		expect(getJson).toHaveBeenCalledWith(
			'https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts/cosmos1account',
			{
				init: undefined,
			}
		)
		expect(accountDetailResolver.projections.$$timestamps(snapshot)).toMatchObject([
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
			value: accountDetailResolver.projections.$$timestamps(snapshot),
		})).toHaveLength(1)
	})

	it('does not register direct account or validator timestamp replay resolvers', () => {
		expect(cosmosSdk.resolvers.some((resolver) => (
			resolver.entityType === EntityType.CosmosAccount_Timestamp
			|| resolver.entityType === EntityType.CosmosValidator_Timestamp
		))).toBe(false)
	})

	it('rejects an unsupported network before transport', async () => {
		await expect(accountDetailResolver.resolve.NetworkAddress.resolve({
			$network: {
				slug: 'ethereum',
			},
			address: 'cosmos1account',
		}, context)).rejects.toThrow('CosmosSdk_Rest: unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects missing and mismatched account responses', async () => {
		getJson.mockResolvedValueOnce({})

		await expect(accountDetailResolver.resolve.NetworkAddress.resolve({
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

		await expect(accountDetailResolver.resolve.NetworkAddress.resolve({
			$network: {
				slug: 'cosmos',
			},
			address: 'cosmos1account',
		}, context)).rejects.toThrow('CosmosSdk_Rest: account response does not match the subject')
	})
})

describe('Cosmos SDK validator timestamp resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('projects enrolled validator description + timestamp leftovers', async () => {
		const validatorWire = {
			validator: {
				operator_address: 'cosmosvaloper1validator',
				consensus_pubkey: {
					'@type': '/cosmos.crypto.ed25519.PubKey',
					key: 'abc',
				},
				description: {
					moniker: 'Validator',
					identity: 'ABCD1234',
					website: 'https://validator.example',
					security_contact: 'sec@validator.example',
					details: 'Hub validator',
				},
				jailed: false,
				status: 'BOND_STATUS_BONDED',
				tokens: '9007199254740993',
				delegator_shares: '9007199254740993.000000000000000000',
				commission: {
					commission_rates: {
						rate: '0.050000000000000000',
						max_rate: '0.200000000000000000',
						max_change_rate: '0.010000000000000000',
					},
					update_time: '2020-01-01T00:00:00Z',
				},
				min_self_delegation: '1',
				unbonding_height: '0',
				unbonding_time: '1970-01-01T00:00:00Z',
			},
		}
		getJson
			.mockResolvedValueOnce(validatorWire)
			.mockResolvedValueOnce(latestBlock)
		const validatorSelector = {
			$network: {
				slug: 'cosmos',
			},
			operatorAddress: 'cosmosvaloper1validator',
		}
		const timestampMs = Date.parse('2026-07-20T12:34:56.000Z')
		const validatorSnapshot = await validatorResolver.resolve.NetworkOperatorAddress.resolve(
			validatorSelector,
			context
		)
		expect(validatorResolver.projections.moniker(validatorSnapshot)).toBe('Validator')
		expect(validatorResolver.projections.identity(validatorSnapshot)).toBe('ABCD1234')
		expect(validatorResolver.projections.website(validatorSnapshot)).toBe('https://validator.example')
		expect(validatorResolver.projections.securityContact(validatorSnapshot)).toBe('sec@validator.example')
		expect(validatorResolver.projections.details(validatorSnapshot)).toBe('Hub validator')
		expect(validatorResolver.projections.$$timestamps(validatorSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$validator: validatorSelector,
				timestampMs,
				source: Source.CosmosSdk_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], '$validator')]: {
					[EntityMetaKey.Selector]: validatorSelector,
				},
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'jailed')]: false,
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'status')]: 'BOND_STATUS_BONDED',
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'tokens')]: 9_007_199_254_740_993n,
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'delegatorShares')]: '9007199254740993.000000000000000000',
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'commissionRate')]: '0.050000000000000000',
				[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], 'minSelfDelegation')]: 1n,
			},
		}])
	})

	it('rejects duplicate validator identities from a provider page', async () => {
		getJson.mockResolvedValueOnce({
			validators: [
				{
					operator_address: 'cosmosvaloper1duplicate',
				},
				{
					operator_address: 'cosmosvaloper1duplicate',
				},
			],
			pagination: {
				total: '2',
			},
		})

		await expect(validatorsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)).rejects.toThrow('CosmosSdk_Rest: validator list contains duplicate identities')
	})
})

describe('Cosmos SDK message resolver', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('projects message fields and wraps each entity reference once', async () => {
		getJson.mockResolvedValueOnce({
			tx: {
				body: {
					messages: [{
						'@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
						sender: 'cosmos1signer',
						contract: 'cosmos1contract',
						funds: [{
							denom: 'uatom',
							amount: '500',
						}],
					}],
				},
			},
			tx_response: {
				txhash: 'ABC123',
				events: [
					{
						type: 'message',
						attributes: [{
							key: 'msg_index',
							value: '0',
						}],
					},
					{
						type: 'execute',
						attributes: [{
							key: 'msg_index',
							value: '0',
						}],
					},
					{
						type: 'transfer',
						attributes: [{
							key: 'msg_index',
							value: '1',
						}],
					},
				],
			},
		})
		const transactionSelector = {
			$network: {
				slug: 'cosmos',
			},
			txHash: 'ABC123',
		}
		const snapshot = await messageResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: transactionSelector,
			indexInTransaction: 0,
		}, context)
		const signer = {
			[EntityMetaKey.Selector]: {
				$network: transactionSelector.$network,
				address: 'cosmos1signer',
			},
		}
		const contract = {
			[EntityMetaKey.Selector]: {
				$network: transactionSelector.$network,
				address: 'cosmos1contract',
			},
		}

		expect(snapshot).toEqual({
			typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
			moduleName: 'wasm',
			messageName: 'MsgExecuteContract',
			signerAddress: 'cosmos1signer',
			senderAddress: 'cosmos1signer',
			contractAddress: 'cosmos1contract',
			funds: [{
				denom: 'uatom',
				amount: 500n,
			}],
			eventTypes: [
				'message',
				'execute',
			],
			$signer: signer,
			$contract: contract,
		})
		expect(messageResolver.projections.typeUrl(snapshot)).toBe('/cosmwasm.wasm.v1.MsgExecuteContract')
		expect(messageResolver.projections.moduleName(snapshot)).toBe('wasm')
		expect(messageResolver.projections.messageName(snapshot)).toBe('MsgExecuteContract')
		expect(messageResolver.projections.signerAddress(snapshot)).toBe('cosmos1signer')
		expect(messageResolver.projections.senderAddress(snapshot)).toBe('cosmos1signer')
		expect(messageResolver.projections.contractAddress(snapshot)).toBe('cosmos1contract')
		expect(messageResolver.projections.funds(snapshot)).toEqual([{
			denom: 'uatom',
			amount: 500n,
		}])
		expect(messageResolver.projections.eventTypes(snapshot)).toEqual([
			'message',
			'execute',
		])
		expect(messageResolver.projections.$signer(snapshot)).toEqual(signer)
		expect(messageResolver.projections.$contract(snapshot)).toEqual(contract)
	})

	it('counts every native message in a transaction body', async () => {
		getJson.mockResolvedValueOnce({
			tx: {
				body: {
					messages: [{
						'@type': '/cosmos.bank.v1beta1.MsgSend',
						from_address: 'cosmos1sender',
					}],
				},
			},
			tx_response: {
				height: '100',
				txhash: 'ABC123',
				code: 0,
				gas_wanted: '100',
				gas_used: '90',
				raw_log: '',
			},
		})

		const snapshot = await transactionResolver.resolve.NetworkTxHash.resolve({
			$network: {
				slug: 'cosmos',
			},
			txHash: 'ABC123',
		}, context)
		expect(transactionResolver.projections.$$messages.select(snapshot)).toHaveLength(1)
		expect(transactionResolver.projections.$$messages.resolveCount(snapshot)).toBe(1)
	})

	it('rejects direct message resolution when @type is missing or empty', async () => {
		const transactionSelector = {
			$network: {
				slug: 'cosmos',
			},
			txHash: 'ABC123',
		}

		getJson.mockResolvedValueOnce({
			tx: {
				body: {
					messages: [{
						sender: 'cosmos1signer',
					}],
				},
			},
			tx_response: {
				txhash: 'ABC123',
			},
		})
		await expect(messageResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: transactionSelector,
			indexInTransaction: 0,
		}, context)).rejects.toThrow('CosmosSdk_Rest: message @type is missing for ABC123:0')

		getJson.mockResolvedValueOnce({
			tx: {
				body: {
					messages: [{
						'@type': '',
						sender: 'cosmos1signer',
					}],
				},
			},
			tx_response: {
				txhash: 'ABC123',
			},
		})
		await expect(messageResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: transactionSelector,
			indexInTransaction: 0,
		}, context)).rejects.toThrow('CosmosSdk_Rest: message @type is missing for ABC123:0')
	})

	it('rejects transaction list rows when a message @type is missing or empty', async () => {
		getJson.mockResolvedValueOnce({
			tx: {
				body: {
					messages: [{
						from_address: 'cosmos1sender',
					}],
				},
			},
			tx_response: {
				height: '100',
				txhash: 'MISSING-TYPE',
				code: 0,
				gas_wanted: '100000',
				gas_used: '90000',
				raw_log: '',
			},
		})

		await expect(transactionResolver.resolve.NetworkTxHash.resolve({
			$network: {
				slug: 'cosmos',
			},
			txHash: 'MISSING-TYPE',
		}, context)).rejects.toThrow('CosmosSdk_Rest: message @type is missing for MISSING-TYPE:0')
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
				pagination: {
					next_key: 'next+/=',
					total: '1',
				},
			})
			.mockResolvedValueOnce(latestBlock)
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
			.mockResolvedValueOnce(latestBlock)
			.mockResolvedValueOnce({
				proposal: {
					id: '2',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: 'Canonical title',
					summary: 'Canonical summary',
				},
			})
			.mockResolvedValueOnce(latestBlock)
			.mockResolvedValueOnce({
				proposal: {
					id: '3',
					status: 'PROPOSAL_STATUS_VOTING_PERIOD',
					title: 'Wrong proposal',
					summary: 'Wrong proposal summary',
				},
			})

		const proposalSnapshot = await governanceProposalsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)
		expect(governanceProposalsListResolver.projections.Cosmos.$$governanceProposals.select(
			proposalSnapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'cosmos',
				},
				proposalId: '1',
			},
		}])
		expect(governanceProposalsListResolver.projections.Cosmos.$$governanceProposals.resolveCount(
			proposalSnapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toBe(1)
		expect(governanceProposalsListResolver.projections.Cosmos.$$governanceProposals.continuation(
			proposalSnapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toEqual({
			operation: 'cosmos-governance-proposals',
			target: 'cosmos-sdk',
			terminal: false,
			token: 'next+/=',
		})

		await expect(governanceProposalResolver.resolve.NetworkProposalId.resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '1',
		}, context)).resolves.toMatchObject({
			title: '',
			summary: '',
		})
		await expect(governanceProposalResolver.resolve.NetworkProposalId.resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '2',
		}, context)).resolves.toMatchObject({
			title: 'Canonical title',
			summary: 'Canonical summary',
		})
		await expect(governanceProposalResolver.resolve.NetworkProposalId.resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '4',
		}, context)).rejects.toThrow('governance proposal response does not match the subject')

		getJson.mockResolvedValueOnce({
			proposals: [{
				id: '2',
			}],
			pagination: {
				total: '2',
			},
		})
		const terminalProposalSnapshot = await governanceProposalsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, {
			...context,
			providerContinuationToken: 'next+/=',
		})
		expect(governanceProposalsListResolver.projections.Cosmos.$$governanceProposals.continuation(
			terminalProposalSnapshot,
			{
				slug: 'cosmos',
			},
			context
		)).toEqual({
			operation: 'cosmos-governance-proposals',
			target: 'cosmos-sdk',
			terminal: true,
		})
	})

	it('rejects duplicate governance proposal identities from a provider page', async () => {
		getJson.mockResolvedValueOnce({
			proposals: [
				{
					id: '17',
				},
				{
					id: '17',
				},
			],
			pagination: {
				total: '2',
			},
		})

		await expect(governanceProposalsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, context)).rejects.toThrow('CosmosSdk_Rest: governance proposal list contains duplicate identities')
	})

	it('rejects a non-advancing governance proposal continuation', async () => {
		getJson.mockResolvedValueOnce({
			proposals: [{
				id: '17',
			}],
			pagination: {
				next_key: 'opaque-page',
				total: '2',
			},
		})

		await expect(governanceProposalsListResolver.resolve.Slug.resolve({
			slug: 'cosmos',
		}, {
			...context,
			providerContinuationToken: 'opaque-page',
		})).rejects.toThrow('governance proposal continuation did not advance')
	})

	it('embeds the current status without exposing an arbitrary timestamp refetch', async () => {
		getJson.mockResolvedValueOnce(latestBlock).mockResolvedValueOnce({
			proposal: {
				id: '9',
				status: 'PROPOSAL_STATUS_PASSED',
				title: 'Passed proposal',
				summary: 'Passed proposal summary',
				metadata: 'ipfs://bafyproposal',
			},
		})

		const snapshot = await governanceProposalResolver.resolve.NetworkProposalId.resolve({
			$network: {
				slug: 'cosmos',
			},
			proposalId: '9',
		}, context)
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.CosmosGovernanceProposal_Timestamp, [], 'status')]: 'PROPOSAL_STATUS_PASSED',
		})
		expect(governanceProposalResolver.projections.metadata(snapshot)).toBe('ipfs://bafyproposal')
		expect(cosmosSdk.resolvers.some((resolver) => (
			resolver.entityType === EntityType.CosmosGovernanceProposal_Timestamp
		))).toBe(false)
		expect(snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe(
			Date.parse(latestBlock.block.header.time)
		)
		expect(getJson).toHaveBeenCalledTimes(2)
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

		const page = await accountTransactionsResolver.resolve.NetworkAddress.resolve(cosmosAccount, {
			...context,
			pagination: {
				limit: 3,
			},
		})
		const transactions = accountTransactionsResolver.projections.$$transactions.select(
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
		expect(accountTransactionsResolver.projections.$$transactions.continuation(
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

		const continuedPage = await accountTransactionsResolver.resolve.NetworkAddress.resolve(cosmosAccount, {
			...context,
			pagination: {
				limit: 3,
			},
			providerContinuationToken: '3',
		})
		expect(accountTransactionsResolver.projections.$$transactions.select(
			continuedPage,
			cosmosAccount,
			context
		).map((transaction) => transaction[EntityMetaKey.Selector].txHash)).toEqual(['C'])
		expect(getJson.mock.calls.map(([url]) => url)).toEqual([
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=message.sender%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=6',
			'https://rest.cosmos.directory/cosmoshub/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27cosmos1account%27&order_by=ORDER_BY_DESC&page=1&limit=6',
		])
		expect(accountTransactionsResolver.projections.$$transactions.continuation(
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

		const page = await accountTransactionsResolver.resolve.NetworkAddress.resolve(cosmosAccount, context)

		expect(accountTransactionsResolver.projections.$$transactions.select(
			page,
			cosmosAccount,
			context
		)).toEqual([])
		expect(accountTransactionsResolver.projections.$$transactions.continuation(
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

		await expect(accountTransactionsResolver.resolve.NetworkAddress.resolve(
			cosmosAccount,
			context
		)).rejects.toThrow(error)
	})
})
