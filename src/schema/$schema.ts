import { type as arktype } from 'arktype'
import { stringify } from 'devalue'

export enum EntityMetaKey {
	ParentId = '__parentId',
	ParentIdKey = '__parentIdKey',
	Id = '__id',
	IdKey = '__idKey',
	Source = '__source',
	Fields = '__fields',
	Value = '__value',
}

export enum EntityFieldType {
	Primitive = 'Primitive',
	EntityReference = 'EntityReference',
	EntitiesReference = 'EntitiesReference',
}

export enum EntityFieldEntryKind {
	Group = 'Group',
}

type SchemaType<_Value = unknown> = {
	readonly infer: _Value
	(data: unknown): _Value | InstanceType<typeof arktype.errors>
}

export type EntityDefinition<
	_EntityType extends string = string,
	_Source extends string = string,
	_EntityId extends object = object,
> = {
	readonly entityType: _EntityType
	readonly label: string
	readonly labelPlural: string
	readonly id: SchemaType<_EntityId>
	readonly lookups?: readonly EntityLookupDefinition[]
	readonly identities?: readonly EntityIdentityDefinition[]
	readonly fields: readonly EntityFieldEntry<_Source>[]
}

export type EntityLookupDefinition = {
	readonly name: string
	readonly fields: readonly EntityIdentityFieldDefinition[]
}

export type EntityIdentityDefinition = {
	readonly name: string
	readonly fields: readonly EntityIdentityFieldDefinition[]
}

export type EntityIdentityFieldDefinition = (
	| string
	| {
		readonly name: string
		readonly as?: string
		readonly normalize?: EntityIdentityValueNormalizer
	}
)

export type EntityIdentityValueNormalizer = (
	(value: unknown) => unknown
)

export type EntityIdProjectionName = string

export const EntityIdProjection = {
	Identity: 'Identity',
} as const

const entityIdentityFieldName = (
	field: EntityIdentityFieldDefinition,
) => (
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- Schema identity config intentionally supports string shorthand field definitions.
	typeof field === 'string' ?
		field
	:
		field.name
)

const entityIdentityFieldKey = (
	field: EntityIdentityFieldDefinition,
) => (
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- Schema identity config intentionally supports string shorthand field definitions.
	typeof field === 'string' ?
		field
	:
		field.as ?? field.name
)

export enum EntityFieldCardinality {
	Zero = 'Zero',
	One = 'One',
	ZeroOrOne = 'ZeroOrOne',
	Many = 'Many',
	ZeroOrMany = 'ZeroOrMany',
}

export type EntityFieldCondition<
	_FieldName extends string = string,
	_Value extends string | number = string | number,
> = {
	readonly fieldName: _FieldName
	readonly itemIndex?: number
	readonly values: readonly _Value[]
}

export type EntityFieldConditionKey<_Condition extends EntityFieldCondition> = (
	_Condition extends {
		itemIndex: infer _ItemIndex extends number
	} ?
		`${_Condition['fieldName']}[${_ItemIndex}]`
	:
		_Condition['fieldName']
)

export const entityFieldConditionKey = (
	condition: EntityFieldCondition,
) => (
	condition.itemIndex == null ?
		condition.fieldName
	:
		`${condition.fieldName}[${condition.itemIndex}]`
)

export const entityFieldCardinalityIsMultiple = (
	cardinality: EntityFieldCardinality,
) => (
	cardinality === EntityFieldCardinality.Many
	|| cardinality === EntityFieldCardinality.ZeroOrMany
)

export const entityFieldPrimitiveValueIsValid = (
	fieldDefinition: Extract<EntityFieldDefinition, {
		readonly type: EntityFieldType.Primitive
	}>,
	value: unknown,
) => !(fieldDefinition.primitiveType(value) instanceof arktype.errors)

export type EntityFieldDefinition<_Source extends string = string> = (
	& {
		defaultSources?: _Source[]
		when?: EntityFieldCondition
	}
	& (
		| {
			name: string
			type: EntityFieldType.Primitive
			primitiveType: SchemaType
			cardinality: EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		}
		| {
			name: `$${string}`
			type: EntityFieldType.EntityReference
			entityType: string
			entityId?: SchemaType
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
		}
		| {
			name: `$$${string}`
			type: EntityFieldType.EntitiesReference
			entityType: string
			entityId?: SchemaType
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		}
	)
)

