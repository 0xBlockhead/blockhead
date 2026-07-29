import {
	TanStackLiveQueryResource,
	type SvelteKitResource,
} from '$/lib/db/queryResource.svelte.ts'
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
	subscribeEntityFieldCount,
	type EntityFieldResourceData,
	type EntityResourceData,
} from '$/client/$subscribe.svelte.ts'
import {
	EntityMetaKey,
	ProjectionResolution,
	evaluateEntityFacetConditionPlan,
	type EntityBaseFieldName,
	type EntityFacetConditionPlan,
	type EntityFacetFieldDefinitionAtPath,
	type EntityFacetFieldNameAtPath,
	type EntityFacetName,
	type EntityFacetPath,
	type EntityFieldAddress,
	type EntityFieldDefinition,
	type EntityFieldDefinitionAtPath,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldSingleResolvedValueFromDefinition,
	type EntitySelector,
	type EntityType,
	type ProjectionValue,
	type Schema,
	entityFieldCardinalityIsMultiple,
	entityFieldAddressKey,
	entitySelectorKey,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'


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

type EntityProxyEntitiesRelationshipFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = Extract<
	EntityFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath>,
	{
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: EntityType<_Schema>
	}
>

type EntityProxyEntitiesRelationshipProperties<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[] = [],
> = (
	& {
		readonly [
			_FieldDefinition in EntityProxyEntitiesRelationshipFieldDefinition<
				_Schema,
				_EntityType,
				_FacetPath
			> as _FieldDefinition['name']
		]: _FieldDefinition extends {
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			EntityProxyEntitiesResource<_Schema, _ReferencedEntityType>
		:
			never
	}
	& {
		readonly [
			_FacetName in EntityFacetName<_Schema, _EntityType, _FacetPath>
		]: EntityProxyEntitiesRelationshipProperties<
			_Schema,
			_EntityType,
			[
				..._FacetPath,
				_FacetName,
			]
		>
	}
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
	& (
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		} ?
			{
				count: (
					& SvelteKitResource<number>
					& ((selection?: {
						readonly sources?: readonly string[]
					}) => SvelteKitResource<number>)
				)
			}
		:
			{}
	)
	& (
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly type: EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			EntityProxyEntitiesRelationshipProperties<_Schema, _ReferencedEntityType>
		:
			{}
	)
)

export type EntityProxyEntitiesData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = {
	values: readonly SubscribeEntityReferenceResult<_Schema, _EntityType, _Selection>[]
	entities: readonly SubscribeEntityReferenceResult<_Schema, _EntityType, _Selection>[]
}

type EntityReferencePathData = {
	values: readonly object[]
	entities: readonly object[]
}

type EntityReferencePathResult =
	| EntityReferencePathData
	| ProjectionValue<object>

type EntityReferencePathStep = {
	entityType: EntityType<Schema>
	facetPath: readonly string[]
	fieldName: string
	selection?: SubscribeSelection<Schema, EntityType<Schema>, object>
}

export type EntityProxyEntitiesResource<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = (
	& SvelteKitResource<EntityProxyEntitiesData<_Schema, _EntityType, _Selection>>
	& (<
		const _NextSelection extends SubscribeSelection<_Schema, _EntityType> = {},
	>(
		selection?: _NextSelection & CheckedSubscribeSelection<
			_Schema,
			_EntityType,
			_NextSelection
		>
	) => EntityProxyEntitiesResource<
		_Schema,
		_EntityType,
		_NextSelection
	>)
	& {
		entityType: EntityType<_Schema>
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>
		fieldName: EntityFieldName<_Schema, EntityType<_Schema>>
		sources?: readonly string[]
	}
	& EntityProxyEntitiesRelationshipProperties<_Schema, _EntityType>
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
	& (
		_FieldDefinition extends {
			readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		} ?
			{
				count: (
					& SvelteKitResource<number>
					& ((selection?: {
						readonly sources?: readonly string[]
					}) => SvelteKitResource<number>)
				)
			}
		:
			{}
	)
	& (
		_FieldDefinition extends {
			readonly type: EntityFieldType.EntitiesReference
			readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
		} ?
			EntityProxyEntitiesRelationshipProperties<_Schema, _ReferencedEntityType>
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

export type EntityProxyEntitiesSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& {
		sources?: readonly string[]
	}
	& (<
			const _Selection extends SubscribeSelection<_Schema, _EntityType> = {},
		>(
			selection?: _Selection & CheckedSubscribeSelection<_Schema, _EntityType, _Selection>
		) => SvelteKitResource<{
			readonly values: readonly SubscribeEntityReferenceResult<_Schema, _EntityType, _Selection>[]
		}>)
)

export type EntityProxyData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = EntityResourceData<_Schema, _EntityType, _Selection>

type EntityProxyPrefetchedSingleFieldData<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityProxyPrefetchedData<_Schema, _ReferencedEntityType>
	:
		EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>
)

type EntityProxyPrefetchedFieldData<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			readonly values: readonly EntityProxyPrefetchedSingleFieldData<_Schema, _FieldDefinition>[]
			readonly entities: readonly EntityProxyPrefetchedSingleFieldData<_Schema, _FieldDefinition>[]
		}
	:
		_FieldDefinition extends {
			readonly cardinality: EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Zero
		} ?
			EntityProxyPrefetchedSingleFieldData<_Schema, _FieldDefinition> | undefined
		:
			EntityProxyPrefetchedSingleFieldData<_Schema, _FieldDefinition>
)

