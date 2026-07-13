import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
import type {
	ClientContext,
	SubscribeSelection,
	SubscribeEntityReferenceResult,
	SubscribeAllResultFields,
} from '$/client/$client.svelte.ts'
import {
	subscribeEntity,
	subscribeEntityField,
	type EntityFieldResourceData,
	type EntityResourceData,
} from '$/client/$subscribe.svelte.ts'
import {
	EntityMetaKey,
	EntityFieldCardinality,
	EntityFieldType,
	ProjectionResolution,
	type EntityFacetCondition,
	type EntityFacetFieldDefinitionAtPath,
	type EntityFacetFieldNameAtPath,
	type EntityFacetName,
	type EntityFacetPath,
	type EntityFieldAddress,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldSingleResolvedValueFromDefinition,
	type EntityDefinitionForEntityType,
	type EntitySelector,
	type EntityType,
	type ProjectionValue,
	type Schema,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'


export const EntityProxyField = Symbol('EntityProxyField')

type EntityProxyResourceFieldName =
	| Extract<keyof SvelteKitResource<object>, string>
	| 'entity'
	| 'entitySelector'
	| 'entityType'
	| 'facetPath'
	| 'name'
	| 'sources'
	| 'value'

export type EntityProxyFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	& SvelteKitResource<EntityFieldResourceData<_Schema, _EntityType, _FieldName>>
	& (<const _FieldRow extends object = object>(
		selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
	) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName>)
	& {
		entityType: _EntityType
		entitySelector: EntitySelector<_Schema, _EntityType>
		fieldName: _FieldName
		sources?: readonly string[]
	}
	& (
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly type: EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			{
				first: (
					selection?: SubscribeSelection<_Schema, _EntityType>
				) => SvelteKitResource<SubscribeEntityReferenceResult<_Schema, _ReferencedEntityType> | undefined>
			}
		:
			{}
	)
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
	& (<const _FieldRow extends object = object>(
		selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
	) => EntityProxyEntitiesResource<_Schema, _EntityType>)
	& {
		entityType: EntityType<_Schema>
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>
		fieldName: EntityFieldName<_Schema, EntityType<_Schema>>
		sources?: readonly string[]
	}
)

type EntityProxyProjectionFieldSingleResult<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		SubscribeEntityReferenceResult<_Schema, _ReferencedEntityType>
	:
		EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>
)

type EntityProxyProjectionFieldData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			entityType: _EntityType
			entitySelector: EntitySelector<_Schema, _EntityType>
			fieldName: _FieldDefinition['name']
			values: readonly EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition>[]
			entities: readonly EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition>[]
			totalCount?: number
		}
	: _FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne
	} ?
		EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition> | undefined
	:
		EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition>
)

type EntityProxyProjectionFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	& SvelteKitResource<EntityProxyProjectionFieldData<_Schema, _EntityType, _FieldDefinition>>
	& (<const _FieldRow extends object = object>(
		selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
	) => EntityProxyProjectionFieldResource<_Schema, _EntityType, _FieldDefinition>)
	& {
		entityType: _EntityType
		entitySelector: EntitySelector<_Schema, _EntityType>
		fieldName: _FieldDefinition['name']
		sources?: readonly string[]
	}
	& (
		_FieldDefinition extends {
			readonly type: EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			{
				first: (
					selection?: SubscribeSelection<_Schema, _EntityType>
				) => SvelteKitResource<SubscribeEntityReferenceResult<_Schema, _ReferencedEntityType> | undefined>
			}
		:
			{}
	)
)