export type EntityFieldGroupDefinition<_Source extends string = string> = {
	readonly kind: EntityFieldEntryKind.Group
	readonly when: EntityFieldCondition
	readonly fields: readonly EntityFieldDefinition<_Source>[]
}

export type EntityFieldEntry<_Source extends string = string> = (
	| EntityFieldDefinition<_Source>
	| EntityFieldGroupDefinition<_Source>
)

export type EntityFieldDefinitionFromEntry<_Entry> = (
	_Entry extends EntityFieldGroupDefinition ?
		_Entry['fields'][number] & {
			readonly when: _Entry['when']
		}
	:
		_Entry
)

export type EntityFieldDefinitions<_EntityDefinition extends EntityDefinition> = (
	EntityFieldDefinitionFromEntry<_EntityDefinition['fields'][number]>
)

export function entityFieldDefinitionsFromEntries<
	const _Fields extends readonly EntityFieldEntry[],
>(
	fields: _Fields,
): readonly EntityFieldDefinitionFromEntry<_Fields[number]>[]
export function entityFieldDefinitionsFromEntries(
	fields: readonly EntityFieldEntry[],
): readonly EntityFieldDefinition[] {
	return fields.flatMap((entry) => {
		if ('name' in entry)
			return [entry]

		return entry.fields.map((field) => ({
			...field,
			when: entry.when,
		}))
	})
}

export function entityFieldDefinitions<
	const _EntityDefinition extends EntityDefinition,
>(
	entityDefinition: _EntityDefinition,
): readonly EntityFieldDefinitions<_EntityDefinition>[]
export function entityFieldDefinitions(
	entityDefinition: EntityDefinition,
): readonly EntityFieldDefinition[] {
	return entityFieldDefinitionsFromEntries(entityDefinition.fields)
}
export type EntityIdFromDefinition<_EntityDefinition extends EntityDefinition> = (
	_EntityDefinition['id']['infer']
)

const entityIdentityObjectRecord = (
	value: object,
): Record<string, unknown> => Object.fromEntries(Object.entries(value))

const entityIdentityValue = (
	fieldName: string,
	value: unknown,
) => (
	fieldName.startsWith('$')
	&& value != null
	&& typeof value === 'object'
	&& !Array.isArray(value)
	&& EntityMetaKey.Id in value ?
		value[EntityMetaKey.Id]
	:
		value
)

export const entityIdProjectionNames = (
	entityDefinition: EntityDefinition,
): readonly EntityIdProjectionName[] => [
	EntityIdProjection.Identity,
	...(entityDefinition.identities ?? []).map((identity) => identity.name),
	...(entityDefinition.lookups ?? []).map((lookup) => lookup.name),
]

const entityIdHasOnlyKeys = (
	entityId: Record<string, unknown>,
	keys: readonly string[],
) => (
	Object.keys(entityId).length === keys.length
	&& keys.every((key) => key in entityId)
)

export const entityIdProjectionNameForId = (
	entityDefinition: EntityDefinition,
	entityId: object,
): EntityIdProjectionName | undefined => {
	if (entityDefinition.id(entityId) instanceof arktype.errors)
		return undefined

	const entityIdObject = entityIdentityObjectRecord(entityId)
	const lookup = (entityDefinition.lookups ?? []).find((candidate) => (
		entityIdHasOnlyKeys(
			entityIdObject,
			candidate.fields.map(entityIdentityFieldKey),
		)
	))
	if (lookup != null)
		return lookup.name

	const identity = (entityDefinition.identities ?? []).find((candidate) => (
		entityIdHasOnlyKeys(
			entityIdObject,
			candidate.fields.map(entityIdentityFieldKey),
		)
	))
	if (identity != null)
		return identity.name

	return (
		(entityDefinition.lookups ?? []).length === 0
		&& (entityDefinition.identities ?? []).length === 0 ?
			EntityIdProjection.Identity
	:
			undefined
	)
}