export type EntityProxyPrefetchedData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& Partial<{
		readonly [
			_FieldName in EntityFieldName<_Schema, _EntityType>
		]: EntityProxyPrefetchedFieldData<
			_Schema,
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		>
	}>
	& {
		readonly [EntityMetaKey.Selector]?: EntitySelector<_Schema, _EntityType>
	}
)

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

export type RegisteredEntityProxyData<
	_EntityType extends RegisteredEntityType,
> = EntityProxyData<
	RegisteredSchema,
	_EntityType
>

export type RegisteredEntityProxyPrefetchedData<
	_EntityType extends RegisteredEntityType,
> = EntityProxyPrefetchedData<
	RegisteredSchema,
	_EntityType
>

export type RegisteredEntityProxyResource<
	_EntityType extends RegisteredEntityType,
> = EntityProxyResource<
	RegisteredSchema,
	_EntityType
>

export type RegisteredEntityProxyEntitiesResource<
	_EntityType extends RegisteredEntityType,
> = EntityProxyEntitiesResource<
	RegisteredSchema,
	_EntityType
>

export type RegisteredEntityProxyEntitiesSelection<
	_EntityType extends RegisteredEntityType,
> = EntityProxyEntitiesSelection<
	RegisteredSchema,
	_EntityType
>

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
	...((
		base.fields !== undefined
		|| override?.fields !== undefined
	) && {
		fields: {
			...base.fields,
			...override?.fields,
		},
	}),
})

const selectionForField = (
	selection: SubscribeSelection<Schema, EntityType<Schema>, object>,
	facetPath: readonly string[],
	fieldDefinition: EntityFieldDefinition,
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
				fieldDefinition.name
			)?.value
	)
	return {
		...selection,
		fields: undefined,
		...(fieldDefinition.defaultSources == null ? {} : {
			sources: undefined,
		}),
		...(selectedField === undefined || selectedField === true ? {} : selectedField),
	}
}

