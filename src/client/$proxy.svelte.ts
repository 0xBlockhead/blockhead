import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
import type {
	ClientContext,
	SubscribeSelection,
	SubscribeEntityReferenceResult,
} from '$/client/$client.svelte.ts'
import {
	subscribeEntity,
	subscribeEntityField,
	type EntityFieldResourceData,
	type EntityResourceData,
} from '$/client/$subscribe.svelte.ts'
import {
	EntityMetaKey,
	EntityFieldType,
	type EntityResolvedFieldValues,
	type EntityFieldName,
	type EntitySelector,
	type EntityType,
	type Schema,
	entityFieldDefinitions,
} from '$/schema/$schema.ts'


export const EntityProxyField = Symbol('EntityProxyField')

export type EntityProxyFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	& SvelteKitResource<EntityFieldResourceData<_Schema, _EntityType, _FieldName>>
	& ((
		selection?: SubscribeSelection<_Schema, _EntityType>
	) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName>)
	& {
		entityType: _EntityType
		entitySelector: EntitySelector<_Schema, _EntityType>
		fieldName: _FieldName
	}
)

export type EntityProxyEntitiesData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	values: readonly SubscribeEntityReferenceResult<_Schema, _EntityType>[]
	entities: readonly SubscribeEntityReferenceResult<_Schema, _EntityType>[]
	totalCount?: number
}

export type EntityProxyEntitiesResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& SvelteKitResource<EntityProxyEntitiesData<_Schema, _EntityType>>
	& ((
		selection?: SubscribeSelection<_Schema, _EntityType>
	) => EntityProxyEntitiesResource<_Schema, _EntityType>)
	& {
		entityType: EntityType<_Schema>
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>
		fieldName: EntityFieldName<_Schema, EntityType<_Schema>>
	}
)

export type EntityProxyData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& EntityResourceData<_Schema, _EntityType>
	& EntityResolvedFieldValues<_Schema, _EntityType>
)

export type EntityProxyResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& SvelteKitResource<EntityProxyData<_Schema, _EntityType>>
	& ((
		selection?: SubscribeSelection<_Schema, _EntityType>
	) => EntityProxyResource<_Schema, _EntityType>)
	& {
		entityType: _EntityType
		entitySelector: EntitySelector<_Schema, _EntityType>
		[EntityProxyField]: <const _FieldName extends EntityFieldName<_Schema, _EntityType>>(
			fieldName: _FieldName,
			selection?: SubscribeSelection<_Schema, _EntityType>
		) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
		value: {
			entitySelector: EntitySelector<_Schema, _EntityType>
			[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
		}
		[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	}
	& {
		readonly [
			_FieldName in EntityFieldName<_Schema, _EntityType>
		]: EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
	}
)

const mergeSelection = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	base: SubscribeSelection<_Schema, _EntityType>,
	override: SubscribeSelection<_Schema, _EntityType> | undefined
): SubscribeSelection<_Schema, _EntityType> => ({
	...base,
	...override,
	fields: {
		...base.fields,
		...override?.fields,
	},
})

const resourceProperty = <_Data>(
	getResource: () => SvelteKitResource<_Data>,
	project: (data: _Data) => _Data,
	property: PropertyKey
) => {
	if (property === 'then')
		return (
			onfulfilled?: Parameters<Promise<_Data>['then']>[0],
			onrejected?: Parameters<Promise<_Data>['then']>[1]
		) => getResource().then(
			onfulfilled == null ?
				undefined
			:
				(data) => onfulfilled(project(data)),
			onrejected
		)
	if (property === 'catch')
		return getResource().catch
	if (property === 'finally')
		return getResource().finally
	if (property === 'current') {
		const current = getResource().current
		return current === undefined ? undefined : project(current)
	}
	if (property === 'error')
		return getResource().error
	if (property === 'loading')
		return getResource().loading
	if (property === 'ready')
		return getResource().ready
	if (property === Symbol.toStringTag)
		return getResource()[Symbol.toStringTag]

	return undefined
}

const projectEntityData = (
	data: EntityResourceData<Schema, EntityType<Schema>>
): EntityProxyData<Schema, EntityType<Schema>> => ({
	...data,
	...data.fields,
})

const projectResource = <_Input, _Output>(
	resource: SvelteKitResource<_Input>,
	project: (data: _Input) => _Output
): SvelteKitResource<_Output> => ({
	get current() {
		const current = resource.current
		return current === undefined ? undefined : project(current)
	},
	get loading() {
		return resource.loading
	},
	get ready() {
		return resource.ready
	},
	get error() {
		return resource.error
	},
	get [Symbol.toStringTag]() {
		return resource[Symbol.toStringTag]
	},
	then(onfulfilled, onrejected) {
		return resource.then(
			onfulfilled == null ?
				undefined
			:
				(data) => onfulfilled(project(data)),
			onrejected
		)
	},
	catch(onrejected) {
		return resource.then(project).catch(onrejected)
	},
	finally(onfinally) {
		return resource.then(project).finally(onfinally)
	},
})