export const validateEntityId = (
	entityDefinition: EntityDefinition,
	entityId: object,
) => {
	const entityIdProjectionName = entityIdProjectionNameForId(
		entityDefinition,
		entityId,
	)
	if (entityIdProjectionName == null)
		throw new Error(`${entityDefinition.entityType}: invalid id ${stringify(entityId)}`)

	return {
		name: entityIdProjectionName,
		fields: (
			entityIdProjectionName === EntityIdProjection.Identity ?
				Object.keys(entityIdentityObjectRecord(entityId))
			:
				(
					entityDefinition.identities ?? []
				)
					.find((identity) => identity.name === entityIdProjectionName)
					?.fields
					.map(entityIdentityFieldKey)
				?? (
					entityDefinition.lookups ?? []
				)
					.find((lookup) => lookup.name === entityIdProjectionName)
					?.fields
					.map(entityIdentityFieldKey)
				?? []
		),
	}
}

export const entityIdKey = (
	entityDefinition: EntityDefinition,
	entityId: object,
) => stringify(validateEntityId(entityDefinition, entityId).fields.reduce<{
	readonly [_FieldName in string]: unknown
}>(
	(id, fieldName) => ({
		...id,
		[fieldName]: entityIdentityObjectRecord(entityId)[fieldName],
	}),
	{},
))

export const entityIdentityIdsFromFields = <const _EntityId extends object>(
	entityDefinition: EntityDefinition<string, string, _EntityId>,
	entityId: _EntityId,
	fields: Partial<Record<string, unknown>>,
): _EntityId[] => {
	const fieldValueByName = {
		...entityIdentityObjectRecord(entityId),
		...fields,
	}
	const identityIds = [
		entityId,
		...(entityDefinition.identities ?? []).flatMap((identity) => {
			const idValue = Object.fromEntries(
				identity.fields.flatMap((field) => {
					const fieldName = entityIdentityFieldName(field)
					const fieldValue = entityIdentityValue(
						fieldName,
						fieldValueByName[fieldName],
					)
					return fieldValue === undefined ?
						[]
					:
						[[
							entityIdentityFieldKey(field),
							// oxlint-disable-next-line no-runtime-shape-guards/guards -- Schema identity config intentionally supports string shorthand field definitions.
							typeof field === 'string' || field.normalize == null ?
								fieldValue
							:
								field.normalize(fieldValue),
						]]
				}),
			)

			if (Object.keys(idValue).length !== identity.fields.length)
				return []

			const identityId = entityDefinition.id(idValue)
			return identityId instanceof arktype.errors ?
				[]
			:
				[identityId]
		}),
	]
	const idKeys = new Set<string>()
	return identityIds.flatMap((identityId) => {
		const idKey = stringify(identityId)
		if (idKeys.has(idKey))
			return []

		idKeys.add(idKey)
		return [identityId]
	})
}

type NonConditionalScalarPrimitiveFieldName<
	_Fields extends readonly EntityFieldDefinition[],
> = Exclude<
	_Fields[number],
	{ when: EntityFieldCondition }
> extends infer _Field ?
	_Field extends {
		name: infer _FieldName extends string
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: string | number
		}
	} ?
		_FieldName
	:
	never
:
	never

type NonConditionalArrayPrimitiveFieldName<
	_Fields extends readonly EntityFieldDefinition[],
> = Exclude<
	_Fields[number],
	{ when: EntityFieldCondition }
> extends infer _Field ?
	_Field extends {
		name: infer _FieldName extends string
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: readonly (string | number)[]
		}
	} ?
		_FieldName
	:
		never
:
	never

type ScalarPrimitiveFieldValue<
	_Fields extends readonly EntityFieldDefinition[],
	_FieldName extends string,
> = _Fields[number] extends infer _Field ?
	_Field extends {
		name: _FieldName
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: infer _Value extends string | number
		}
	} ?
		_Value
	:
	never
:
	never

type ArrayPrimitiveFieldItemValue<
	_Fields extends readonly EntityFieldDefinition[],
	_FieldName extends string,
