import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'

import {
	conditionalOn,
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityFieldDefinitions,
	entitySelectorsFromFields,
	validateEntitySelector,
	type EntityDefinition,
	type Schema,
} from '$/schema/$schema.ts'
import { NetworkNamespace, networks } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { ActivityPubActorSelector } from '$/schema/ActivityPubActor.ts'
import { ActivityPubNoteSelector } from '$/schema/ActivityPubNote.ts'

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

const selectorFieldIsRequired = (
	fieldDefinition: EntityFieldDefinition | undefined,
	selectorFields: readonly string[],
	entityType?: string
) => (
	fieldDefinition?.cardinality === EntityFieldCardinality.One
	|| (
		fieldDefinition?.name === 'caip2'
		&& (
			entityType === EntityType.Network
			|| entityType === EntityType.SolanaNetwork
		)
	)
	|| (
		fieldDefinition?.when != null
		&& selectorFields.includes(fieldDefinition.when.fieldName)
	)
)

describe('entity selectors', () => {
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

	it('keeps concrete schema rows free of legacy selector surfaces', () => {
		expect(
			readdirSync(new URL('.', import.meta.url))
				.filter((fileName) => (
					fileName.endsWith('.ts')
					&& !fileName.endsWith('.spec.ts')
					&& !fileName.startsWith('$')
					&& fileName !== 'index.ts'
				))
				.flatMap((fileName) => {
					const source = readFileSync(new URL(fileName, import.meta.url), 'utf8')
					return [
						...(/\n\tid:/u.test(source) ? [`${fileName}: top-level id`] : []),
						...(/\n\tidentities:/u.test(source) ? [`${fileName}: identities`] : []),
						...(/\n\tlookups:/u.test(source) ? [`${fileName}: lookups`] : []),
						...(/\n\t\tentityId:/u.test(source) ? [`${fileName}: entityId`] : []),
						...(/\n\t\tdurable:/u.test(source) ? [`${fileName}: durable`] : []),
					]
				})
			).toEqual([])
	})

	it('declares selectors before fields in every concrete schema row', () => {
		expect(
			readdirSync(new URL('.', import.meta.url))
				.filter((fileName) => (
					fileName.endsWith('.ts')
					&& !fileName.endsWith('.spec.ts')
					&& !fileName.startsWith('$')
					&& fileName !== 'index.ts'
				))
				.flatMap((fileName) => {
					const source = readFileSync(new URL(fileName, import.meta.url), 'utf8')
					if (!source.includes('\n\tentityType:'))
						return []

					const entityDefinitionSource = source.slice(source.indexOf('export default'))
					const selectorsIndex = entityDefinitionSource.indexOf('\n\tselectors: [')
					const fieldsIndex = entityDefinitionSource.indexOf('\n\tfields:')
					return (
						selectorsIndex !== -1
						&& fieldsIndex !== -1
						&& selectorsIndex < fieldsIndex ?
							[]
						:
							[`${fileName}: selectors must be declared before fields`]
					)
				})
			).toEqual([])
	})

	it('keeps every concrete selector field represented as an ordinary field definition', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldNames = new Set(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => fieldDefinition.name))
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

	it('keeps every concrete selector field required', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldDefinitionByName = Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
					fieldDefinition.name,
					fieldDefinition,
				]))
				return entityDefinition.selectors.flatMap((selector) => (
					selector.fields.flatMap((fieldName) => (
						selectorFieldIsRequired(
							fieldDefinitionByName[fieldName],
							selector.fields,
							entityDefinition.entityType
						) ?
							[]
						:
							[`${entityDefinition.entityType}.${selector.name}.${fieldName}`]
					))
				))
			})
			).toEqual([])
	})

	it('keeps entity field definitions unique by name', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldNames = entityFieldDefinitions(entityDefinition).map((fieldDefinition) => fieldDefinition.name)
				return fieldNames.flatMap((fieldName, fieldIndex) => (
					fieldNames.indexOf(fieldName) === fieldIndex ?
						[]
					:
						[`${entityDefinition.entityType}.${fieldName}`]
				))
			})
		).toEqual([])
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
			return entityDefinition.selectors.flatMap((selector) => (
				selector.fields.flatMap((fieldName) => {
					const fieldDefinition = entityFieldDefinitions(entityDefinition)
						.find((candidate) => candidate.name === fieldName)
					if (fieldDefinition == null)
						return [`${[...path, entityDefinition.entityType, selector.name, fieldName].join('.')}: missing field`]

					if (!selectorFieldIsRequired(
						fieldDefinition,
						selector.fields,
						entityDefinition.entityType
					))
						return [`${[...path, entityDefinition.entityType, selector.name, fieldName].join('.')}: selector field must be required`]

					if (fieldDefinition.type !== EntityFieldType.EntityReference)
						return []

					const referencedEntityDefinition = entityDefinitionByType[fieldDefinition.entityType]
					// oxlint-disable-next-line typescript/no-unnecessary-condition -- schema fixture coverage checks invalid references at runtime
					if (referencedEntityDefinition == null)
						return [`${[...path, entityDefinition.entityType, selector.name, fieldName].join('.')}: unknown referenced entity ${fieldDefinition.entityType}`]

					if (path.includes(fieldDefinition.entityType))
						return []

					return selectorReferenceIssues(
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

	it('keeps concrete conditional discriminators required and primitive', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldDefinitionByName = Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
					fieldDefinition.name,
					fieldDefinition,
				]))
				return entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => {
					if (fieldDefinition.when == null)
						return []

					const discriminator = fieldDefinitionByName[fieldDefinition.when.fieldName]
					return (
						discriminator.type === EntityFieldType.Primitive
						&& discriminator.cardinality === EntityFieldCardinality.One ?
							[]
						:
							[`${entityDefinition.entityType}.${fieldDefinition.name}.${fieldDefinition.when.fieldName}`]
					)
				})
			})
			).toEqual([])
	})

	it('keeps indexed conditional discriminators on required primitive arrays', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const fieldDefinitionByName = Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
					fieldDefinition.name,
					fieldDefinition,
				]))
				return entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => {
					if (fieldDefinition.when?.itemIndex == null)
						return []

					const discriminator = fieldDefinitionByName[fieldDefinition.when.fieldName]
					return (
						discriminator.type === EntityFieldType.Primitive
						&& discriminator.cardinality === EntityFieldCardinality.One
						&& !(discriminator.primitiveType(fieldDefinition.when.values) instanceof arktype.errors)
						&& Number.isInteger(fieldDefinition.when.itemIndex)
						&& fieldDefinition.when.itemIndex >= 0 ?
							[]
						:
							[`${entityDefinition.entityType}.${fieldDefinition.name}.${fieldDefinition.when.fieldName}`]
					)
				})
			})
			).toEqual([])
	})

	it('rejects invalid indexed conditional discriminator positions at construction', () => {
		const fields = [
			{
				name: 'topics',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string').array(),
				cardinality: EntityFieldCardinality.One,
			},
		] as const satisfies readonly EntityFieldDefinition[]
		const values = [
			'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
		] as const

		expect(() => conditionalOn(
			fields,
			'topics',
			values,
			{
				itemIndex: -1,
			}
		)).toThrow(/Invalid conditional field index/)

		expect(() => conditionalOn(
			fields,
			'topics',
			values,
			{
				itemIndex: 0.5,
			}
		)).toThrow(/Invalid conditional field index/)
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
			NetworkNamespace.Tron,
			NetworkNamespace.ZeroG,
		])
		const provisionalNetworkEntityTypes = new Set([
			EntityType.BittensorNetwork,
			EntityType.ElementsNetwork,
			EntityType.HyperliquidNetwork,
			EntityType.LightningNetwork,
			EntityType.LogosZone,
			EntityType.NearNetwork,
			EntityType.QuilibriumNetwork,
			EntityType.TronNetwork,
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

		expect(
			[
				'src/views/LightningNodeView.svelte',
				'src/views/LightningChannelView.svelte',
			].flatMap((filePath) => {
				const contents = readFileSync(filePath, 'utf8')

				return [
					...(
						contents.includes('networkSlug') ?
							[`${filePath}:networkSlug`]
						:
							[]
					),
					...(
						contents.includes('selector.$network.caip2') ?
							[`${filePath}:selector.$network.caip2`]
						:
							[]
					),
				]
			})
			).toEqual([])
	})

	it('keeps migrated liquidity pool observations off stable pool headers', () => {
		const liquidityPool = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LiquidityPool)
		const liquidityPoolTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LiquidityPool_Timestamp)
		const liquidityPoolBlock = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LiquidityPool_Block)

		if (liquidityPool == null || liquidityPoolTimestamp == null || liquidityPoolBlock == null)
			throw new Error('Liquidity pool schema rows missing')

		expect(entityFieldDefinitions(liquidityPool).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
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
			])
		)
		expect(entityFieldDefinitions(liquidityPoolTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'priceUsd',
				'priceNative',
				'liquidityUsd',
				'volumeUsd24h',
				'marketCapUsd',
				'fdvUsd',
				'priceChangePercent24h',
				'transactionBuys24h',
				'transactionSells24h',
			])
		)
		expect(entityFieldDefinitions(liquidityPoolBlock).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'sqrtPriceX96',
				'liquidity',
				'tick',
			])
		)
	})

	it('keeps migrated coin observations off stable coin headers', () => {
		const coin = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Coin)
		const coinTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.Coin_Timestamp)

		if (coin == null || coinTimestamp == null)
			throw new Error('Coin schema rows missing')

		expect(entityFieldDefinitions(coin).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'marketCapRank',
				'marketCapUsd',
			])
		)
		expect(entityFieldDefinitions(coinTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'marketCapRank',
				'marketCapUsd',
				'marketCap',
			])
		)
	})

	it('keeps migrated EVM head and gas observations off stable network headers', () => {
		const evmNetwork = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmNetwork)
		const evmNetworkTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmNetwork_Timestamp)
		const evmNetworkGasFeeBlock = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.EvmNetwork_GasFee_Block)

		if (evmNetwork == null || evmNetworkTimestamp == null || evmNetworkGasFeeBlock == null)
			throw new Error('EVM network schema rows missing')

		expect(entityFieldDefinitions(evmNetwork).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'blockHeight',
				'gasPrice',
				'baseFeePerGas',
				'gasUsedRatio',
			])
		)
		expect(entityFieldDefinitions(evmNetworkTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'blockHeight',
			])
		)
		expect(entityFieldDefinitions(evmNetworkGasFeeBlock).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'legacyGasPrice',
				'baseFeePerGas',
				'gasUsedRatio',
			])
		)
	})

	it('keeps migrated Reddit observations off stable content headers', () => {
		const redditSubreddit = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditSubreddit)
		const redditSubredditTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditSubreddit_Timestamp)
		const redditLink = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditLink)
		const redditLinkTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditLink_Timestamp)
		const redditComment = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditComment)
		const redditCommentTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.RedditComment_Timestamp)

		if (
			redditSubreddit == null
			|| redditSubredditTimestamp == null
			|| redditLink == null
			|| redditLinkTimestamp == null
			|| redditComment == null
			|| redditCommentTimestamp == null
		)
			throw new Error('Reddit schema rows missing')

		expect(entityFieldDefinitions(redditSubreddit).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'subscriberCount',
				'activeUserCount',
			])
		)
		expect(entityFieldDefinitions(redditSubredditTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'subscriberCount',
				'activeUserCount',
			])
		)
		expect(entityFieldDefinitions(redditLink).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'score',
				'commentCount',
			])
		)
		expect(entityFieldDefinitions(redditLinkTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'score',
				'commentCount',
			])
		)
		expect(entityFieldDefinitions(redditComment).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'score',
			])
		)
		expect(entityFieldDefinitions(redditCommentTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'score',
			])
		)
	})

	it('keeps migrated YouTube channel observations off stable channel headers', () => {
		const youTubeChannel = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeChannel)
		const youTubeChannelTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeChannel_Timestamp)

		if (youTubeChannel == null || youTubeChannelTimestamp == null)
			throw new Error('YouTube channel schema rows missing')

		expect(entityFieldDefinitions(youTubeChannel).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'subscriberCount',
				'videoCount',
				'viewCount',
			])
		)
		expect(entityFieldDefinitions(youTubeChannelTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'subscriberCount',
				'videoCount',
				'viewCount',
			])
		)
	})

	it('keeps migrated YouTube video observations off stable video headers', () => {
		const youTubeVideo = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeVideo)
		const youTubeVideoTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeVideo_Timestamp)

		if (youTubeVideo == null || youTubeVideoTimestamp == null)
			throw new Error('YouTube video schema rows missing')

		expect(entityFieldDefinitions(youTubeVideo).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'viewCount',
				'likeCount',
				'commentCount',
			])
		)
		expect(entityFieldDefinitions(youTubeVideoTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'viewCount',
				'likeCount',
				'commentCount',
			])
		)
	})

	it('keeps migrated YouTube playlist observations off stable playlist headers', () => {
		const youTubePlaylist = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubePlaylist)
		const youTubePlaylistTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubePlaylist_Timestamp)

		if (youTubePlaylist == null || youTubePlaylistTimestamp == null)
			throw new Error('YouTube playlist schema rows missing')

		expect(entityFieldDefinitions(youTubePlaylist).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'itemCount',
			])
		)
		expect(entityFieldDefinitions(youTubePlaylistTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'itemCount',
			])
		)
	})

	it('keeps migrated YouTube comment observations off stable comment headers', () => {
		const youTubeComment = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeComment)
		const youTubeCommentTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.YouTubeComment_Timestamp)

		if (youTubeComment == null || youTubeCommentTimestamp == null)
			throw new Error('YouTube comment schema rows missing')

		expect(entityFieldDefinitions(youTubeComment).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'likeCount',
				'replyCount',
			])
		)
		expect(entityFieldDefinitions(youTubeCommentTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'likeCount',
				'replyCount',
			])
		)
	})

	it('keeps migrated ActivityPub actor observations off stable actor headers', () => {
		const activityPubActor = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubActor)
		const activityPubActorTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubActor_Timestamp)

		if (activityPubActor == null || activityPubActorTimestamp == null)
			throw new Error('ActivityPub actor schema rows missing')

		expect(entityFieldDefinitions(activityPubActor).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followersCount',
				'followingCount',
				'statusesCount',
			])
		)
		expect(entityFieldDefinitions(activityPubActorTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followersCount',
				'followingCount',
				'statusesCount',
			])
		)
	})

	it('keeps ActivityPub actor federation URI as an explicit selector', () => {
		const activityPubActor = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubActor)
		if (activityPubActor == null)
			throw new Error('ActivityPub actor schema row missing')

		expect(activityPubActor.selectors.find((selector) => selector.name === ActivityPubActorSelector.ActivityStreamsUri)?.fields).toEqual([
			'activityStreamsUri',
		])
		expect(validateEntitySelector(schema, activityPubActor, {
			activityStreamsUri: 'https://mastodon.social/users/Gargron',
		}).name).toBe(ActivityPubActorSelector.ActivityStreamsUri)
		expect(entityFieldDefinitions(activityPubActor).find((fieldDefinition) => fieldDefinition.name === 'activityStreamsUri')?.cardinality).toBe(EntityFieldCardinality.One)
		expect(activityPubActor.selectors.some((selector) => selector.fields.includes('profileUrl'))).toBe(false)
	})

	it('keeps migrated ActivityPub note observations off stable note headers', () => {
		const activityPubNote = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubNote)
		const activityPubNoteTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubNote_Timestamp)

		if (activityPubNote == null || activityPubNoteTimestamp == null)
			throw new Error('ActivityPub note schema rows missing')

		expect(entityFieldDefinitions(activityPubNote).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'favouriteCount',
				'reblogCount',
				'replyCount',
			])
		)
		expect(entityFieldDefinitions(activityPubNoteTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'favouriteCount',
				'reblogCount',
				'replyCount',
			])
		)
	})

	it('keeps ActivityPub note federation URI as an explicit selector', () => {
		const activityPubNote = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.ActivityPubNote)
		if (activityPubNote == null)
			throw new Error('ActivityPub note schema row missing')

		expect(activityPubNote.selectors.find((selector) => selector.name === ActivityPubNoteSelector.ActivityStreamsUri)?.fields).toEqual([
			'activityStreamsUri',
		])
		expect(validateEntitySelector(schema, activityPubNote, {
			activityStreamsUri: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
		}).name).toBe(ActivityPubNoteSelector.ActivityStreamsUri)
		expect(entityFieldDefinitions(activityPubNote).find((fieldDefinition) => fieldDefinition.name === 'activityStreamsUri')?.cardinality).toBe(EntityFieldCardinality.One)
		expect(activityPubNote.selectors.some((selector) => selector.fields.includes('statusUrl'))).toBe(false)
	})

	it('keeps migrated Atproto observations off stable actor and post headers', () => {
		const atprotoActor = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.AtprotoActor)
		const atprotoActorTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.AtprotoActor_Timestamp)
		const atprotoPost = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.AtprotoPost)
		const atprotoPostTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.AtprotoPost_Timestamp)

		if (atprotoActor == null || atprotoActorTimestamp == null || atprotoPost == null || atprotoPostTimestamp == null)
			throw new Error('Atproto schema rows missing')

		expect(entityFieldDefinitions(atprotoActor).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followersCount',
				'followsCount',
				'postsCount',
			])
		)
		expect(entityFieldDefinitions(atprotoActorTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followersCount',
				'followsCount',
				'postsCount',
			])
		)
		expect(entityFieldDefinitions(atprotoPost).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'likeCount',
				'repostCount',
				'replyCount',
				'quoteCount',
			])
		)
		expect(entityFieldDefinitions(atprotoPostTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'likeCount',
				'repostCount',
				'replyCount',
				'quoteCount',
			])
		)
	})

	it('keeps migrated X observations off stable user and post headers', () => {
		const xUser = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.XUser)
		const xUserTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.XUser_Timestamp)
		const xPost = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.XPost)
		const xPostTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.XPost_Timestamp)

		if (xUser == null || xUserTimestamp == null || xPost == null || xPostTimestamp == null)
			throw new Error('X schema rows missing')

		expect(entityFieldDefinitions(xUser).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
				'tweetCount',
				'listedCount',
			])
		)
		expect(entityFieldDefinitions(xUserTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
				'tweetCount',
				'listedCount',
			])
		)
		expect(entityFieldDefinitions(xPost).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'likeCount',
				'retweetCount',
				'replyCount',
				'quoteCount',
			])
		)
		expect(entityFieldDefinitions(xPostTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'likeCount',
				'retweetCount',
				'replyCount',
				'quoteCount',
			])
		)
	})

	it('keeps migrated Farcaster observations off stable user, cast, and channel headers', () => {
		const farcasterUser = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterUser)
		const farcasterUserTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterUser_Timestamp)
		const farcasterCast = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterCast)
		const farcasterCastTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterCast_Timestamp)
		const farcasterChannel = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterChannel)
		const farcasterChannelTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.FarcasterChannel_Timestamp)

		if (
			farcasterUser == null
			|| farcasterUserTimestamp == null
			|| farcasterCast == null
			|| farcasterCastTimestamp == null
			|| farcasterChannel == null
			|| farcasterChannelTimestamp == null
		)
			throw new Error('Farcaster schema rows missing')

		expect(entityFieldDefinitions(farcasterUser).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
			])
		)
		expect(entityFieldDefinitions(farcasterUserTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
			])
		)
		expect(entityFieldDefinitions(farcasterCast).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'likeCount',
				'recastCount',
				'replyCount',
			])
		)
		expect(entityFieldDefinitions(farcasterCastTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'likeCount',
				'recastCount',
				'replyCount',
			])
		)
		expect(entityFieldDefinitions(farcasterChannel).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followerCount',
				'memberCount',
			])
		)
		expect(entityFieldDefinitions(farcasterChannelTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followerCount',
				'memberCount',
			])
		)
	})

	it('keeps migrated Lens observations off stable account and post headers', () => {
		const lensAccount = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensAccount)
		const lensAccountTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensAccount_Timestamp)
		const lensPost = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensPost)
		const lensPostTimestamp = schema.find((entityDefinition) => entityDefinition.entityType === EntityType.LensPost_Timestamp)

		if (lensAccount == null || lensAccountTimestamp == null || lensPost == null || lensPostTimestamp == null)
			throw new Error('Lens schema rows missing')

		expect(entityFieldDefinitions(lensAccount).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
			])
		)
		expect(entityFieldDefinitions(lensAccountTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'followerCount',
				'followingCount',
			])
		)
		expect(entityFieldDefinitions(lensPost).map((fieldDefinition) => fieldDefinition.name)).not.toEqual(
			expect.arrayContaining([
				'commentCount',
				'repostCount',
				'quoteCount',
				'bookmarkCount',
				'collectCount',
				'reactionCount',
			])
		)
		expect(entityFieldDefinitions(lensPostTimestamp).map((fieldDefinition) => fieldDefinition.name)).toEqual(
			expect.arrayContaining([
				'commentCount',
				'repostCount',
				'quoteCount',
				'bookmarkCount',
				'collectCount',
				'reactionCount',
			])
		)
	})
})
