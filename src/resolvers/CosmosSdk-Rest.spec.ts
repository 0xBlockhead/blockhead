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