export type EntityProxyProjectionResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = (
	& SvelteKitResource<ProjectionValue<{
		readonly [
			_FieldName in EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath> as (
				_FieldName extends EntityProxyResourceFieldName ?
					never
				:
					_FieldName
			)
		]: EntityProxyProjectionFieldResource<
			_Schema,
			_EntityType,
			EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>
		>
		}
		& {
			readonly [
				_FacetName in EntityFacetName<_Schema, _EntityType, _FacetPath>
			]: EntityProxyProjectionResource<_Schema, _EntityType, [..._FacetPath, _FacetName]>
		}
	>>
	& {
		[EntityProxyField]: <
			const _FieldName extends Extract<
				EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath>,
				EntityProxyResourceFieldName
			> = Extract<
				EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath>,
				EntityProxyResourceFieldName
			>,
		>(
			fieldName: _FieldName,
			selection?: SubscribeSelection<_Schema, _EntityType>
		) => EntityProxyProjectionFieldResource<
			_Schema,
			_EntityType,
			EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>
		>
	}
	& {
		readonly [
			_FieldName in EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath> as (
				_FieldName extends EntityProxyResourceFieldName ?
					never
				:
					_FieldName
			)
		]: EntityProxyProjectionFieldResource<
			_Schema,
			_EntityType,
			EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>
		>
	}
	& {
		readonly [
			_FacetName in EntityFacetName<_Schema, _EntityType, _FacetPath>
		]: EntityProxyProjectionResource<_Schema, _EntityType, [..._FacetPath, _FacetName]>
	}
)

export type EntityProxyData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& EntityResourceData<_Schema, _EntityType>
	& SubscribeAllResultFields<_Schema, _EntityType>
)

export type EntityProxyResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& SvelteKitResource<EntityProxyData<_Schema, _EntityType>>
	& (<const _FieldRow extends object = object>(
		selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
	) => EntityProxyResource<_Schema, _EntityType>)
	& {
		entityType: _EntityType
		entitySelector: EntitySelector<_Schema, _EntityType>
		sources?: readonly string[]
		[EntityProxyField]: <
			const _FieldName extends Extract<
				EntityFieldName<_Schema, _EntityType>,
				EntityProxyResourceFieldName
			> = Extract<
				EntityFieldName<_Schema, _EntityType>,
				EntityProxyResourceFieldName
			>,
		>(
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
			_FieldName in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number]['name'] as (
				_FieldName extends EntityProxyResourceFieldName ?
					never
				:
					_FieldName
			)
		]: EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
	}
	& {
		readonly [
			_FacetName in EntityFacetName<_Schema, _EntityType>
		]: EntityProxyProjectionResource<_Schema, _EntityType, [_FacetName]>
	}
)

