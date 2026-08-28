import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'

import {
	EntityMetaKey,
	entity,
	facet,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entitySelectorKey,
	entitySelectorsFromFields,
	indexSchema,
	validateEntitySelector,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntitySelectorForSelectorName,
	type Schema,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { NetworkNamespace, networks } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

enum ParentSelector {
	Slug = 'slug',
	Caip2 = 'caip2',
}

enum ChildSelector {
	ParentSlot = 'parentSlot',
	ParentHash = 'parentHash',
}

const Parent = {
	entityType: 'Parent',
	label: 'Parent',
	labelPlural: 'Parents',
	selectors: [
		{
			name: ParentSelector.Slug,
			fields: ['slug'],
		},
		{
			name: ParentSelector.Caip2,
			fields: ['caip2'],
		},
	],
	fields: [
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string.lower'),
			cardinality: EntityFieldCardinality.One,
			normalize: (value) => arktype('string.lower')(value),
		},
		{
			name: 'caip2',
			type: EntityFieldType.Primitive,
			primitiveType: arktype({
				namespace: 'string',
				reference: 'string',
			}),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

const Child = {
	entityType: 'Child',
	label: 'Child',
	labelPlural: 'Children',
	selectors: [
		{
			name: ChildSelector.ParentSlot,
			fields: [
				'$parent',
				'slot',
			],
		},
		{
			name: ChildSelector.ParentHash,
			fields: [
				'$parent',
				'hash',
			],
		},
	],
	fields: [
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: Parent.entityType,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string.lower'),
			cardinality: EntityFieldCardinality.One,
			normalize: (value) => arktype('string.lower')(value),
		},
	],
} as const satisfies EntityDefinition

const fixtureSchema = [
	Parent,
	Child,
] as const satisfies Schema

const completeChildSelector = {
	$parent: {
		slug: 'ethereum',
	},
	slot: 1n,
} satisfies EntitySelectorForSelectorName<
	typeof fixtureSchema,
	typeof Child.entityType,
	ChildSelector.ParentSlot
>

// @ts-expect-error Every field in the chosen selector tuple is required.
const incompleteChildSelector: EntitySelectorForSelectorName<
	typeof fixtureSchema,
	typeof Child.entityType,
	ChildSelector.ParentSlot
> = {
	slot: 1n,
}

void completeChildSelector
void incompleteChildSelector

const selectorIsConcrete = (
	entityDefinition: EntityDefinition,
	selectorFields: readonly string[]
) => (
	selectorFields.length > 0
	&& selectorFields.every((fieldName) => entityDefinition.fields
		.some((fieldDefinition) => fieldDefinition.name === fieldName))
)

const OptionalSelectorCardinality = entity({
	entityType: 'OptionalSelectorCardinality',
	labels: {
		singular: 'optional selector cardinality',
		plural: 'optional selector cardinalities',
	},
})({
	optionalId: {
		cardinality: EntityFieldCardinality.ZeroOrOne,
		primitiveType: arktype('string'),
	},
	$optionalParent: {
		cardinality: EntityFieldCardinality.ZeroOrOne,
		entityType: Parent.entityType,
	},
})({
	selectors: {
		Optional: ['optionalId'],
		OptionalParent: ['$optionalParent'],
	},
})

// @ts-expect-error A chosen selector field cannot be explicitly undefined.
const undefinedOptionalSelector: EntitySelectorForSelectorName<
	[
		typeof OptionalSelectorCardinality,
	],
	typeof OptionalSelectorCardinality.entityType,
	'Optional'
> = {
	optionalId: undefined,
}

// @ts-expect-error Every field in the chosen optional selector tuple is required.
const missingOptionalSelector: EntitySelectorForSelectorName<
	[
		typeof OptionalSelectorCardinality,
	],
	typeof OptionalSelectorCardinality.entityType,
	'Optional'
> = {}

// @ts-expect-error A chosen entity-reference selector field cannot be explicitly undefined.
const undefinedOptionalParentSelector: EntitySelectorForSelectorName<
	[
		typeof OptionalSelectorCardinality,
	],
	typeof OptionalSelectorCardinality.entityType,
	'OptionalParent'
> = {
	$optionalParent: undefined,
}

void undefinedOptionalSelector
void missingOptionalSelector
void undefinedOptionalParentSelector

entity({
	entityType: 'InvalidSelectorCardinality',
	labels: {
		singular: 'invalid selector cardinality',
		plural: 'invalid selector cardinalities',
	},
})({
	manyId: {
		cardinality: EntityFieldCardinality.Many,
		primitiveType: arktype('string'),
	},
})({
	selectors: {
		// @ts-expect-error Selector identity fields must be singular.
		Invalid: ['manyId'],
	},
})

entity({
	entityType: 'InvalidEmptySelector',
	labels: {
		singular: 'invalid empty selector',
		plural: 'invalid empty selectors',
	},
})({
	id: {
		cardinality: EntityFieldCardinality.One,
		primitiveType: arktype('string'),
	},
})({
	selectors: {
		// @ts-expect-error Selector identity tuples must be nonempty.
		Invalid: [],
	},
})

const InferredFieldKinds = entity({
	entityType: 'InferredFieldKinds',
	labels: {
		singular: 'inferred field kinds',
		plural: 'inferred field kinds',
	},
})({
	id: {
		primitiveType: arktype('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: Parent.entityType,
		cardinality: EntityFieldCardinality.One,
	},
	$$children: {
		entityType: Child.entityType,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: ['id'],
		Parent: ['$parent'],
	},
	facets: {
		Nested: facet({
			path: ['id'],
			is: 'nested',
		})({
			nestedId: {
				primitiveType: arktype('string'),
				cardinality: EntityFieldCardinality.One,
			},
			$nestedParent: {
				entityType: Parent.entityType,
				cardinality: EntityFieldCardinality.One,
			},
			$$nestedChildren: {
				entityType: Child.entityType,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
	},
})


describe('entity selectors', () => {
	it('infers literal runtime field kinds from base and nested field names', () => {
		expect([
			...InferredFieldKinds.fields,
			...(InferredFieldKinds.facets?.[0]?.fields ?? []),
		].map(({ name, type }) => [name, type])).toEqual([
			['id', EntityFieldType.Primitive],
			['$parent', EntityFieldType.EntityReference],
			['$$children', EntityFieldType.EntitiesReference],
			['nestedId', EntityFieldType.Primitive],
			['$nestedParent', EntityFieldType.EntityReference],
			['$$nestedChildren', EntityFieldType.EntitiesReference],
		])
	})

	it('matches exact named selector field sets', () => {
		expect(validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				slug: 'ethereum',
			}
			)).toEqual({
				name: ParentSelector.Slug,
				fields: ['slug'],
			})
		expect(validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}
			)).toEqual({
				name: ParentSelector.Caip2,
				fields: ['caip2'],
			})
		expect(() => validateEntitySelector(
			fixtureSchema,
			Parent,
			{}
			)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				slug: 'ethereum',
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}
			)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				slug: 'ethereum',
				extra: 'value',
			}
			)).toThrow(/invalid selector/)
	})

	it('rejects missing and undefined values in chosen ZeroOrOne selector tuples', () => {
		expect(() => validateEntitySelector(
			[
				OptionalSelectorCardinality,
			],
			OptionalSelectorCardinality,
			{
				optionalId: undefined,
			}
		)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			[
				OptionalSelectorCardinality,
			],
			OptionalSelectorCardinality,
			{}
		)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			[
				Parent,
				OptionalSelectorCardinality,
			],
			OptionalSelectorCardinality,
			{
				$optionalParent: undefined,
			}
		)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			[
				Parent,
				OptionalSelectorCardinality,
			],
			OptionalSelectorCardinality,
			{}
		)).toThrow(/invalid selector/)
	})

	it('accepts referenced entity selectors recursively', () => {
		expect(validateEntitySelector(
			fixtureSchema,
			Child,
			{
				$parent: {
					slug: 'ethereum',
				},
				slot: 1n,
			}
			)).toEqual({
				name: ChildSelector.ParentSlot,
				fields: [
					'$parent',
					'slot',
				],
			})
		expect(validateEntitySelector(
			fixtureSchema,
			Child,
			{
				$parent: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				hash: '0xabc',
			}
			)).toEqual({
				name: ChildSelector.ParentHash,
				fields: [
					'$parent',
					'hash',
				],
			})
		expect(() => validateEntitySelector(
			fixtureSchema,
			Child,
			{
				$parent: {
					unknown: 'ethereum',
				},
				slot: 1n,
			}
			)).toThrow(/invalid selector/)
	})

	it('keys equivalent native and projected reference selectors identically', () => {
		expect(entitySelectorKey(
			fixtureSchema,
			Child,
			{
				$parent: {
					[EntityMetaKey.Selector]: {
						slug: 'ethereum',
					},
				},
				slot: 1n,
			}
		)).toBe(entitySelectorKey(
			fixtureSchema,
			Child,
			{
				$parent: {
					slug: 'ethereum',
				},
				slot: 1n,
			}
		))
	})

	it('derives aliases from resolved fields without durability tiers', () => {
		expect(entitySelectorsFromFields(
			fixtureSchema,
			Child,
			{
				$parent: {
					slug: 'ethereum',
				},
				slot: 1n,
			},
			{
				$parent: {
					[EntityMetaKey.Selector]: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				hash: '0xABC',
			}
			)).toEqual([
				{
					$parent: {
						slug: 'ethereum',
					},
					slot: 1n,
				},
				{
					$parent: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					slot: 1n,
				},
				{
					$parent: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					hash: '0xabc',
				},
			])
	})

	it('keeps every concrete selector field represented as an ordinary field definition', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldNames = new Set(entityDefinition.fields.map((fieldDefinition) => fieldDefinition.name))
				return entityDefinition.selectors.flatMap((selector) => (
					selector.fields.flatMap((fieldName) => (
						fieldNames.has(fieldName) ?
							[]
						:
							[`${entityDefinition.entityType}.${selector.name}.${fieldName}`]
					))
				))
			})
			).toEqual([])
	})

	it('keeps every entity backed by at least one concrete selector', () => {
		expect(
			[
				...schema,
				{
					...Parent,
					entityType: 'MissingSelectors',
					selectors: [],
				},
			].flatMap((entityDefinition) => (
				entityDefinition.selectors.length > 0
				&& entityDefinition.selectors.every((selector) => selectorIsConcrete(
					entityDefinition,
					selector.fields
				)) ?
					[]
				:
					[entityDefinition.entityType]
			))
		).toEqual(['MissingSelectors'])
	})

	it('keeps entity field definitions unique within each projection', () => {
		const duplicateFieldAddresses = (definitions: Schema) => indexSchema(definitions)
			.projectionDefinitions.flatMap((projectionDefinition) => {
				const fieldAddressKeys = projectionDefinition.fields.map((fieldDefinition) => entityFieldAddressKey(
					projectionDefinition.entityType,
					projectionDefinition.facetPath,
					fieldDefinition.name
				))
				return projectionDefinition.fields.flatMap((fieldDefinition, fieldIndex) => (
					fieldAddressKeys.indexOf(entityFieldAddressKey(
						projectionDefinition.entityType,
						projectionDefinition.facetPath,
						fieldDefinition.name
					)) === fieldIndex ?
						[]
					:
						[`${projectionDefinition.entityType}.${[
							...projectionDefinition.facetPath,
							fieldDefinition.name,
						].join('.')}`]
				))
			})

		expect(duplicateFieldAddresses(schema)).toEqual([])
		expect(duplicateFieldAddresses([{
			...Parent,
			fields: [
				...Parent.fields,
				Parent.fields[0],
			],
		}])).toEqual(['Parent.slug'])
	})

	it('keeps market quote feed identity separate from OHLC interval identity', () => {
		const marketPrice = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.MarketPrice)
		const marketTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Market_Timestamp)
		const marketTimeIntervalTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Market_TimeInterval_Timestamp)
		if (marketPrice == null || marketTimestamp == null || marketTimeIntervalTimestamp == null)
			throw new Error('missing market timestamp schema definitions')

		expect(marketPrice.selectors.map((selector) => selector.fields)).toEqual([[
			'$market',
		]])
		expect(entityFieldDefinitions(marketPrice).some((fieldDefinition) => (
			fieldDefinition.name === 'feedKey'
			|| fieldDefinition.name === '$network'
		))).toBe(false)
		expect(marketTimestamp.selectors.map((selector) => selector.fields)).toEqual([[
			'$market',
			'timestampMs',
			'feedKey',
		]])
		expect(entityFieldDefinitions(marketTimestamp).find((fieldDefinition) => fieldDefinition.name === 'feedKey')?.cardinality).toBe(EntityFieldCardinality.One)
		expect(marketTimeIntervalTimestamp.selectors.map((selector) => selector.fields)).toEqual([[
			'$market',
			'timeInterval',
			'timestampMs',
		]])
		expect(entityFieldDefinitions(marketTimeIntervalTimestamp).some((fieldDefinition) => fieldDefinition.name === 'feedKey')).toBe(false)
		expect(entityFieldDefinitions(marketTimeIntervalTimestamp).find((fieldDefinition) => fieldDefinition.name === 'close')?.defaultSources).toEqual([
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
		])
		expect(entityFieldDefinitions(marketTimeIntervalTimestamp).find((fieldDefinition) => fieldDefinition.name === '$parentMarket')?.defaultSources).toEqual([
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
		])
		expect(entityFieldDefinitions(marketTimeIntervalTimestamp).find((fieldDefinition) => fieldDefinition.name === 'open')?.defaultSources).not.toContain(Source.Defillama_Rest)
	})

	it('models market legs and venues as canonical entity references', () => {
		const indexes = indexSchema(schema)
		const market = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Market)
		if (market == null)
			throw new Error('missing Market schema definition')

		expect(market.selectors.map((selector) => selector.fields)).toEqual([[
			'$base',
			'$quote',
			'$marketVenue',
			'marketKind',
		]])
		expect(market.fields.find((fieldDefinition) => fieldDefinition.name === '$base')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MarketAsset,
		})
		expect(market.fields.find((fieldDefinition) => fieldDefinition.name === '$quote')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MarketAsset,
		})
		expect(market.fields.find((fieldDefinition) => fieldDefinition.name === '$marketVenue')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MarketVenue,
		})
		expect(indexes.entityFieldDefinitionByEntityTypePathAndName[EntityType.MarketAsset][
			entityFieldAddressKey(EntityType.MarketAsset, ['Coin'], '$coin')
		]).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
		})
		expect(indexes.entityFieldDefinitionByEntityTypePathAndName[EntityType.MarketAsset][
			entityFieldAddressKey(EntityType.MarketAsset, ['Currency'], '$currency')
		]).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Currency,
		})
	})

	it('keeps Solana instruction identity on explicit RPC instruction coordinates', () => {
		const solanaInstruction = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.SolanaInstruction)
		expect(solanaInstruction).toBeDefined()
		const fieldNames = solanaInstruction == null ? [] : entityFieldDefinitions(solanaInstruction).map((fieldDefinition) => fieldDefinition.name)
		const selectors = solanaInstruction?.selectors ?? []

		expect(fieldNames).not.toContain('instructionPath')
		expect(selectors.map((selector) => selector.fields)).toContainEqual([
			'$transaction',
			'instructionKind',
			'indexInTransaction',
		])
		expect(selectors.map((selector) => selector.fields)).toContainEqual([
			'$transaction',
			'instructionKind',
			'indexInTransaction',
			'indexInInstruction',
		])
	})

	it('keeps Nostr article identity on full addressable event coordinates', () => {
		const nostrArticle = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.NostrArticle)
		expect(nostrArticle).toBeDefined()
		const selectors = nostrArticle?.selectors ?? []

		expect(selectors.map((selector) => selector.fields)).toEqual([[
			'kind',
			'pubkey',
			'identifier',
		]])
	})

	it('keeps EVM block identity addressable by number and hash', () => {
		const evmBlock = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmBlock)
		expect(evmBlock).toBeDefined()
		const fieldNames = evmBlock == null ? [] : entityFieldDefinitions(evmBlock).map((fieldDefinition) => fieldDefinition.name)
		const selectors = evmBlock?.selectors ?? []

		expect(fieldNames).toContain('hash')
		expect(fieldNames).toContain('parentHash')
		expect(selectors.map((selector) => selector.fields)).toContainEqual([
			'$network',
			'blockNumber',
		])
		expect(selectors.map((selector) => selector.fields)).toContainEqual([
			'$network',
			'hash',
		])
	})

	it('keeps EVM log parent references structured', () => {
		const evmLog = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmLog)
		expect(evmLog).toBeDefined()
		const fieldNames = evmLog == null ? [] : entityFieldDefinitions(evmLog).map((fieldDefinition) => fieldDefinition.name)

		expect(fieldNames).toContain('$transaction')
		expect(fieldNames).toContain('$block')
	})

	it('keeps selector reference fields recursive through referenced selectors', () => {
		const entityDefinitionByType = Object.fromEntries(schema.map((entityDefinition) => [
			entityDefinition.entityType,
			entityDefinition,
		]))

		const selectorReferenceIssues = (
			entityDefinition: EntityDefinition,
			path: readonly string[]
		): string[] => {
			return entityDefinition.selectors.filter((selector) => selectorIsConcrete(
				entityDefinition,
				selector.fields
			)).flatMap((selector) => (
				selector.fields.flatMap((fieldName) => {
					const fieldDefinition = entityDefinition.fields
						.find((candidate) => candidate.name === fieldName)
					if (fieldDefinition == null)
						return [`${[...path, entityDefinition.entityType, selector.name, fieldName].join('.')}: missing field`]

					if (fieldDefinition.type !== EntityFieldType.EntityReference)
						return []

					const referencedEntityDefinition = entityDefinitionByType[fieldDefinition.entityType]
					// oxlint-disable-next-line typescript/no-unnecessary-condition -- schema fixture coverage checks invalid references at runtime
					if (referencedEntityDefinition == null)
						return [`${[...path, entityDefinition.entityType, selector.name, fieldName].join('.')}: unknown referenced entity ${fieldDefinition.entityType}`]

					if (path.includes(fieldDefinition.entityType))
						return []

					const referencedIssuesBySelector = referencedEntityDefinition.selectors
						.filter((referencedSelector) => selectorIsConcrete(
							referencedEntityDefinition,
							referencedSelector.fields
						))
						.map((referencedSelector) => selectorReferenceIssues(
							{
								...referencedEntityDefinition,
								selectors: [referencedSelector],
							},
							[
								...path,
								entityDefinition.entityType,
								selector.name,
								fieldName,
							]
						))

					return referencedIssuesBySelector.some((referencedIssues) => referencedIssues.length === 0) ?
						[]
					:
						selectorReferenceIssues(
						referencedEntityDefinition,
						[
							...path,
							entityDefinition.entityType,
							selector.name,
							fieldName,
						]
					)
				})
			))
		}

		expect(
			schema.flatMap((entityDefinition) => selectorReferenceIssues(entityDefinition, []))
			).toEqual([])
	})

	it('does not use zero cardinality in concrete schema rows as source-capability metadata', () => {
		expect(
			schema.flatMap((entityDefinition) => (
				entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => (
					fieldDefinition.cardinality === EntityFieldCardinality.Zero ?
						[`${entityDefinition.entityType}.${fieldDefinition.name}`]
					:
						[]
				))
			))
			).toEqual([])
	})

	it('indexes declared projections once by entity type and facet path', () => {
		const indexes = indexSchema([
			entity({
				entityType: 'IndexedEntity',
				labels: {
					singular: 'Indexed entity',
					plural: 'Indexed entities',
				},
			})({
				kind: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Kind: ['kind'],
				},
				facets: {
					Parent: facet({
						path: ['kind'],
						is: 'parent',
					})({
						parentKind: {
							primitiveType: arktype('string'),
							cardinality: EntityFieldCardinality.One,
						},
					})({
						facets: {
							Child: facet({
								path: ['Parent', 'parentKind'],
								is: 'child',
							})({
								childField: {
									primitiveType: arktype('string'),
									cardinality: EntityFieldCardinality.One,
								},
							}),
						},
					}),
				},
			}),
			...schema,
		])

		expect(
			indexes.projectionDefinitionByEntityTypeAndPath[
				entityFieldAddressKey(EntityType.Network, ['Evm'], '')
			]?.condition
		).toEqual({
			path: ['executionModels'],
			includes: 'Evm',
		})
		expect(
			indexes.projectionDefinitionByEntityTypeAndPath[
				entityFieldAddressKey('IndexedEntity', ['Parent', 'Child'], '')
			]?.fields.map((fieldDefinition) => fieldDefinition.name)
		).toContain('childField')
		expect(
			indexes.entityFieldDefinitionByEntityTypePathAndName[EntityType.Network][
				entityFieldAddressKey(EntityType.Network, ['Evm'], '$$blocks')
			]?.name
		).toBe('$$blocks')
		expect(
			indexes.entityFieldDefinitionByEntityTypePathAndName.IndexedEntity[
				entityFieldAddressKey('IndexedEntity', ['Parent', 'Child'], 'childField')
			]?.name
		).toBe('childField')
		expect(
			indexes.projectionDefinitionByEntityTypeAndPath[
				entityFieldAddressKey('IndexedEntity', ['Parent', 'Child'], '')
			]?.directDependencies
		).toEqual([
			{
				entityType: 'IndexedEntity',
				facetPath: ['Parent'],
				fieldName: 'parentKind',
			},
		])
		expect(
			indexes.projectionDefinitionByEntityTypeAndPath[
				entityFieldAddressKey('IndexedEntity', ['Parent', 'Child'], '')
			]?.transitiveDependencies
		).toEqual([
			{
				entityType: 'IndexedEntity',
				facetPath: [],
				fieldName: 'kind',
			},
			{
				entityType: 'IndexedEntity',
				facetPath: ['Parent'],
				fieldName: 'parentKind',
			},
		])
	})

	it('keeps provisional network identifiers out of canonical CAIP-2 modeling', () => {
		const provisionalNetworkNamespaces = new Set([
			NetworkNamespace.Bittensor,
			NetworkNamespace.Elements,
			NetworkNamespace.Hyperliquid,
			NetworkNamespace.Lightning,
			NetworkNamespace.Logos,
			NetworkNamespace.Near,
			NetworkNamespace.Quilibrium,
			NetworkNamespace.ZeroG,
		])
		const provisionalNetworkEntityTypes = new Set([
			EntityType.BittensorNetwork,
			EntityType.ElementsNetwork,
			EntityType.HyperliquidNetwork,
			EntityType.LightningNetwork,
			EntityType.LogosBlockchainNetwork,
			EntityType.NearNetwork,
			EntityType.QuilibriumShard,
			EntityType.ZeroGNetwork,
		])

		expect(
			networks.flatMap((network) => (
				provisionalNetworkNamespaces.has(network.namespace)
				&& network.caip2 != null ?
					[network.slug]
				:
					[]
			))
			).toEqual([])

		expect(
			schema.flatMap((entityDefinition) => (
				provisionalNetworkEntityTypes.has(entityDefinition.entityType) ?
					[
						...entityDefinition.selectors.flatMap((selector) => (
							selector.fields.includes('caip2') ?
								[`${entityDefinition.entityType}.${selector.name}`]
							:
								[]
						)),
						...entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => (
							fieldDefinition.name === 'caip2' ?
								[`${entityDefinition.entityType}.${fieldDefinition.name}`]
							:
								[]
						)),
					]
				:
					[]
			))
			).toEqual([])
	})

	it.each([
		{
			stableEntityType: EntityType.LiquidityPool,
			observationEntityType: EntityType.LiquidityPool_Timestamp,
			stableFields: [
				'sqrtPriceX96',
				'liquidity',
				'tick',
				'volumeUSD',
				'totalValueLockedUSD',
				'marketCapUsd',
				'fdvUsd',
				'baseTokenPriceUsd',
				'baseTokenPriceQuote',
				'priceChangePercent24h',
				'transactionBuys24h',
				'transactionSells24h',
			],
			observationFields: [
				'priceUsd',
				'priceNative',
				'liquidityUsd',
				'volumeUsd24h',
				'marketCapUsd',
				'fdvUsd',
				'priceChangePercent24h',
				'transactionBuys24h',
				'transactionSells24h',
			],
		},
		{
			stableEntityType: EntityType.LiquidityPool,
			observationEntityType: EntityType.LiquidityPool_Block,
			stableFields: ['sqrtPriceX96', 'liquidity', 'tick'],
			observationFields: ['sqrtPriceX96', 'liquidity', 'tick'],
		},
		{
			stableEntityType: EntityType.Coin,
			observationEntityType: EntityType.Coin_Timestamp,
			stableFields: ['marketCapRank', 'marketCapUsd'],
			observationFields: ['marketCapRank', 'marketCapUsd', 'marketCap'],
		},
		{
			stableEntityType: EntityType.Network,
			observationEntityType: EntityType.EvmNetwork_Timestamp,
			stableFields: ['blockHeight', 'gasPrice', 'baseFeePerGas', 'gasUsedRatio'],
			observationFields: ['blockHeight'],
		},
		{
			stableEntityType: EntityType.Network,
			observationEntityType: EntityType.EvmNetwork_GasFee_Block,
			stableFields: ['blockHeight', 'gasPrice', 'baseFeePerGas', 'gasUsedRatio'],
			observationFields: ['legacyGasPrice', 'baseFeePerGas', 'gasUsedRatio'],
		},
		{
			stableEntityType: EntityType.RedditSubreddit,
			observationEntityType: EntityType.RedditSubreddit_Timestamp,
			stableFields: ['subscriberCount', 'activeUserCount'],
			observationFields: ['subscriberCount', 'activeUserCount'],
		},
		{
			stableEntityType: EntityType.RedditLink,
			observationEntityType: EntityType.RedditLink_Timestamp,
			stableFields: ['score', 'commentCount'],
			observationFields: ['score', 'commentCount'],
		},
		{
			stableEntityType: EntityType.RedditComment,
			observationEntityType: EntityType.RedditComment_Timestamp,
			stableFields: ['score'],
			observationFields: ['score'],
		},
		{
			stableEntityType: EntityType.YoutubeChannel,
			observationEntityType: EntityType.YoutubeChannel_Timestamp,
			stableFields: ['subscriberCount', 'videoCount', 'viewCount'],
			observationFields: ['subscriberCount', 'videoCount', 'viewCount'],
		},
		{
			stableEntityType: EntityType.YoutubeVideo,
			observationEntityType: EntityType.YoutubeVideo_Timestamp,
			stableFields: ['viewCount', 'likeCount', 'commentCount'],
			observationFields: ['viewCount', 'likeCount', 'commentCount'],
		},
		{
			stableEntityType: EntityType.YoutubePlaylist,
			observationEntityType: EntityType.YoutubePlaylist_Timestamp,
			stableFields: ['itemCount'],
			observationFields: ['itemCount'],
		},
		{
			stableEntityType: EntityType.YoutubeComment,
			observationEntityType: EntityType.YoutubeComment_Timestamp,
			stableFields: ['likeCount', 'replyCount'],
			observationFields: ['likeCount', 'replyCount'],
		},
		{
			stableEntityType: EntityType.ActivityPubActor,
			observationEntityType: EntityType.ActivityPubActor_Timestamp,
			stableFields: ['followersCount', 'followingCount', 'statusesCount'],
			observationFields: ['followersCount', 'followingCount', 'statusesCount'],
		},
		{
			stableEntityType: EntityType.ActivityPubNote,
			observationEntityType: EntityType.ActivityPubNote_Timestamp,
			stableFields: ['favouriteCount', 'reblogCount', 'replyCount'],
			observationFields: ['favouriteCount', 'reblogCount', 'replyCount'],
		},
		{
			stableEntityType: EntityType.AtprotoActor,
			observationEntityType: EntityType.AtprotoActor_Timestamp,
			stableFields: ['followersCount', 'followsCount', 'postsCount'],
			observationFields: ['followersCount', 'followsCount', 'postsCount'],
		},
		{
			stableEntityType: EntityType.AtprotoPost,
			observationEntityType: EntityType.AtprotoPost_Timestamp,
			stableFields: ['likeCount', 'repostCount', 'replyCount', 'quoteCount'],
			observationFields: ['likeCount', 'repostCount', 'replyCount', 'quoteCount'],
		},
		{
			stableEntityType: EntityType.XUser,
			observationEntityType: EntityType.XUser_Timestamp,
			stableFields: ['followerCount', 'followingCount', 'tweetCount', 'listedCount'],
			observationFields: ['followerCount', 'followingCount', 'tweetCount', 'listedCount'],
		},
		{
			stableEntityType: EntityType.XPost,
			observationEntityType: EntityType.XPost_Timestamp,
			stableFields: ['likeCount', 'retweetCount', 'replyCount', 'quoteCount'],
			observationFields: ['likeCount', 'retweetCount', 'replyCount', 'quoteCount'],
		},
		{
			stableEntityType: EntityType.FarcasterUser,
			observationEntityType: EntityType.FarcasterUser_Timestamp,
			stableFields: ['followerCount', 'followingCount'],
			observationFields: ['followerCount', 'followingCount'],
		},
		{
			stableEntityType: EntityType.FarcasterCast,
			observationEntityType: EntityType.FarcasterCast_Timestamp,
			stableFields: ['likeCount', 'recastCount', 'replyCount'],
			observationFields: ['likeCount', 'recastCount', 'replyCount'],
		},
		{
			stableEntityType: EntityType.FarcasterChannel,
			observationEntityType: EntityType.FarcasterChannel_Timestamp,
			stableFields: ['followerCount', 'memberCount'],
			observationFields: ['followerCount', 'memberCount'],
		},
		{
			stableEntityType: EntityType.LensAccount,
			observationEntityType: EntityType.LensAccount_Timestamp,
			stableFields: ['followerCount', 'followingCount'],
			observationFields: ['followerCount', 'followingCount'],
		},
		{
			stableEntityType: EntityType.LensPost,
			observationEntityType: EntityType.LensPost_Timestamp,
			stableFields: [
				'commentCount',
				'repostCount',
				'quoteCount',
				'bookmarkCount',
				'collectCount',
				'reactionCount',
			],
			observationFields: [
				'commentCount',
				'repostCount',
				'quoteCount',
				'bookmarkCount',
				'collectCount',
				'reactionCount',
			],
		},
	])(
		'keeps $stableEntityType observations on $observationEntityType',
		({ stableEntityType, observationEntityType, stableFields, observationFields }) => {
			const stableEntity = schema.find((definition) => definition.entityType === stableEntityType)
			const observationEntity = schema.find((definition) => definition.entityType === observationEntityType)
			if (stableEntity == null || observationEntity == null)
				throw new Error(`Missing schema rows for ${stableEntityType} and ${observationEntityType}`)

			expect(entityFieldDefinitions(stableEntity).map(({ name }) => name)).not.toEqual(
				expect.arrayContaining(stableFields)
			)
			expect(entityFieldDefinitions(observationEntity).map(({ name }) => name)).toEqual(
				expect.arrayContaining(observationFields)
			)
		}
	)

	it.each([
		{
			entityType: EntityType.ActivityPubActor,
			selectorValue: 'https://mastodon.social/users/Gargron',
			legacyField: 'profileUrl',
		},
		{
			entityType: EntityType.ActivityPubNote,
			selectorValue: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
			legacyField: 'statusUrl',
		},
	])('keeps $entityType federation URI as an explicit selector', ({ entityType, selectorValue, legacyField }) => {
		const definition = schema.find((entityDefinition) => entityDefinition.entityType === entityType)
		if (definition == null)
			throw new Error(`${entityType} schema row missing`)

		expect(definition.selectors.find(({ name }) => name === 'ActivityStreamsUri')?.fields).toEqual([
			'activityStreamsUri',
		])
		expect(validateEntitySelector(schema, definition, {
			activityStreamsUri: selectorValue,
		}).name).toBe('ActivityStreamsUri')
		expect(entityFieldDefinitions(definition).find(({ name }) => name === 'activityStreamsUri')?.cardinality).toBe(
			EntityFieldCardinality.One
		)
		expect(definition.selectors.some(({ fields }) => fields.includes(legacyField))).toBe(false)
	})
	it('models Farcaster connections by opaque connection ID', () => {
		const definition = schema.find(({ entityType }) => (
			entityType === EntityType.BlockheadFarcasterAccountConnection
		))
		if (definition == null)
			throw new Error('Blockhead Farcaster account connection schema missing')

		expect(definition.selectors).toEqual([{
			name: 'ConnectionId',
			fields: ['connectionId'],
		}])
		expect(entityFieldDefinitions(definition).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'connectionId',
				'$user',
				'associationFingerprint',
			])
		)
		expect(entityFieldDefinitions(definition).map(({ name }) => name)).not.toContain('fid')
	})

	it('deepens Directory schemas for Lens feeds/namespaces, Uniswap, Safe, and bridges', () => {
		const lensNetwork = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensNetwork)
		const lensFeed = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensFeed)
		const lensUsernameNamespace = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensUsernameNamespace)
		const uniswapV3Pool = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.UniswapV3Pool)
		const evmContract = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmContract)
		const evmNetworkAccount = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmNetworkAccount)
		const network = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Network)
		if (
			lensNetwork == null
			|| lensFeed == null
			|| lensUsernameNamespace == null
			|| uniswapV3Pool == null
			|| evmContract == null
			|| evmNetworkAccount == null
			|| network == null
		)
			throw new Error('Directory schema rows missing')

		expect(entityFieldDefinitions(lensNetwork).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'$$feeds',
				'$$usernameNamespaces',
			])
		)
		expect(entityFieldDefinitions(lensFeed).find(({ name }) => name === '$$posts')?.defaultSources).toEqual([
			Source.Lens_Graphql,
		])
		expect(entityFieldDefinitions(lensFeed).find(({ name }) => name === '$owner')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
		})
		expect(entityFieldDefinitions(lensUsernameNamespace).find(({ name }) => name === '$$usernames')?.defaultSources).toEqual([
			Source.Lens_Graphql,
		])
		expect(entityFieldDefinitions(lensUsernameNamespace).find(({ name }) => name === '$owner')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
		})

		expect(uniswapV3Pool.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$network',
				'poolAddress',
			],
			[
				'$token0',
				'$token1',
				'fee',
			],
		])

		for (const fieldName of [
			'threshold',
			'nonce',
			'version',
			'$$owners',
			'$$modules',
			'$fallbackHandler',
			'$guard',
		] as const)
			expect(entityFieldDefinitions(evmContract).find(({ name }) => name === fieldName)?.defaultSources).toEqual([
				Source.SafeTransactionService_Rest,
			])

		expect(entityFieldDefinitions(evmNetworkAccount).find(({ name }) => name === '$$transactions')?.defaultSources).toEqual([
			Source.Blockscout_Rest,
			Source.GoldRushFoundational_Rest,
		])
		expect(entityFieldDefinitions(evmNetworkAccount).find(({ name }) => name === '$$queuedTransactions')?.defaultSources).toEqual([
			Source.SafeTransactionService_Rest,
		])
		expect(entityFieldDefinitions(evmNetworkAccount).find(({ name }) => name === '$$nfts')).toMatchObject({
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNft,
			defaultSources: [
				Source.OpenSea_Rest,
			],
		})
		expect(entityFieldDefinitions(evmContract).find(({ name }) => name === '$$nfts')).toMatchObject({
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNft,
			defaultSources: [
				Source.OpenSea_Rest,
			],
		})

		const bridges = entityFieldDefinitions(network).find(({ name }) => name === '$$bridges')
		expect(bridges?.defaultSources).toEqual([
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		])
		expect(bridges?.defaultSources).not.toContain(Source.Lifi_Rest)
	})

	it('registers native OsmosisPool entities off EVM LiquidityPool', () => {
		const osmosisPool = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.OsmosisPool)
		const osmosisPoolAsset = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.OsmosisPoolAsset)
		const osmosisPoolTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.OsmosisPool_Timestamp)
		const liquidityPool = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LiquidityPool)

		if (osmosisPool == null || osmosisPoolAsset == null || osmosisPoolTimestamp == null || liquidityPool == null)
			throw new Error('Osmosis pool schema rows missing')

		expect(osmosisPool.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$network',
				'poolId',
			],
		])
		expect(entityFieldDefinitions(osmosisPool).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'$network',
				'poolId',
				'typeUrl',
				'$$assets',
				'$$timestamps',
			])
		)
		expect(entityFieldDefinitions(osmosisPool).find(({ name }) => name === '$$assets')).toMatchObject({
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.OsmosisPoolAsset,
			defaultSources: [
				Source.Osmosis_LCD_Rest,
			],
		})
		expect(entityFieldDefinitions(osmosisPool).map(({ name }) => name)).not.toEqual(
			expect.arrayContaining([
				'$baseToken',
				'$quoteToken',
				'v4PoolId',
			])
		)
		expect(entityFieldDefinitions(liquidityPool).map(({ name }) => name)).not.toContain('$$assets')

		expect(osmosisPoolAsset.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$pool',
				'denom',
			],
		])
		expect(entityFieldDefinitions(osmosisPoolAsset).find(({ name }) => name === '$pool')).toMatchObject({
			type: EntityFieldType.EntityReference,
			entityType: EntityType.OsmosisPool,
		})

		expect(osmosisPoolTimestamp.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$pool',
				'blockHeight',
				'baseAssetDenom',
				'quoteAssetDenom',
			],
		])
		expect(entityFieldDefinitions(osmosisPoolTimestamp).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'spotPrice',
				'baseAssetDenom',
				'quoteAssetDenom',
				'source',
			])
		)
	})

	it('registers native Hyperliquid Network + timestamp + perp market off EVM LiquidityPool', () => {
		const hyperliquidNetwork = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.HyperliquidNetwork)
		const hyperliquidNetworkTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.HyperliquidNetwork_Timestamp)
		const hyperliquidPerpMarket = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.HyperliquidPerpMarket)
		const liquidityPool = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LiquidityPool)

		if (
			hyperliquidNetwork == null
			|| hyperliquidNetworkTimestamp == null
			|| hyperliquidPerpMarket == null
			|| liquidityPool == null
		)
			throw new Error('Hyperliquid native schema rows missing')

		expect(hyperliquidNetwork.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$network',
			],
		])
		expect(entityFieldDefinitions(hyperliquidNetwork).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'$network',
				'$$timestamps',
				'$$perpMarkets',
			])
		)
		expect(entityFieldDefinitions(hyperliquidNetwork).find(({ name }) => name === '$$timestamps')).toMatchObject({
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidNetwork_Timestamp,
			defaultSources: [
				Source.Hyperliquid,
			],
		})
		expect(entityFieldDefinitions(hyperliquidNetwork).find(({ name }) => name === '$$perpMarkets')).toMatchObject({
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidPerpMarket,
			defaultSources: [
				Source.Hyperliquid,
			],
		})
		expect(entityFieldDefinitions(hyperliquidNetwork).map(({ name }) => name)).not.toEqual(
			expect.arrayContaining([
				'$baseToken',
				'$quoteToken',
				'v4PoolId',
			])
		)
		expect(entityFieldDefinitions(liquidityPool).map(({ name }) => name)).not.toContain('$$perpMarkets')

		expect(hyperliquidNetworkTimestamp.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$network',
				'timestampMs',
				'source',
			],
		])
		expect(entityFieldDefinitions(hyperliquidNetworkTimestamp).find(({ name }) => name === 'perpMarketCount')).toMatchObject({
			type: EntityFieldType.Primitive,
		})
		expect(entityFieldDefinitions(hyperliquidNetworkTimestamp).find(({ name }) => name === 'perpMarketCount')?.defaultSources).toBeUndefined()

		expect(hyperliquidPerpMarket.selectors.map((selector) => selector.fields)).toEqual([
			[
				'$network',
				'coin',
			],
		])
		expect(entityFieldDefinitions(hyperliquidPerpMarket).map(({ name }) => name)).not.toContain('$$timestamps')
		expect(entityFieldDefinitions(hyperliquidPerpMarket).map(({ name }) => name)).toEqual(
			expect.arrayContaining([
				'$network',
				'coin',
				'maxLeverage',
				'onlyIsolated',
			])
		)
	})

	it('deepens BeaconSlot duty list defaultSources with BeaconchaIn_Rest', () => {
		const beaconEpoch = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.BeaconEpoch)
		const beaconSlot = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.BeaconSlot)
		const network = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Network)
		if (beaconEpoch == null || beaconSlot == null || network == null)
			throw new Error('Beacon schema rows missing')

		const dutyDefaultSources = [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		]
		for (const fieldName of [
			'$$beaconAttestations',
			'$$beaconWithdrawals',
			'$$beaconSlashings',
		] as const)
			expect(entityFieldDefinitions(beaconSlot).find(({ name }) => name === fieldName)?.defaultSources).toEqual(dutyDefaultSources)

		expect(entityFieldDefinitions(beaconSlot).find(({ name }) => name === '$$beaconCommittees')?.defaultSources).toBeUndefined()

		expect(entityFieldDefinitions(beaconEpoch).find(({ name }) => name === '$$beaconSlots')?.defaultSources).toEqual(dutyDefaultSources)

		for (const fieldName of [
			'$$beaconAttestations',
			'$$beaconWithdrawals',
			'$$beaconSlashings',
			'$$beaconCommittees',
			'$$beaconSlots',
			'$$beaconValidators',
		] as const)
			expect(entityFieldDefinitions(network).find(({ name }) => name === fieldName)?.defaultSources).toEqual([
				Source.Beacon_Rest,
			])
	})
})