> = _Fields[number] extends infer _Field ?
	_Field extends {
		name: _FieldName
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: readonly (infer _Value extends string | number)[]
		}
	} ?
		_Value
	:
		never
:
	never

export function conditionalOn<
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalScalarPrimitiveFieldName<_Fields>,
	const _Values extends readonly ScalarPrimitiveFieldValue<_Fields, _FieldName>[],
>(
	_fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
): {
	fieldName: _FieldName
	values: _Values
}
export function conditionalOn<
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalArrayPrimitiveFieldName<_Fields>,
	const _Values extends readonly ArrayPrimitiveFieldItemValue<_Fields, _FieldName>[],
	const _ItemIndex extends number,
>(
	_fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
	options: {
		itemIndex: _ItemIndex
	},
): {
	fieldName: _FieldName
	itemIndex: _ItemIndex
	values: _Values
}
export function conditionalOn(
	_fields: readonly EntityFieldDefinition[],
	fieldName: string,
	values: readonly (string | number)[],
	options?: {
		itemIndex?: number
	},
) {
	return {
		fieldName,
		...(options?.itemIndex != null && {
			itemIndex: options.itemIndex,
		}),
		values,
	}
}

export function conditionalFieldGroup<
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalScalarPrimitiveFieldName<_Fields>,
	const _Values extends readonly ScalarPrimitiveFieldValue<_Fields, _FieldName>[],
	const _ConditionalFields extends readonly EntityFieldDefinition[],
>(
	fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
	conditionalFields: _ConditionalFields,
): {
	readonly kind: EntityFieldEntryKind.Group
	readonly when: {
		readonly fieldName: _FieldName
		readonly values: _Values
	}
	readonly fields: _ConditionalFields
}
export function conditionalFieldGroup<
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalArrayPrimitiveFieldName<_Fields>,
	const _Values extends readonly ArrayPrimitiveFieldItemValue<_Fields, _FieldName>[],
	const _ItemIndex extends number,
	const _ConditionalFields extends readonly EntityFieldDefinition[],
>(
	fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
	options: {
		itemIndex: _ItemIndex
	},
	conditionalFields: _ConditionalFields,
): {
	readonly kind: EntityFieldEntryKind.Group
	readonly when: {
		readonly fieldName: _FieldName
		readonly itemIndex: _ItemIndex
		readonly values: _Values
	}
	readonly fields: _ConditionalFields
}
export function conditionalFieldGroup(
	_fields: readonly EntityFieldDefinition[],
	fieldName: string,
	values: readonly (string | number)[],
	optionsOrConditionalFields: {
		itemIndex: number
	} | readonly EntityFieldDefinition[],
	conditionalFields?: readonly EntityFieldDefinition[],
) {
	if (conditionalFields == null) {
		if ('itemIndex' in optionsOrConditionalFields)
			throw new Error('conditionalFieldGroup: missing conditional fields')

		return {
			kind: EntityFieldEntryKind.Group,
			when: {
				fieldName,
				values,
			},
			fields: optionsOrConditionalFields,
		}
	}

	if (!('itemIndex' in optionsOrConditionalFields))
		throw new Error('conditionalFieldGroup: missing item index')

	return {
		kind: EntityFieldEntryKind.Group,
		when: {
			fieldName,
			itemIndex: optionsOrConditionalFields.itemIndex,
			values,
		},
		fields: conditionalFields,
	}
}


export type Schema = readonly EntityDefinition[]

export type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

export type EntityDefinitionForEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<_Schema[number], { entityType: _EntityType }>

export type EntityId<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['id']['infer']

export type EntityFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>['name']

export type EntityBaseFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Exclude<
	EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>,
	{ when: EntityFieldCondition }
>

export type EntityConditionalFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<
	EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>,
	{ when: EntityFieldCondition }
>

export type EntityBaseFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityBaseFieldDefinition<_Schema, _EntityType>['name']

export type EntityConditionalDiscriminatorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityConditionalFieldDefinition<_Schema, _EntityType> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		when: infer _Condition extends EntityFieldCondition
	} ?
		EntityFieldConditionKey<_Condition>
	:
		never