const mergeSelection = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldRow extends object = object
>(
	base: SubscribeSelection<_Schema, _EntityType, _FieldRow>,
	override: SubscribeSelection<_Schema, _EntityType, _FieldRow> | undefined
): SubscribeSelection<_Schema, _EntityType, _FieldRow> => ({
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
			return (
				onrejected?: Parameters<Promise<_Data>['catch']>[0]
			) => getResource().then(project).catch(onrejected)
		if (property === 'finally')
			return (
				onfinally?: Parameters<Promise<_Data>['finally']>[0]
			) => getResource().then(project).finally(onfinally)
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

const projectionDependencyFields = (
	dependencies: readonly EntityFieldAddress[]
) => {
	type DependencyFields = Partial<Record<string, true | { fields: DependencyFields }>>

	const fields: DependencyFields = {}
	for (const dependency of dependencies) {
		let fieldsAtPath = fields
		for (const facetName of dependency.facetPath) {
			const facetFields = fieldsAtPath[facetName]
			if (facetFields === true)
				break

			const nestedFacetFields = facetFields ?? {
				fields: {},
			}
			fieldsAtPath[facetName] = nestedFacetFields
			fieldsAtPath = nestedFacetFields.fields
		}
		fieldsAtPath[dependency.fieldName] = true
	}
	return fields
}

const entityDataFieldValue = (
	data: EntityResourceData<Schema, EntityType<Schema>>,
	fieldName: string,
	facetPath: EntityFacetPath
) => {
	const addressedValue = data.fieldValuesByAddress[entityFieldAddressKey(
		data.entityType,
		facetPath,
		fieldName
	)]
	if (
		addressedValue !== null
		&& typeof addressedValue === 'object'
		&& 'values' in addressedValue
		&& Array.isArray(addressedValue.values)
	)
		return addressedValue.values
	if (addressedValue !== undefined)
		return addressedValue

	const selectorValue = Object.getOwnPropertyDescriptor(data.entitySelector, fieldName)?.value
	if (selectorValue !== undefined)
		return selectorValue

	const fieldsValue = Object.getOwnPropertyDescriptor(data.fields, fieldName)?.value
	if (
		fieldsValue !== undefined
		&& fieldsValue !== null
		&& typeof fieldsValue === 'object'
		&& 'values' in fieldsValue
		&& Array.isArray(fieldsValue.values)
	)
		return fieldsValue.values

	return fieldsValue
}

const projectionConditionResolution = (
	context: ClientContext,
	entityType: EntityType<Schema>,
	data: EntityResourceData<Schema, EntityType<Schema>>,
	condition: EntityFacetCondition | undefined,
	value: Record<PropertyKey, never>,
	facetPath: EntityFacetPath = []
): ProjectionValue<Record<PropertyKey, never>> | undefined => {
	if (facetPath.length > 0) {
		const parentFacetPath = facetPath.slice(0, -1)
		const parentCondition = context.projectionDefinitionByEntityTypeAndPath[
			entityFieldAddressKey(entityType, parentFacetPath, '')
		]?.condition
		const parentResolution = projectionConditionResolution(
			context,
			entityType,
			data,
			parentCondition,
			value,
			parentFacetPath
		)
		if (parentResolution != null && parentResolution.resolution !== ProjectionResolution.Applicable)
			return parentResolution
	}

	if (condition == null)
		return {
			resolution: ProjectionResolution.Applicable,
			value,
		}

	if ('all' in condition) {
		const childResolutions = condition.all.map((child) => projectionConditionResolution(
			context,
			entityType,
			data,
			child,
			value,
			facetPath
		))
		const blockedDependencies = childResolutions.flatMap((resolution) => (
			resolution?.resolution === ProjectionResolution.Blocked ?
				resolution.dependencies
			:
				[]
		))
		return (
			blockedDependencies.length > 0 ?
				{
					resolution: ProjectionResolution.Blocked,
					dependencies: blockedDependencies,
				}
			: childResolutions.every((resolution) => resolution?.resolution === ProjectionResolution.Applicable) ?
				{
					resolution: ProjectionResolution.Applicable,
					value,
				}
			:
				{
					resolution: ProjectionResolution.NotApplicable,
				}
		)
	}

	const indexedItem = condition.path.at(-1)
	const fieldName = condition.path.at(typeof indexedItem === 'number' ? -2 : -1)
	const conditionFacetPath = condition.path.slice(
		0,
		typeof indexedItem === 'number' ? -2 : -1
	).filter((segment): segment is string => typeof segment === 'string')
	if (typeof fieldName !== 'string')
		return {
			resolution: ProjectionResolution.Unsupported,
		}

	const fieldValue = entityDataFieldValue(data, fieldName, conditionFacetPath)
	if (fieldValue === undefined)
		return {
			resolution: ProjectionResolution.Blocked,
		dependencies: [
				{
					entityType,
					facetPath: conditionFacetPath,
					fieldName,
				},
			],
		}

	const conditionValue = (
		typeof indexedItem === 'number' && Array.isArray(fieldValue) ?
			fieldValue[indexedItem]
		:
			fieldValue
	)
	const predicateApplies = (
		'is' in condition ?
			conditionValue === condition.is
		: 'isOneOf' in condition ?
			condition.isOneOf.some((value) => value === conditionValue)
		: Array.isArray(conditionValue) ?
			conditionValue.some((value) => value === condition.includes)
		:
			false
	)
	return (
		predicateApplies ?
			{
				resolution: ProjectionResolution.Applicable,
				value,
			}
		:
			{
				resolution: ProjectionResolution.NotApplicable,
			}
	)
}

const projectReferenceData = (value: object | undefined) => (
	value == null ?
		undefined
	:
		{
			...value,
			...(EntityMetaKey.Selector in value ? {
				entitySelector: value[EntityMetaKey.Selector],
			} : {}),
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
	selection?: SubscribeSelection<_Schema, _EntityType, object>,
	fieldDefinition?: EntityFieldDefinition
): EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
export function createEntityFieldProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: EntitySelector<Schema, EntityType<Schema>>,
	fieldName: string,
	selection: SubscribeSelection<Schema, EntityType<Schema>, object> = {},
	fieldDefinition?: EntityFieldDefinition
): object {
	let resource: SvelteKitResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> | undefined
	const getResource = (): SvelteKitResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> => {
		if (resource === undefined)
			resource = subscribeEntityField(
				context,
				entityType,
				entitySelector,
				fieldName,
				selection,
				fieldDefinition
			)

		return resource
	}
	const resolvedFieldDefinition = fieldDefinition ?? context.entityDefinitionByType[entityType].fields
		.find((definition) => definition.name === fieldName)
	if (resolvedFieldDefinition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)
	const project = (
		data: EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	): EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>> => (
		(
			resolvedFieldDefinition.type === EntityFieldType.EntityReference
			|| resolvedFieldDefinition.type === EntityFieldType.EntitiesReference
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
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>, object>
	) => createEntityFieldProxy(
		context,
		entityType,
		entitySelector,
		fieldName,
		mergeSelection(
			selection,
			selectionOverride
		),
		resolvedFieldDefinition
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
				),
				resolvedFieldDefinition
			)
		},
		get(_target, property) {
			if (property === 'entityType')
				return entityType
			if (property === 'entitySelector')
				return entitySelector
			if (property === 'fieldName')
				return fieldName
			if (property === 'sources')
				return selection.sources
			if (property === 'first')
				return (
					selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>, object>
				) => {
					if (resolvedFieldDefinition.type !== EntityFieldType.EntitiesReference)
						return undefined

					const references = createEntityFieldProxy(
						context,
						entityType,
						entitySelector,
						fieldName,
						mergeSelection(
							selection,
							{
								limit: 1,
								...selectionOverride,
							}
						),
						resolvedFieldDefinition
					)

					return projectResource(
						references,
						(data) => (
							data != null
							&& typeof data === 'object'
							&& 'values' in data
							&& Array.isArray(data.values) ?
								data.values[0]
							:
								undefined
						)
					)
				}

			return resourceProperty(
				getResource,
				project,
				property
			)
		},
	})
}

