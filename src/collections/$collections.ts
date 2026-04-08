import { QueryClient as _QueryClient } from '@tanstack/query-core'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import {
	BasicIndex,
	createCollection,
	parseLoadSubsetOptions,
} from '@tanstack/svelte-db'
import { stringify, parse } from 'devalue'

import {
	EntityFieldType,
	EntityFieldCardinality,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/$schema.ts'
import type {
	EntityDefinitionForEntityType,
	EntityFieldName,
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import { Source } from '$/sources/$Sources.ts'
import type { EntityFieldResolver, EntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import {
	entityResolversByEntityType,
	entityFieldResolversByEntityTypeAndFieldName,
} from '$/resolvers/$resolvers.ts'


export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.IdKey]: string
	[EntityMetaKey.Fields]: Partial<EntityFieldValues<_Schema, _EntityType>>
	[EntityMetaKey.Source]: Source
}

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: EntityFieldValue<_Schema, _ParentEntityType, _EntityFieldName>
	[EntityMetaKey.Source]: Source
}


// --- createEntityCollection ---

export const createEntityCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>({
	entityResolversByEntityType,
	entityType,
	queryClient,
}: {
	entityResolversByEntityType: {
		[_ResolvedEntityType in EntityType<_Schema>]?: EntityResolver<
			_Schema,
			_ResolvedEntityType
		>[]
	}
	entityType: _EntityType
	queryClient: _QueryClient
}) => {
	const collection = createCollection(
		queryCollectionOptions<EntityCollectionItem<_Schema, _EntityType>>({
			id: `EntityCollection:${entityType}`,

			queryKey: [`EntityCollection:${entityType}`],

			syncMode: 'on-demand',

			autoIndex: 'eager',
			defaultIndexType: BasicIndex,

			queryFn: async ({ meta }) => {
				const loadSubsetOptions = meta?.loadSubsetOptions

				const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions)

				const sources = new Set(
					(
						filters
							.filter((clause) => (
								clause.field[clause.field.length - 1] === EntityMetaKey.Source
								&& clause.operator === 'in'
							))
							.flatMap((clause) => (
								Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					) as Source[]
				)

				const entityIds = (
					filters
						.filter((clause) => (
							clause.field[clause.field.length - 1] === EntityMetaKey.IdKey
							&& (clause.operator === 'eq' || clause.operator === 'in')
						))
						.flatMap((clause) => (
							clause.operator === 'eq' ?
								[clause.value]
							: Array.isArray(clause.value) ?
								clause.value
							:
								[clause.value]
						))
						.map((value) => (
							(
								typeof value === 'string' ?
									parse(value)
								:
									value
							) satisfies EntityId<_Schema, _EntityType>
						))
				)

				return (
					(await Promise.all(
						entityIds.map(async (entityId) => (
							(await Promise.allSettled(
								(
									sources.size ?
										(entityResolversByEntityType[entityType] ?? [])
											.filter((entityResolver) => sources.has(entityResolver.source))
									:
										(entityResolversByEntityType[entityType] ?? [])
								)
									.map(async (entityResolver) => {
										const fields = await entityResolver.resolve(
											entityId,
											{ filters, sorts, limit },
										)

										return (
											{
												[EntityMetaKey.Id]: entityId,
												[EntityMetaKey.IdKey]: stringify(entityId),
												[EntityMetaKey.Source]: entityResolver.source,
												[EntityMetaKey.Fields]: fields,
												...(
													fields != null && typeof fields === 'object' && !Array.isArray(fields) ?
														fields
													:
														{}
												),
											} satisfies EntityCollectionItem<_Schema, _EntityType>
										)
									}),
							))
								.filter((result) => result.status === 'fulfilled')
								.map((result) => result.value)
						)),
					))
						.flat()
				)
			},

			getKey: (entityItem) => (
				[
					entityItem[EntityMetaKey.Source],
					entityItem[EntityMetaKey.IdKey],
				]
					.join('\0')
			),

			queryClient,
		}),
	)

	collection.createIndex(
		(entityItem) => entityItem[EntityMetaKey.IdKey],
		{ name: `${collection.id}:idKey` },
	)

	collection.createIndex(
		(entityItem) => entityItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	return collection
}


// --- createEntityFieldCollection ---

export const createEntityFieldCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
>({
	entityFieldResolversByEntityTypeAndFieldName,
	entityType,
	fieldDefinition,
	queryClient,
}: {
	entityFieldResolversByEntityTypeAndFieldName: {
		[_ResolvedEntityType in EntityType<_Schema>]: {
			[_ResolvedFieldName in EntityFieldName<_Schema, _ResolvedEntityType>]: EntityFieldResolver<
				_Schema,
				_ResolvedEntityType,
				_ResolvedFieldName
			>[]
		}
	}
	entityType: _EntityType
	fieldDefinition: _FieldDefinition
	queryClient: _QueryClient
}) => {
	const collection = createCollection(
		queryCollectionOptions<EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>>({
			id: `EntityFieldCollection:${entityType}:${fieldDefinition.name}`,

			queryKey: [`EntityFieldCollection:${entityType}`, fieldDefinition.name],

			syncMode: 'on-demand',

			autoIndex: 'eager',
			defaultIndexType: BasicIndex,

			queryFn: async ({ meta }) => {
				const loadSubsetOptions = meta?.loadSubsetOptions

				const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions)

				const parentEntityIds = (
					[
						...filters
							.filter((c) => String(c.field[c.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey)
							.filter((c) => c.operator === 'eq')
							.map((c) => c.value),
						...filters
							.filter((c) => String(c.field[c.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey)
							.filter((c) => c.operator === 'in')
							.flatMap((c) => (
								Array.isArray(c.value) ?
									c.value
								:
									[c.value]
							)),
					]
						.map((value) => (
							(
								typeof value === 'string' ?
									parse(value)
								:
									value
							) satisfies EntityId<_Schema, _EntityType>
						))
				)

				return (
					(await Promise.all(
						parentEntityIds
							.map(async (parentEntityId) => (
								(await Promise.allSettled(
									(
										entityFieldResolversByEntityTypeAndFieldName[entityType]?.[fieldDefinition.name]
										?? []
									)
										.map(async (fieldResolver) => {
											const value = await fieldResolver.resolve(
												parentEntityId,
												{ filters, sorts, limit },
											)

											return (
												(
													fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany || fieldDefinition.cardinality === EntityFieldCardinality.Many ?
														value ?? []
													:
														value == null ?
															[]
														:
															[value]
												)
													.map((innerValue) => ({
														[EntityMetaKey.ParentId]: parentEntityId,
														[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
														[EntityMetaKey.Source]: fieldResolver.source,
														[EntityMetaKey.Value]: (
															fieldDefinition.type === EntityFieldType.EntityReference || fieldDefinition.type === EntityFieldType.EntitiesReference ?
																{
																	...innerValue,
																	[EntityMetaKey.IdKey]: stringify(innerValue[EntityMetaKey.Id]),
																}
															:
																innerValue
														),
													}))
											)
										}),
								))
							)),
					))
						.flat()
						.filter((result) => result.status === 'fulfilled')
						.flatMap((result) => result.value)
				)
			},

			getKey: (entityFieldItem) => (
				[
					entityFieldItem[EntityMetaKey.Source],
					entityFieldItem[EntityMetaKey.ParentIdKey],
					entityFieldItem[EntityMetaKey.Value][EntityMetaKey.IdKey],
				]
					.join('\0')
			),

			queryClient,
		}),
	)

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.ParentIdKey],
		{ name: `${collection.id}:parentIdKey` },
	)

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	return collection
}


// --- Instantiate: queryClient, entityCollectionByEntityType, entityFieldCollections ---

export const queryClient = new _QueryClient()

export const entityCollectionByEntityType = Object.fromEntries(
	schema.map((definition) => [
		definition.entityType,
		createEntityCollection({
			entityResolversByEntityType,
			entityType: definition.entityType,
			queryClient,
		}),
	] as const)
)

export const entityFieldCollections = Object.fromEntries(
	schema.map((definition) => [
		definition.entityType,
		Object.fromEntries(
			definition.fields.map((field) => [
				field.name,
				createEntityFieldCollection({
					entityFieldResolversByEntityTypeAndFieldName,
					entityType: definition.entityType,
					fieldDefinition: field,
					queryClient,
				}),
			] as const)
		),
	] as const)
)
