import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
import type {
	ClientContext,
	SubscribeSelection,
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

export type EntityProxyEntitiesResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityProxyFieldResource<
	_Schema,
	_EntityType,
	EntityFieldName<_Schema, _EntityType>
>

export type EntityProxyResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& SvelteKitResource<EntityResourceData<_Schema, _EntityType>>
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

const entityReferenceSelector = (value: object) => {
	if (!(EntityMetaKey.Selector in value))
		return undefined

	const selector = value[EntityMetaKey.Selector]
	if (
		selector == null
		|| typeof selector !== 'object'
	)
		return undefined

	return selector
}

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
	const projectValue = (value: object | null | undefined) => {
		if (
			!(
				fieldDefinition.type === EntityFieldType.EntityReference
				|| fieldDefinition.type === EntityFieldType.EntitiesReference
			)
			|| value == null
		)
			return value

		const selector = entityReferenceSelector(value)
		return selector === undefined ?
			value
		:
			createEntityProxy(
				context,
				fieldDefinition.entityType,
				selector
			)
	}
	const project = (
		data: EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	): EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>> => (
		(
			fieldDefinition.type === EntityFieldType.EntityReference
			|| fieldDefinition.type === EntityFieldType.EntitiesReference
		)
		&& data != null
		&& 'values' in data
		&& Array.isArray(data.values) ?
			{
				...data,
				values: data.values.map(projectValue),
				entities: data.values.map(projectValue),
			}
		: (
			data != null
			&& typeof data === 'object' ?
				projectValue(data)
			:
				data
		)
	)
	const target = (
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
	)

	return new Proxy(target, {
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
	let resource: SvelteKitResource<EntityResourceData<Schema, EntityType<Schema>>> | undefined
	const getResource = (): SvelteKitResource<EntityResourceData<Schema, EntityType<Schema>>> => {
		if (resource === undefined)
			resource = subscribeEntity(
				context,
				entityType,
				entitySelector,
				selection
			)

		return resource
	}
	const fieldNames = entityFieldDefinitions(context.entityDefinitionByType[entityType])
		.map((fieldDefinition) => fieldDefinition.name)
	const fieldProxyByName = new Map<string, EntityProxyFieldResource<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>>()
	const target = (
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>>
	) => createEntityProxy(
		context,
		entityType,
		entitySelector,
		mergeSelection(
			selection,
			selectionOverride
		)
	)

	return new Proxy(target, {
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
				&& fieldNames.includes(property)
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