const resourceProperty = <_Data>(
	getResource: () => SvelteKitResource<_Data>,
	project: (data: _Data) => _Data,
	property: PropertyKey,
	projectAsync: (data: _Data) => _Data | Promise<_Data> = project
) => {
	if (property === 'then') {
		const then = getResource().then
		return (
			onfulfilled?: Parameters<Promise<_Data>['then']>[0],
			onrejected?: Parameters<Promise<_Data>['then']>[1]
		) => then(
			onfulfilled == null ?
				undefined
			:
				(data) => Promise.resolve(projectAsync(data)).then(onfulfilled),
			onrejected
		)
	}
	if (property === 'catch') {
		const then = getResource().then
		return (
			onrejected?: Parameters<Promise<_Data>['catch']>[0]
		) => then(projectAsync).catch(onrejected)
	}
	if (property === 'finally') {
		const then = getResource().then
		return (
			onfinally?: Parameters<Promise<_Data>['finally']>[0]
		) => then(projectAsync).finally(onfinally)
	}
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
	get then(): Promise<_Output>['then'] {
		const then = resource.then
		return (onfulfilled, onrejected) => (
			then(
				onfulfilled == null ?
					undefined
				:
					(data) => onfulfilled(project(data)),
				onrejected
			)
		)
	},
	get catch(): Promise<_Output>['catch'] {
		const then = resource.then
		return (onrejected) => then(project).catch(onrejected)
	},
	get finally(): Promise<_Output>['finally'] {
		const then = resource.then
		return (onfinally) => then(project).finally(onfinally)
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

const projectionConditionResolution = <
	_Value extends object,
>(
	data: EntityResourceData<Schema, EntityType<Schema>>,
	conditionPlan: EntityFacetConditionPlan,
	value: _Value
): ProjectionValue<_Value> | undefined => {
	const dependencyValues = conditionPlan.dependencies.map((dependency) => (
		entityDataFieldValue(data, dependency.fieldName, dependency.facetPath)
	))
	const resolution = evaluateEntityFacetConditionPlan(conditionPlan, dependencyValues)
	return (
		resolution === ProjectionResolution.Applicable ?
			{
				resolution: ProjectionResolution.Applicable,
				value,
			}
		: resolution === ProjectionResolution.Blocked ?
			{
				resolution: ProjectionResolution.Blocked,
				dependencies: conditionPlan.dependencies.filter((_, index) => dependencyValues[index] === undefined),
			}
		: resolution === ProjectionResolution.NotApplicable ?
			{
				resolution: ProjectionResolution.NotApplicable,
			}
		:
			{
				resolution: ProjectionResolution.Unsupported,
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
	let resource: TanStackLiveQueryResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>> | undefined
	let countResource: SvelteKitResource<number> | undefined
	const resolvedFieldDefinition = fieldDefinition ?? context.entityDefinitionByType[entityType].fields
		.find((definition) => definition.name === fieldName)
	if (resolvedFieldDefinition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)
	const getResource = () => {
		if (resource === undefined)
			resource = subscribeEntityField(
				context,
				entityType,
				entitySelector,
				fieldName,
				selection,
				resolvedFieldDefinition
			)

		return resource
	}
	const referenceSelector = (value: object) => {
		if (
			resolvedFieldDefinition.type !== EntityFieldType.EntityReference
			&& resolvedFieldDefinition.type !== EntityFieldType.EntitiesReference
		)
			return undefined

		return (
			Object.getOwnPropertyDescriptor(value, EntityMetaKey.Selector)?.value
			?? Object.getOwnPropertyDescriptor(value, 'entitySelector')?.value
			?? value
		)
	}
	const projectedReference = (value: object) => {
		const selector = referenceSelector(value)
		return {
			...value,
			...(selector === undefined ? {} : selector),
			...(selector === undefined ? {} : {
				[EntityMetaKey.Selector]: selector,
				entitySelector: selector,
			}),
		}
	}
	const projectReference = (value: object | undefined) => {
		if (value == null)
			return undefined

		return projectedReference(value)
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
			if (property === 'count') {
				if (!entityFieldCardinalityIsMultiple(resolvedFieldDefinition.cardinality))
					return undefined

				return new Proxy((
					selectionOverride?: {
						readonly sources?: readonly string[]
					}
				) => subscribeEntityFieldCount(
					context,
					entityType,
					entitySelector,
					fieldName,
					{
						sources: selectionOverride?.sources ?? selection.sources,
					},
					resolvedFieldDefinition
				), {
					apply(_countTarget, _countThisArgument, countArgumentsList) {
						return subscribeEntityFieldCount(
							context,
							entityType,
							entitySelector,
							fieldName,
							{
								sources: countArgumentsList[0]?.sources ?? selection.sources,
							},
							resolvedFieldDefinition
						)
					},
					get(_countTarget, countProperty) {
						if (countResource === undefined)
							countResource = subscribeEntityFieldCount(
								context,
								entityType,
								entitySelector,
								fieldName,
								{
									sources: selection.sources,
								},
								resolvedFieldDefinition
							)

						return resourceProperty(
							() => countResource ??= subscribeEntityFieldCount(
								context,
								entityType,
								entitySelector,
								fieldName,
								{
									sources: selection.sources,
								},
								resolvedFieldDefinition
							),
							(count) => count,
							countProperty
						)
					},
				})
			}
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
			if (
				resolvedFieldDefinition.type === EntityFieldType.EntitiesReference
				&& !svelteKitResourceProperties.has(property)
			)
				return entityReferencePathProperty(
					context,
					projectResource(
						getResource(),
						(data) => {
							const values = (
								data != null
								&& typeof data === 'object'
								&& 'values' in data
								&& Array.isArray(data.values) ?
									data.values.filter((value): value is object => (
										value !== null
										&& typeof value === 'object'
									))
								:
									[]
							)
							return {
								values,
								entities: values,
							}
						}
					),
					entitySelector,
					resolvedFieldDefinition.entityType,
					[],
					[],
					property
				)

			return resourceProperty(
				getResource,
				project,
				property,
				project
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
					data,
					projectionDefinition?.conditionPlan ?? {
						dependencies: [],
						predicates: [],
					},
					projectionProxy
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
							fieldDefinition,
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
							fieldDefinition
						),
						fieldDefinition
					)
				)

			return fieldProxyByName.get(property)
		},
	})
	return projectionProxy
}

