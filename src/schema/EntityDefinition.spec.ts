import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entitySelectorsFromFields,
	validateEntitySelector,
	type EntityDefinition,
	type Schema,
} from '$/schema/$schema.ts'

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

describe('entity selectors', () => {
	it('matches exact named selector field sets', () => {
		expect(validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				slug: 'ethereum',
			},
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
			},
		)).toEqual({
			name: ParentSelector.Caip2,
			fields: ['caip2'],
		})
		expect(() => validateEntitySelector(
			fixtureSchema,
			Parent,
			{},
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
			},
		)).toThrow(/invalid selector/)
		expect(() => validateEntitySelector(
			fixtureSchema,
			Parent,
			{
				slug: 'ethereum',
				extra: 'value',
			},
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
			},
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
			},
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
			},
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
			},
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
				}),
		).toEqual([])
	})
})