const projectReferenceData = (value: ({ [EntityMetaKey.Fields]?: object } & object) | undefined) => (
	value == null ?
		undefined
	:
		{
			...value,
			...(EntityMetaKey.Fields in value ? value[EntityMetaKey.Fields] : {}),
		}
)

export function createEntityFieldProxy<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection?: SubscribeSelection<_Schema, _EntityType>
): EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
export function createEntityFieldProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: object,
	fieldName: string,
	selection: SubscribeSelection<Schema, EntityType<Schema>> = {}
): object {
	let resource: SvelteKitResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> | undefined
	const getResource = (): SvelteKitResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> => {
		if (resource === undefined)
			resource = subscribeEntityField(
				context,
				entityType,
				entitySelector,
				fieldName,
				selection
			)

		return resource
	}
	const fieldDefinition = entityFieldDefinitions(context.entityDefinitionByType[entityType])
		.find((definition) => definition.name === fieldName)
	if (fieldDefinition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)
	const project = (
		data: EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	): EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>> => (
		(
			fieldDefinition.type === EntityFieldType.EntityReference
			|| fieldDefinition.type === EntityFieldType.EntitiesReference
		)
		&& data !== undefined
		&& data !== null
		&& typeof data === 'object'
		&& 'values' in data
		&& Array.isArray(data.values) ?
			{
				...data,
				values: data.values.map(projectReferenceData),
				entities: data.values.map(projectReferenceData),
			}
			: (
				data !== undefined
				&& data !== null
				&& typeof data === 'object' ?
					projectReferenceData(data)
				:
					data === null ? undefined : data
			)
		)
	return new Proxy((
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>>
	) => createEntityFieldProxy(
		context,
		entityType,
		entitySelector,
		fieldName,
		mergeSelection(
			selection,
			selectionOverride
		)
	), {
		apply(_target, _thisArgument, argumentsList) {
			return createEntityFieldProxy(
				context,
				entityType,
				entitySelector,
				fieldName,
				mergeSelection(
					selection,
					argumentsList[0]
				)
			)
		},
		get(_target, property) {
			if (property === 'entityType')
				return entityType
			if (property === 'entitySelector')
				return entitySelector
			if (property === 'fieldName')
				return fieldName

			return resourceProperty(
				getResource,
				project,
				property
			)
		},
	})
}

export function createEntityProxy<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: SubscribeSelection<_Schema, _EntityType>
): EntityProxyResource<_Schema, _EntityType>
export function createEntityProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: object,
	selection?: SubscribeSelection<Schema, EntityType<Schema>>
): object
export function createEntityProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: object,
	selection: SubscribeSelection<Schema, EntityType<Schema>> = {}
): object {
	let resource: SvelteKitResource<EntityProxyData<Schema, EntityType<Schema>>> | undefined
	const getResource = (): SvelteKitResource<EntityProxyData<Schema, EntityType<Schema>>> => {
		if (resource === undefined)
			resource = projectResource(
				subscribeEntity(
					context,
					entityType,
					entitySelector,
					selection
				),
				projectEntityData
			)

		return resource
	}
	const fieldProxyByName = new Map<string, EntityProxyFieldResource<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>>()

	return new Proxy((
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>>
	) => createEntityProxy(
		context,
		entityType,
		entitySelector,
		mergeSelection(
			selection,
			selectionOverride
		)
	), {
		apply(_target, _thisArgument, argumentsList) {
			return createEntityProxy(
				context,
				entityType,
				entitySelector,
				mergeSelection(
					selection,
					argumentsList[0]
				)
			)
		},
		get(_target, property) {
			if (property === 'entityType')
				return entityType
			if (property === 'entitySelector')
				return entitySelector
			if (property === EntityMetaKey.Selector)
				return entitySelector
			if (property === 'value')
				return {
					entitySelector,
					[EntityMetaKey.Selector]: entitySelector,
				}
			if (property === 'entity')
				return getResource().current
			if (property === EntityProxyField)
				return (
					fieldName: string,
					fieldSelection?: SubscribeSelection<Schema, EntityType<Schema>>
				) => createEntityFieldProxy(
					context,
					entityType,
					entitySelector,
					fieldName,
					mergeSelection(
						selection,
						fieldSelection
					)
				)

			const value = resourceProperty(
				getResource,
				(data) => data,
				property
			)
			if (value !== undefined)
				return value
			if (
				typeof property === 'string'
				&& entityFieldDefinitions(context.entityDefinitionByType[entityType])
					.some((fieldDefinition) => fieldDefinition.name === property)
			) {
				if (!fieldProxyByName.has(property))
					fieldProxyByName.set(
						property,
						createEntityFieldProxy(
							context,
							entityType,
							entitySelector,
							property,
							selection
						)
					)

				return fieldProxyByName.get(property)
			}

			return undefined
		},
	})
}