const createEntityProjectionProxy = (
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: EntitySelector<Schema, EntityType<Schema>>,
	facetPath: readonly string[],
	selection: SubscribeSelection<Schema, EntityType<Schema>, object>
) => {
	const fieldProxyByName = new Map<string, object>()
	const projectionProxyByFacetName = new Map<string, object>()
	const projectionDefinition = context.projectionDefinitionByEntityTypeAndPath[
		entityFieldAddressKey(entityType, facetPath, '')
	]
	let resource: SvelteKitResource<ProjectionValue<Record<PropertyKey, never>>> | undefined
	const getResource = (): SvelteKitResource<ProjectionValue<Record<PropertyKey, never>>> => {
		if (resource === undefined)
			resource = projectResource(
				subscribeEntity(
					context,
					entityType,
					entitySelector,
					{
						...selection,
						selectorSources: [],
						fields: projectionDependencyFields(
							projectionDefinition?.transitiveDependencies ?? []
						),
					}
				),
				(data) => projectionConditionResolution(
					context,
					entityType,
					data,
					projectionDefinition?.condition,
					projectionProxy,
					facetPath
				) ?? {
					resolution: ProjectionResolution.Unsupported,
				}
			)

		return resource
	}

	const projectionProxy = new Proxy<Record<PropertyKey, never>>({}, {
		get(_target, property) {
			if (property === 'entityType')
				return entityType
			if (property === 'entitySelector')
				return entitySelector
			if (property === 'facetPath')
				return facetPath
			if (property === 'sources')
				return selection.sources
			if (property === EntityProxyField)
				return (
					fieldName: string,
					fieldSelection?: SubscribeSelection<Schema, EntityType<Schema>, object>
				) => {
					const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][
						entityFieldAddressKey(entityType, facetPath, fieldName)
					]
					return createEntityFieldProxy(
						context,
						entityType,
						entitySelector,
						fieldDefinition?.name ?? fieldName,
						mergeSelection(
							selection,
							fieldSelection
						),
						fieldDefinition
					)
				}
			const value = resourceProperty(
				getResource,
				(data) => data,
				property
			)
			if (value !== undefined)
				return value
			if (typeof property !== 'string')
				return undefined

			if (
				context.projectionDefinitionByEntityTypeAndPath[
					entityFieldAddressKey(entityType, [
						...facetPath,
						property,
					], '')
				] != null
			) {
				if (!projectionProxyByFacetName.has(property))
					projectionProxyByFacetName.set(
						property,
						createEntityProjectionProxy(
							context,
							entityType,
							entitySelector,
							[
								...facetPath,
								property,
							],
							selection
						)
					)

				return projectionProxyByFacetName.get(property)
			}

			const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][
				entityFieldAddressKey(entityType, facetPath, property)
			]
			if (fieldDefinition == null)
				return undefined

			if (!fieldProxyByName.has(property))
				fieldProxyByName.set(
					property,
					createEntityFieldProxy(
						context,
						entityType,
						entitySelector,
						fieldDefinition.name,
						selection,
						fieldDefinition
					)
				)

			return fieldProxyByName.get(property)
		},
	})
	return projectionProxy
}