const entityReferencePathProperty = (
	context: ClientContext,
	source: SvelteKitResource<EntityReferencePathData>,
	sourceEntitySelector: EntitySelector<Schema, EntityType<Schema>>,
	targetEntityType: EntityType<Schema>,
	steps: readonly EntityReferencePathStep[],
	facetPath: readonly string[],
	property: PropertyKey
) => {
	if (typeof property !== 'string')
		return undefined

	const nestedFacetPath = [
		...facetPath,
		property,
	]
	if (
		context.projectionDefinitionByEntityTypeAndPath[
			entityFieldAddressKey(targetEntityType, nestedFacetPath, '')
		] !== undefined
	)
		return createEntityReferencePathProxy(
			context,
			source,
			sourceEntitySelector,
			targetEntityType,
			steps,
			nestedFacetPath
		)

	const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[targetEntityType][
		entityFieldAddressKey(targetEntityType, facetPath, property)
	]
	if (
		fieldDefinition == null
		|| (
			fieldDefinition.type !== EntityFieldType.EntityReference
			&& fieldDefinition.type !== EntityFieldType.EntitiesReference
		)
	)
		return undefined

	return createEntityReferencePathProxy(
		context,
		source,
		sourceEntitySelector,
		fieldDefinition.entityType,
		[
			...steps,
			{
				entityType: targetEntityType,
				facetPath,
				fieldName: fieldDefinition.name,
			},
		],
		[]
	)
}

