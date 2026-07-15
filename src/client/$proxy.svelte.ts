import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
import type {
	RegisteredEntityType,
	RegisteredSchema,
} from '$/schema/index.ts'
import type {
	ClientContext,
	CheckedSubscribeSelection,
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
	ProjectionResolution,
	type EntityBaseFieldName,
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
	type EntitySelector,
	type EntityType,
	type ProjectionValue,
	type Schema,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/EntityField.ts'


export const EntityProxyField = Symbol('EntityProxyField')

const svelteKitResourceProperties = new Set<PropertyKey>([
	'current',
	'loading',
	'ready',
	'error',
	'then',
	'catch',
	'finally',
	Symbol.toStringTag,
])

type EntityProxyReservedProperties<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& SvelteKitResource<object>
	& {
		entity: object
		entitySelector: EntitySelector<_Schema, _EntityType>
		entityType: _EntityType
		sources?: readonly string[]
		value: object
	}
)

type EntityProxyProjectionReservedProperties<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = (
	& SvelteKitResource<object>
	& {
		entitySelector: EntitySelector<_Schema, _EntityType>
		entityType: _EntityType
		facetPath: _FacetPath
		sources?: readonly string[]
	}
)

type EntityProxyResourceFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<keyof EntityProxyReservedProperties<_Schema, _EntityType>, string>

type EntityProxyProjectionResourceFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = Extract<keyof EntityProxyProjectionReservedProperties<_Schema, _EntityType, _FacetPath>, string>

type EntityProxyFieldSelectionEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		_ReferencedEntityType
	:
		_EntityType
)

export type EntityProxyFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection = (
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			SubscribeSelection<_Schema, _ReferencedEntityType>
		:
			true
	),
> = (
	& SvelteKitResource<EntityFieldResourceData<_Schema, _EntityType, _FieldName, _FieldSelection>>
	& (
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			<
				const _Selection extends SubscribeSelection<_Schema, _ReferencedEntityType> = {},
			>(
				selection?: _Selection & CheckedSubscribeSelection<_Schema, _ReferencedEntityType, _Selection>
			) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName, _Selection>
		:
			<const _FieldRow extends object = object>(
				selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
			) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
	)
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
				first: <
					const _Selection extends SubscribeSelection<_Schema, _ReferencedEntityType> = {},
				>(
					selection?: _Selection & CheckedSubscribeSelection<_Schema, _ReferencedEntityType, _Selection>
				) => SvelteKitResource<SubscribeEntityReferenceResult<_Schema, _ReferencedEntityType, _Selection> | undefined>
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
	_FieldSelection = true,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		SubscribeEntityReferenceResult<
			_Schema,
			_ReferencedEntityType,
			Extract<_FieldSelection, SubscribeSelection<_Schema, _ReferencedEntityType>>
		>
	:
		EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>
)

type EntityProxyProjectionFieldData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection = true,
> = (
	_FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			entityType: _EntityType
			entitySelector: EntitySelector<_Schema, _EntityType>
			fieldName: _FieldDefinition['name']
			values: readonly EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition, _FieldSelection>[]
			entities: readonly EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition, _FieldSelection>[]
			totalCount?: number
		}
	: _FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne
	} ?
		EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition, _FieldSelection> | undefined
	:
		EntityProxyProjectionFieldSingleResult<_Schema, _FieldDefinition, _FieldSelection>
)

type EntityProxyProjectionFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection = (
		_FieldDefinition extends {
			readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			SubscribeSelection<_Schema, _ReferencedEntityType>
		:
			true
	),
> = (
	& SvelteKitResource<EntityProxyProjectionFieldData<_Schema, _EntityType, _FieldDefinition, _FieldSelection>>
	& (
		_FieldDefinition extends {
			readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			<
				const _Selection extends SubscribeSelection<_Schema, _ReferencedEntityType> = {},
			>(
				selection?: _Selection & CheckedSubscribeSelection<_Schema, _ReferencedEntityType, _Selection>
			) => EntityProxyProjectionFieldResource<_Schema, _EntityType, _FieldDefinition, _Selection>
		:
			<const _FieldRow extends object = object>(
				selection?: SubscribeSelection<_Schema, _EntityType, _FieldRow>
			) => EntityProxyProjectionFieldResource<_Schema, _EntityType, _FieldDefinition>
	)
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
				first: <
					const _Selection extends SubscribeSelection<_Schema, _ReferencedEntityType> = {},
				>(
					selection?: _Selection & CheckedSubscribeSelection<_Schema, _ReferencedEntityType, _Selection>
				) => SvelteKitResource<SubscribeEntityReferenceResult<_Schema, _ReferencedEntityType, _Selection> | undefined>
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
				_FieldName extends EntityProxyProjectionResourceFieldName<_Schema, _EntityType, _FacetPath> ?
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
				EntityProxyProjectionResourceFieldName<_Schema, _EntityType, _FacetPath>
			> = Extract<
				EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath>,
				EntityProxyProjectionResourceFieldName<_Schema, _EntityType, _FacetPath>
			>,
			const _Selection extends SubscribeSelection<
				_Schema,
				EntityProxyFieldSelectionEntityType<
					_Schema,
					_EntityType,
					EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>
				>
			> = {},
		>(
			fieldName: _FieldName,
			selection?: _Selection & CheckedSubscribeSelection<
				_Schema,
				EntityProxyFieldSelectionEntityType<
					_Schema,
					_EntityType,
					EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>
				>,
				_Selection
			>
		) => EntityProxyProjectionFieldResource<
			_Schema,
			_EntityType,
			EntityFacetFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath, _FieldName>,
			_Selection
		>
	}
	& {
		readonly [
			_FieldName in EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath> as (
				_FieldName extends EntityProxyProjectionResourceFieldName<_Schema, _EntityType, _FacetPath> ?
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
	& EntityProxyProjectionReservedProperties<_Schema, _EntityType, _FacetPath>
	& {
		readonly [
			_FacetName in EntityFacetName<_Schema, _EntityType, _FacetPath>
		]: EntityProxyProjectionResource<_Schema, _EntityType, [..._FacetPath, _FacetName]>
	}
)

export type EntityProxyData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = EntityResourceData<_Schema, _EntityType, _Selection>

type MergeSubscribeSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Base extends SubscribeSelection<_Schema, _EntityType>,
	_Override extends SubscribeSelection<_Schema, _EntityType>,
> = (
	& Omit<_Base, keyof _Override | 'fields'>
	& Omit<_Override, 'fields'>
	& {
		readonly fields: (
			& (_Base extends { readonly fields: infer _Fields } ? _Fields : {})
			& (_Override extends { readonly fields: infer _Fields } ? _Fields : {})
		)
	}
)

export type EntityProxyResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = (
	& SvelteKitResource<EntityProxyData<_Schema, _EntityType, _Selection>>
	& (<
		const _Override extends SubscribeSelection<_Schema, _EntityType> = {},
	>(
		selection?: _Override & CheckedSubscribeSelection<_Schema, _EntityType, _Override>
	) => EntityProxyResource<
		_Schema,
		_EntityType,
		MergeSubscribeSelection<_Schema, _EntityType, _Selection, _Override>
	>)
	& EntityProxyReservedProperties<_Schema, _EntityType>
	& {
		[EntityProxyField]: <
			const _FieldName extends Extract<
				EntityBaseFieldName<_Schema, _EntityType>,
				EntityProxyResourceFieldName<_Schema, _EntityType>
			> = Extract<
				EntityBaseFieldName<_Schema, _EntityType>,
				EntityProxyResourceFieldName<_Schema, _EntityType>
			>,
			const _Selection extends SubscribeSelection<
				_Schema,
				EntityProxyFieldSelectionEntityType<
					_Schema,
					_EntityType,
					EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
				>
			> = {},
		>(
			fieldName: _FieldName,
			selection?: _Selection & CheckedSubscribeSelection<
				_Schema,
				EntityProxyFieldSelectionEntityType<
					_Schema,
					_EntityType,
					EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
				>,
				_Selection
			>
		) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName, _Selection>
		value: {
			entitySelector: EntitySelector<_Schema, _EntityType>
			[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
		}
		[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	}
	& {
		readonly [
			_FieldName in EntityBaseFieldName<_Schema, _EntityType> as (
				_FieldName extends EntityProxyResourceFieldName<_Schema, _EntityType> ?
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

type RegisteredEntityProxyDataByType = {
	readonly [_EntityType in RegisteredEntityType]: EntityProxyData<
		RegisteredSchema,
		_EntityType
	>
}

type RegisteredEntityProxyResourceByType = {
	readonly [_EntityType in RegisteredEntityType]: EntityProxyResource<
		RegisteredSchema,
		_EntityType
	>
}

type RegisteredEntityProxyEntitiesResourceByType = {
	readonly [_EntityType in RegisteredEntityType]: EntityProxyEntitiesResource<
		RegisteredSchema,
		_EntityType
	>
}

export type RegisteredEntityProxyData<
	_EntityType extends RegisteredEntityType,
> = RegisteredEntityProxyDataByType[_EntityType]

export type RegisteredEntityProxyResource<
	_EntityType extends RegisteredEntityType,
> = RegisteredEntityProxyResourceByType[_EntityType]

export type RegisteredEntityProxyEntitiesResource<
	_EntityType extends RegisteredEntityType,
> = RegisteredEntityProxyEntitiesResourceByType[_EntityType]

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

const selectionForField = (
	selection: SubscribeSelection<Schema, EntityType<Schema>, object>,
	facetPath: readonly string[],
	fieldName: string,
	override?: SubscribeSelection<Schema, EntityType<Schema>, object>
): SubscribeSelection<Schema, EntityType<Schema>, object> => {
	let projectionSelection: object | undefined = selection
	for (const facetName of facetPath) {
		const facetSelection: true | object | undefined = Object.getOwnPropertyDescriptor(
			Object.getOwnPropertyDescriptor(projectionSelection, 'fields')?.value ?? {},
			facetName
		)?.value
		if (facetSelection === undefined || facetSelection === true) {
			projectionSelection = undefined
			break
		}

		projectionSelection = facetSelection
	}
	const selectedField = override ?? (
		projectionSelection === undefined ?
			undefined
		:
			Object.getOwnPropertyDescriptor(
				Object.getOwnPropertyDescriptor(projectionSelection, 'fields')?.value ?? {},
				fieldName
			)?.value
	)
	return {
		...selection,
		fields: undefined,
		...(selectedField === undefined || selectedField === true ? {} : selectedField),
	}
}

const resourceProperty = <_Data>(
	getResource: () => SvelteKitResource<_Data>,
	project: (data: _Data) => _Data,
	property: PropertyKey,
	projectAsync: (data: _Data) => _Data | Promise<_Data> = project
) => {
	if (property === 'then')
		return (
			onfulfilled?: Parameters<Promise<_Data>['then']>[0],
			onrejected?: Parameters<Promise<_Data>['then']>[1]
		) => getResource().then(
			onfulfilled == null ?
				undefined
			:
				(data) => Promise.resolve(projectAsync(data)).then(onfulfilled),
			onrejected
		)
		if (property === 'catch')
			return (
				onrejected?: Parameters<Promise<_Data>['catch']>[0]
			) => getResource().then(projectAsync).catch(onrejected)
		if (property === 'finally')
			return (
				onfinally?: Parameters<Promise<_Data>['finally']>[0]
			) => getResource().then(projectAsync).finally(onfinally)
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

const projectEntityData = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	data: EntityResourceData<_Schema, _EntityType, _Selection>
): EntityProxyData<_Schema, _EntityType, _Selection> => ({
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

export function createEntityFieldProxy<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>,
	const _Selection extends SubscribeSelection<
		_Schema,
		EntityProxyFieldSelectionEntityType<
			_Schema,
			_EntityType,
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		>
	> = SubscribeSelection<
		_Schema,
		EntityProxyFieldSelectionEntityType<
			_Schema,
			_EntityType,
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		>
	>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection?: _Selection & CheckedSubscribeSelection<
		_Schema,
		EntityProxyFieldSelectionEntityType<
			_Schema,
			_EntityType,
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		>,
		_Selection
	>,
	fieldDefinition?: EntityFieldDefinition
): EntityProxyFieldResource<_Schema, _EntityType, _FieldName, _Selection>
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
	const referenceResourceBySelector = new Map<string, SvelteKitResource<EntityResourceData<Schema, EntityType<Schema>>>>()
	const getReferenceResource = (value: object) => {
		if (
			resolvedFieldDefinition.type !== EntityFieldType.EntityReference
			&& resolvedFieldDefinition.type !== EntityFieldType.EntitiesReference
		)
			return undefined
		const referenceSelector = Object.getOwnPropertyDescriptor(
			value,
			EntityMetaKey.Selector
		)?.value
		if (referenceSelector === undefined)
			return undefined
		const referenceSelectorKey = JSON.stringify(referenceSelector)
		if (!referenceResourceBySelector.has(referenceSelectorKey))
			referenceResourceBySelector.set(
				referenceSelectorKey,
				subscribeEntity(
					context,
					resolvedFieldDefinition.entityType,
					referenceSelector,
					selection
				)
			)

		return referenceResourceBySelector.get(referenceSelectorKey)
	}
	const projectReference = (value: object | undefined) => {
		if (value == null)
			return undefined

		const reference = getReferenceResource(value)?.current
		return {
			...value,
			...(reference === undefined ? {} : projectEntityData(reference)),
			...(EntityMetaKey.Selector in value ? {
				entitySelector: value[EntityMetaKey.Selector],
			} : {}),
		}
	}
	const projectReferenceAsync = async (value: object | undefined) => {
		if (value == null)
			return undefined

		const referenceResource = getReferenceResource(value)
		const reference = referenceResource === undefined ? undefined : await referenceResource
		return {
			...value,
			...(reference === undefined ? {} : projectEntityData(reference)),
			...(EntityMetaKey.Selector in value ? {
				entitySelector: value[EntityMetaKey.Selector],
			} : {}),
		}
	}
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
				values: data.values.map(projectReference),
				entities: data.values.map(projectReference),
			}
			: (
				data !== undefined
				&& data !== null
				&& typeof data === 'object' ?
					projectReference(data)
				:
					data === null ? undefined : data
			)
	)
	const projectAsync = async (
		data: EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	): Promise<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> => (
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
				values: await Promise.all(data.values.map(projectReferenceAsync)),
				entities: await Promise.all(data.values.map(projectReferenceAsync)),
			}
			: (
				data !== undefined
				&& data !== null
				&& typeof data === 'object' ?
					await projectReferenceAsync(data)
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
				property,
				projectAsync
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
					if (fieldDefinition === undefined)
						throw new Error(`${entityType}.${[...facetPath, fieldName].join('.')} does not exist`)
					if (
						fieldName !== 'current'
						&& fieldName !== 'loading'
						&& fieldName !== 'ready'
						&& fieldName !== 'error'
						&& fieldName !== 'then'
						&& fieldName !== 'catch'
						&& fieldName !== 'finally'
						&& fieldName !== 'entityType'
						&& fieldName !== 'entitySelector'
						&& fieldName !== 'facetPath'
						&& fieldName !== 'sources'
					)
						throw new Error(`${entityType}.${[...facetPath, fieldName].join('.')} does not collide with a projection resource property`)

					return createEntityFieldProxy(
						context,
						entityType,
						entitySelector,
						fieldDefinition.name,
						selectionForField(
							selection,
							facetPath,
							fieldName,
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
			if (svelteKitResourceProperties.has(property))
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
				throw new Error(`${entityType}.${[...facetPath, property].join('.')} does not exist`)

			if (!fieldProxyByName.has(property))
				fieldProxyByName.set(
					property,
					createEntityFieldProxy(
						context,
						entityType,
						entitySelector,
						fieldDefinition.name,
						selectionForField(
							selection,
							facetPath,
							property
						),
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
	const _Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: _Selection & CheckedSubscribeSelection<_Schema, _EntityType, _Selection>
): EntityProxyResource<_Schema, _EntityType, _Selection>
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
					) => {
						const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][
							entityFieldAddressKey(entityType, [], fieldName)
						]
						if (fieldDefinition === undefined)
							throw new Error(`${entityType}.${fieldName} does not exist`)
						if (
							fieldName !== 'current'
							&& fieldName !== 'loading'
							&& fieldName !== 'ready'
							&& fieldName !== 'error'
							&& fieldName !== 'then'
							&& fieldName !== 'catch'
							&& fieldName !== 'finally'
							&& fieldName !== 'entity'
							&& fieldName !== 'entityType'
							&& fieldName !== 'entitySelector'
							&& fieldName !== 'sources'
							&& fieldName !== 'value'
						)
							throw new Error(`${entityType}.${fieldName} does not collide with an entity resource property`)

						return createEntityFieldProxy(
							context,
							entityType,
							entitySelector,
							fieldDefinition.name,
							selectionForField(
								selection,
								[],
								fieldName,
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
			if (svelteKitResourceProperties.has(property))
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
								selectionForField(
									selection,
									[],
									property
								),
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

			if (typeof property === 'string')
				throw new Error(`${entityType}.${property} does not exist`)

			return undefined
		},
	})
}