:
	never

type EntityConditionalFieldDefinitionForDiscriminator<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = EntityConditionalFieldDefinition<_Schema, _EntityType> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		when: infer _Condition extends EntityFieldCondition
	} ?
		_DiscriminatorName extends EntityFieldConditionKey<_Condition> ?
			_FieldDefinition
		:
			never
	:
		never
:
	never

export type EntityConditionalDiscriminatorValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = EntityConditionalFieldDefinitionForDiscriminator<
	_Schema,
	_EntityType,
	_DiscriminatorName
>['when']['values'][number]

export type EntityConditionalFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
	_DiscriminatorValue extends EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>,
> = EntityConditionalFieldDefinition<_Schema, _EntityType> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		name: infer _FieldName
		when: infer _Condition extends EntityFieldCondition
	} ?
		_DiscriminatorName extends EntityFieldConditionKey<_Condition> ?
			_DiscriminatorValue extends _Condition['values'][number] ?
				_FieldName
			:
				never
		:
			never
	:
		never
:
	never

export type EntityFieldDefinitionByName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = Extract<EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>, { name: _FieldName }>

export type EntityFieldValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends infer _FieldDefinition extends EntityFieldDefinition ?
		EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	:
		never
)

export type EntityReferenceValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	readonly [EntityMetaKey.IdKey]: string
}

export type EntityFieldSingleResolvedValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends string,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly type: EntityFieldType.Primitive
	} ?
		EntityFieldValue<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>>
	: EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly type: EntityFieldType.EntityReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
	: EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly type: EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
	:
		never
)

export type EntityFieldResolvedValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends string,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly cardinality: EntityFieldCardinality.One
	} ?
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
	: EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly cardinality: EntityFieldCardinality.ZeroOrOne
	} ?
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName> | undefined
	: EntityFieldDefinitionByName<_Schema, _EntityType, Extract<_FieldName, EntityFieldName<_Schema, _EntityType>>> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
	:
		never
)

export type EntityFieldValueFromDefinition<
	_Schema extends Schema,
	_EntityFieldDefinition extends EntityFieldDefinition,
> = (
	_EntityFieldDefinition extends {
		type: EntityFieldType.Primitive
		primitiveType: infer _PrimitiveType extends SchemaType
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: _PrimitiveType['infer'] | undefined
			[EntityFieldCardinality.One]: _PrimitiveType['infer']
			[EntityFieldCardinality.Many]: _PrimitiveType['infer'][]
			[EntityFieldCardinality.ZeroOrMany]: _PrimitiveType['infer'][] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		_EntityFieldDefinition extends {
		type: EntityFieldType.EntityReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: Entity<_Schema, _RefEntityType> | undefined
			[EntityFieldCardinality.One]: Entity<_Schema, _RefEntityType>
		}[_EntityFieldDefinition['cardinality']]

	:
		_EntityFieldDefinition extends {
		type: EntityFieldType.EntitiesReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.Many]: Entity<_Schema, _RefEntityType>[]
			[EntityFieldCardinality.ZeroOrMany]: Entity<_Schema, _RefEntityType>[] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		never
)

export type EntityFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& {
		[
			_FieldDefinition in EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>> as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.One | EntityFieldCardinality.Many } ?
					_FieldDefinition['name']
				:
					never
			)
		]: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
	& {
		[
			_FieldDefinition in EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>> as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.ZeroOrMany } ?
					_FieldDefinition['name']
				:
					never
			)
		]?: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
)

export type Entity<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.Fields]?: Partial<EntityFieldValues<_Schema, _EntityType>>
} & Partial<EntityFieldValues<_Schema, _EntityType>>

export const indexSchema = <const _Schema extends Schema>(
	schema: _Schema,
) => ({
	entityDefinitionByType: Object.fromEntries(schema.map((entityDefinition) => [
		entityDefinition.entityType,
		entityDefinition,
	])),
	entityFieldDefinitionByEntityTypeAndName: Object.fromEntries(schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
			fieldDefinition.name,
			fieldDefinition,
		])),
	])),
})