const createEntityReferencePathProxy = (
	context: ClientContext,
	source: SvelteKitResource<EntityReferencePathData>,
	sourceEntitySelector: EntitySelector<Schema, EntityType<Schema>>,
	targetEntityType: EntityType<Schema>,
	steps: readonly EntityReferencePathStep[],
	facetPath: readonly string[]
): object => {
	const projectionResourceByStepAndSelector = new Map<string, SvelteKitResource<ProjectionValue<Record<PropertyKey, never>>>>()
	const fieldResourceByStepAndSelector = new Map<string, SvelteKitResource<EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>>>()
	const terminalProjectionResourceBySelector = new Map<string, SvelteKitResource<ProjectionValue<object>>>()
	let proxy: object
	const referenceValues = (
		fieldDefinition: EntityFieldDefinition,
		fieldValue: EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	): object[] => {
		if (fieldValue == null)
			return []
		if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			if (
				typeof fieldValue !== 'object'
				|| !('values' in fieldValue)
				|| !Array.isArray(fieldValue.values)
			)
				return []

			return fieldValue.values.filter((value): value is object => (
				value !== null
				&& typeof value === 'object'
			))
		}

		return typeof fieldValue === 'object' ? [fieldValue] : []
	}

	const terminalProjectionResource = (
		reference: object
	) => {
		const selector = Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
			?? Object.getOwnPropertyDescriptor(reference, 'entitySelector')?.value
			?? reference
		const selectorKey = entitySelectorKey(
			context.schema,
			context.entityDefinitionByType[targetEntityType],
			selector
		)
		const resourceKey = `${steps.length}:${facetPath.join('.')}:${selectorKey}`
		if (!terminalProjectionResourceBySelector.has(resourceKey))
			terminalProjectionResourceBySelector.set(
				resourceKey,
				projectResource(
					subscribeEntity(
						context,
						targetEntityType,
						selector,
						{
							selectorSources: [],
							fields: projectionDependencyFields(
								context.projectionDefinitionByEntityTypeAndPath[
									entityFieldAddressKey(targetEntityType, facetPath, '')
								]?.transitiveDependencies ?? []
							),
						}
					),
					(data) => projectionConditionResolution(
						data,
						context.projectionDefinitionByEntityTypeAndPath[
							entityFieldAddressKey(targetEntityType, facetPath, '')
						]?.conditionPlan ?? {
							dependencies: [],
							predicates: [],
						},
						proxy
					) ?? {
						resolution: ProjectionResolution.Unsupported,
					}
				)
			)

		return terminalProjectionResourceBySelector.get(resourceKey)!
	}

	const terminalProjection = (
		projections: readonly ProjectionValue<object>[]
	): ProjectionValue<object> => {
		if (projections.some((projection) => projection.resolution === ProjectionResolution.Applicable))
			return {
				resolution: ProjectionResolution.Applicable,
				value: proxy,
			}

		const blocked = projections.filter((projection) => projection.resolution === ProjectionResolution.Blocked)
		if (blocked.length > 0)
			return {
				resolution: ProjectionResolution.Blocked,
				dependencies: blocked.flatMap((projection) => projection.dependencies),
			}

		if (projections.some((projection) => projection.resolution === ProjectionResolution.NotApplicable))
			return {
				resolution: ProjectionResolution.NotApplicable,
			}

		return {
			resolution: ProjectionResolution.Unsupported,
		}
	}

	const traverse = (
		sourceData: EntityReferencePathData
	): EntityReferencePathResult | undefined => {
		let references = [...sourceData.values]
		for (const [
			stepIndex,
			step,
		] of steps.entries()) {
			const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[step.entityType][
				entityFieldAddressKey(step.entityType, step.facetPath, step.fieldName)
			]
			if (fieldDefinition == null)
				throw new Error(`${step.entityType}.${[...step.facetPath, step.fieldName].join('.')} does not exist`)
			if (
				fieldDefinition.type !== EntityFieldType.EntityReference
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
				throw new Error(`${step.entityType}.${[...step.facetPath, step.fieldName].join('.')} does not reference an entity`)
			const referencedEntityType = fieldDefinition.entityType

			const nextReferences: object[] = []
			for (const reference of references) {
				const selector = Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
				?? Object.getOwnPropertyDescriptor(reference, 'entitySelector')?.value
				?? reference
				const selectorKey = entitySelectorKey(
					context.schema,
					context.entityDefinitionByType[step.entityType],
					selector
				)
				const resourceKey = `${stepIndex}:${selectorKey}:${step.selection?.sources?.join(',') ?? ''}`
				if (step.facetPath.length > 0) {
					if (!projectionResourceByStepAndSelector.has(resourceKey))
						projectionResourceByStepAndSelector.set(
							resourceKey,
							projectResource(
								subscribeEntity(
									context,
									step.entityType,
									selector,
									{
										selectorSources: [],
										fields: projectionDependencyFields(
											context.projectionDefinitionByEntityTypeAndPath[
												entityFieldAddressKey(step.entityType, step.facetPath, '')
											]?.transitiveDependencies ?? []
										),
									}
								),
								(data) => projectionConditionResolution(
									data,
									context.projectionDefinitionByEntityTypeAndPath[
										entityFieldAddressKey(step.entityType, step.facetPath, '')
									]?.conditionPlan ?? {
										dependencies: [],
										predicates: [],
									},
									{}
								) ?? {
									resolution: ProjectionResolution.Unsupported,
								}
							)
						)

					const projectionResource = projectionResourceByStepAndSelector.get(resourceKey)!
					if (projectionResource.error !== undefined)
						continue
					if (!projectionResource.ready)
						return undefined
					if (projectionResource.current?.resolution !== ProjectionResolution.Applicable)
						continue
				}
				if (!fieldResourceByStepAndSelector.has(resourceKey))
					fieldResourceByStepAndSelector.set(
						resourceKey,
						createEntityFieldProxy(
							context,
							step.entityType,
							selector,
							fieldDefinition.name,
							step.selection ?? {},
							fieldDefinition
						)
					)

				const fieldResource = fieldResourceByStepAndSelector.get(resourceKey)!
				if (fieldResource.error !== undefined)
					continue
				if (!fieldResource.ready)
					return undefined

				nextReferences.push(...referenceValues(
					fieldDefinition,
					fieldResource.current
				))
			}
			references = [...new Map(nextReferences.map((reference) => {
				const selector = Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
					?? Object.getOwnPropertyDescriptor(reference, 'entitySelector')?.value
					?? reference
				return [
					entitySelectorKey(
						context.schema,
						context.entityDefinitionByType[referencedEntityType],
						selector
					),
					reference,
				]
			})).values()]
		}

		if (facetPath.length > 0) {
			const projections = references.map((reference) => terminalProjectionResource(reference))
			if (projections.some((projection) => !projection.ready))
				return undefined

			return terminalProjection(projections.map((projection) => projection.current!))
		}

		return {
			values: references,
			entities: references,
		}
	}

	const pathSnapshot = () => {
		const sourceData = source.current
		const data = sourceData === undefined ? undefined : traverse(sourceData)
		const error = (
			source.error
			?? [...projectionResourceByStepAndSelector.values()]
				.find((resource) => resource.error !== undefined)?.error
			?? [...fieldResourceByStepAndSelector.values()]
				.find((resource) => resource.error !== undefined)?.error
		)
		return {
			data: data ?? {
				values: [],
				entities: [],
			},
			isLoading: error === undefined && data === undefined,
			isReady: error === undefined && data !== undefined,
			isError: error !== undefined,
			status: error === undefined && data !== undefined ? 'ready' : 'loading',
			error,
		} as const
	}
	const pathResource = new TanStackLiveQueryResource<EntityReferencePathResult>(
		pathSnapshot,
		(update) => {
			if (typeof window === 'undefined')
				return () => {}

			const unsubscribeEffect = $effect.root(() => {
				$effect(() => {
					pathSnapshot()
					update()
				})
			})
			return unsubscribeEffect
		},
		async () => {
			await source
			while (pathSnapshot().isLoading) {
				const pendingResources = [
					...projectionResourceByStepAndSelector.values(),
					...fieldResourceByStepAndSelector.values(),
					...terminalProjectionResourceBySelector.values(),
				].filter((resource) => (
					!resource.ready
					&& resource.error === undefined
				))
				if (pendingResources.length === 0)
					return

				await Promise.all(pendingResources.map((resource) => (
					resource.catch(() => undefined)
				)))
			}
		}
	)
	const withTerminalSelection = (
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>, object>
	) => createEntityReferencePathProxy(
		context,
		source,
		sourceEntitySelector,
		targetEntityType,
		steps.map((step, index) => (
			index === steps.length - 1 ?
				{
					...step,
					selection: mergeSelection(
						step.selection ?? {},
						selectionOverride
					),
				}
			:
				step
		)),
		facetPath
	)

	proxy = new Proxy((
		selectionOverride?: SubscribeSelection<Schema, EntityType<Schema>, object>
	) => withTerminalSelection(selectionOverride), {
		apply(_target, _thisArgument, argumentsList) {
			return withTerminalSelection(argumentsList[0])
		},
		get(_target, property) {
			if (property === 'entityType')
				return targetEntityType
			if (property === 'entitySelector')
				return sourceEntitySelector
			if (property === 'fieldName')
				return steps.at(-1)?.fieldName
			if (property === 'sources')
				return steps.at(-1)?.selection?.sources

			if (svelteKitResourceProperties.has(property))
				return resourceProperty(
					() => pathResource,
					(data) => data,
					property
				)

			return entityReferencePathProperty(
				context,
				source,
				sourceEntitySelector,
				targetEntityType,
				steps,
				facetPath,
				property
			)
		},
	})

	return proxy
}

export function createEntityProxy<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: _Selection
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
								fieldDefinition,
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
									fieldDefinition
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