export function createEntityProxy<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: SubscribeSelection<_Schema, _EntityType, object>
): EntityProxyResource<_Schema, _EntityType>
export function createEntityProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: EntitySelector<Schema, EntityType<Schema>>,
	selection?: SubscribeSelection<Schema, EntityType<Schema>, object>
): object
export function createEntityProxy(
	context: ClientContext,
	entityType: EntityType<Schema>,
	entitySelector: EntitySelector<Schema, EntityType<Schema>> | undefined,
	selection: SubscribeSelection<Schema, EntityType<Schema>, object> = {}
): object {
	if (entitySelector == null)
		throw new Error(`Cannot create ${entityType} proxy without an entity selector`)

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
	const projectionProxyByFacetName = new Map<string, object>()

	return new Proxy((
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>, object>
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
			if (property === 'sources')
				return selection.sources
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
						fieldSelection?: SubscribeSelection<Schema, EntityType<Schema>, object>
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
			if (typeof property === 'string') {
				const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][
					entityFieldAddressKey(entityType, [], property)
				]
				if (fieldDefinition != null) {
					if (!fieldProxyByName.has(property))
						fieldProxyByName.set(
							property,
							createEntityFieldProxy(
								context,
								entityType,
								entitySelector,
								property,
								selection,
								fieldDefinition
							)
						)

					return fieldProxyByName.get(property)
				}
			}
			if (
				typeof property === 'string'
				&& context.projectionDefinitionByEntityTypeAndPath[
					entityFieldAddressKey(entityType, [property], '')
				] != null
			) {
				if (!projectionProxyByFacetName.has(property))
					projectionProxyByFacetName.set(
						property,
						createEntityProjectionProxy(
							context,
							entityType,
							entitySelector,
							[
								property,
							],
							selection
						)
					)

				return projectionProxyByFacetName.get(property)
			}

			return undefined
		},
	})
}
