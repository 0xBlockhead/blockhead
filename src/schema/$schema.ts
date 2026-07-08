import { type as arktype } from 'arktype'
import { stringify } from 'devalue'

export enum EntityMetaKey {
	ParentSelector = '__parentSelector',
	ParentSelectorKey = '__parentSelectorKey',
	Selector = '__selector',
	SelectorKey = '__selectorKey',
	Source = '__source',
	Fields = '__fields',
	Value = '__value',
}

export enum EntityFieldType {
	Primitive = 'Primitive',
	EntityReference = 'EntityReference',
	EntitiesReference = 'EntitiesReference',
}

type SchemaType<
	_Value = unknown,
> = {
	readonly infer: _Value
	(value: unknown): unknown
}

export type EntityDefinition<
	_EntityType extends string = string,
	_Source extends string = string,
> = {
	readonly entityType: _EntityType
	readonly label: string
	readonly labelPlural: string
	readonly description?: string
	readonly selectors: readonly EntitySelectorDefinition[]
	readonly fields: readonly EntityFieldDefinition<_Source>[]
	readonly facets?: readonly EntityFacetDefinition<_Source>[]
}

export type EntityFacetDefinition<_Source extends string = string> = {
	readonly id: string
	readonly condition?: EntityFacetCondition
	readonly fields: readonly EntityFieldDefinition<_Source>[]
	readonly facets?: readonly EntityFacetDefinition<_Source>[]
}

export type EntitySelectorDefinition = {
	readonly name: string
	readonly fields: readonly string[]
}

export type EntityFieldValueNormalizer = (
	(value: unknown) => unknown
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

export type EntityFacetPath = readonly string[]

export type EntityFieldAddress<
	_EntityType extends string = string,
	_FieldName extends string = string,
> = {
	readonly entityType: _EntityType
	readonly facetPath: EntityFacetPath
	readonly fieldName: _FieldName
}

export enum ProjectionResolution {
	Applicable = 'Applicable',
	NotApplicable = 'NotApplicable',
	Blocked = 'Blocked',
	Unsupported = 'Unsupported',
}

export type ProjectionValue<_Value> =
	| {
			readonly resolution: ProjectionResolution.Applicable
			readonly value: _Value
		}
	| {
			readonly resolution: ProjectionResolution.NotApplicable
		}
	| {
			readonly resolution: ProjectionResolution.Blocked
			readonly dependencies: readonly EntityFieldAddress[]
		}
	| {
			readonly resolution: ProjectionResolution.Unsupported
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
	condition: EntityFieldCondition
) => (
	condition.itemIndex == null ?
		condition.fieldName
	:
		`${condition.fieldName}[${condition.itemIndex}]`
)

export const entityFieldCardinalityIsMultiple = (
	cardinality: EntityFieldCardinality
) => (
	cardinality === EntityFieldCardinality.Many
	|| cardinality === EntityFieldCardinality.ZeroOrMany
)

export const entityFieldFacetPath = (
	fieldDefinition: EntityFieldDefinition
): EntityFacetPath => (
	fieldDefinition.facetPath ?? []
)

export const entityFieldAddress = (
	entityType: string,
	fieldDefinition: EntityFieldDefinition
): EntityFieldAddress => ({
	entityType,
	facetPath: entityFieldFacetPath(fieldDefinition),
	fieldName: fieldDefinition.name,
})

export const entityFieldAddressKey = (
	entityType: string,
	facetPath: EntityFacetPath,
	fieldName: string
) => `${entityType}${facetPath.join('')}${fieldName}`

export const entityFacetFieldName = (
	fieldDefinition: EntityFieldDefinition
) => fieldDefinition.name

export const entityFieldPrimitiveValueIsValid = (
	fieldDefinition: Extract<EntityFieldDefinition, {
		readonly type: EntityFieldType.Primitive
	}>,
	value: unknown
) => !(fieldDefinition.primitiveType(value) instanceof arktype.errors)

export const NonNegativeInteger = arktype('number.integer >= 0')

export type EntityFieldDefinition<_Source extends string = string> = (
	& {
		label?: string
		labelPlural?: string
		description?: string
		defaultSources?: readonly _Source[]
		when?: EntityFieldCondition
		facetPath?: EntityFacetPath
		normalize?: EntityFieldValueNormalizer
	}
	& (
		| {
			name: string
			type: EntityFieldType.Primitive
			primitiveType: SchemaType
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		}
		| {
			name: `$${string}`
			type: EntityFieldType.EntityReference
			entityType: string
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
		}
		| {
			name: `$$${string}`
			type: EntityFieldType.EntitiesReference
			entityType: string
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		}
		)
)

export type EntityFacetCondition =
	| {
		readonly path: readonly (string | number)[]
		readonly is: string | number | boolean | null
	}
	| {
		readonly path: readonly (string | number)[]
		readonly isOneOf: readonly (string | number | boolean | null)[]
	}
	| {
		readonly path: readonly (string | number)[]
		readonly includes: string | number | boolean | null
	}
	| {
		readonly all: readonly EntityFacetCondition[]
	}

type EntityFieldDefinitionInput<_Source extends string = string> = Omit<EntityFieldDefinition<_Source>, 'name'>

type EntityFieldDefinitionInputByName<_Source extends string = string> = Record<string, EntityFieldDefinitionInput<_Source>>

type AnyEntityFacetInput<_Source extends string = string> = {
	readonly condition: EntityFacetCondition
	readonly fields: EntityFieldDefinitionInputByName<_Source>
	readonly facets?: Record<string, AnyEntityFacetInput<_Source>>
}

type EntityFacetInput<
	_Source extends string = string,
	_Condition extends EntityFacetCondition = EntityFacetCondition,
	_Fields extends EntityFieldDefinitionInputByName<_Source> = EntityFieldDefinitionInputByName<_Source>,
	_Facets extends Record<string, AnyEntityFacetInput<_Source>> = {},
> = {
	readonly condition: _Condition
	readonly fields: _Fields
	readonly facets?: _Facets
}

type EntityFacetConditionPathIsValid<
	_Fields,
	_Facets,
	_Path,
> = (
	_Path extends readonly [infer _Segment extends string, ...infer _Rest extends readonly (string | number)[]] ?
		_Segment extends keyof _Facets ?
			EntityFacetConditionPathIsValid<
				_Fields & (
					_Facets[_Segment] extends { readonly fields: infer _FacetFields } ?
						_FacetFields
					:
						{}
				),
				_Facets[_Segment] extends { readonly facets?: infer _NestedFacets } ?
					NonNullable<_NestedFacets>
				:
					{},
				_Rest
			>
		: _Segment extends keyof _Fields ?
			_Rest extends readonly [] | readonly [number] ?
				true
			:
				false
		:
			false
	:
		false
)

type EntityFacetConditionIsValid<
	_Fields,
	_Facets,
	_Condition,
> = (
	_Condition extends { readonly all: infer _Children extends readonly EntityFacetCondition[] } ?
		false extends EntityFacetConditionIsValid<_Fields, _Facets, _Children[number]> ?
			false
		:
			true
	: _Condition extends { readonly path: infer _Path extends readonly (string | number)[] } ?
		EntityFacetConditionPathIsValid<_Fields, _Facets, _Path>
	:
		false
)

type EntityFacetInputIsValid<
	_Fields,
	_AllFacets,
	_Facet,
> = (
	_Facet extends {
		readonly condition: infer _Condition
		readonly facets?: infer _NestedFacets
	} ?
		EntityFacetConditionIsValid<_Fields, _AllFacets, _Condition> extends true ?
			false extends {
				readonly [
					_NestedFacetName in keyof NonNullable<_NestedFacets>
				]: EntityFacetInputIsValid<_Fields, _AllFacets, NonNullable<_NestedFacets>[_NestedFacetName]>
			}[keyof NonNullable<_NestedFacets>] ?
				false
			:
				true
		:
			false
	:
		false
)

const entityDefinitionFields = <_Source extends string>(
	fields: EntityFieldDefinitionInputByName<_Source>
): EntityFieldDefinition<_Source>[] => Object.entries(fields).map(([name, fieldDefinition]) => ({
	...fieldDefinition,
	name,
} as EntityFieldDefinition<_Source>))

const entityFacetDefinition = <_Source extends string>(
	id: string,
	facetInput: AnyEntityFacetInput<_Source>
): EntityFacetDefinition<_Source> => ({
	id,
	condition: facetInput.condition,
	fields: entityDefinitionFields(facetInput.fields),
	facets: facetInput.facets == null ?
		undefined
	:
		Object.entries(facetInput.facets).map(([facetId, childFacet]) => entityFacetDefinition(facetId, childFacet)),
})

const entityFacetInput = <_Source extends string>(
	condition: EntityFacetCondition,
	fields: EntityFieldDefinitionInputByName<_Source>,
	nested?: { readonly facets?: Record<string, AnyEntityFacetInput<_Source>> }
): EntityFacetInput<_Source> => ({
	condition,
	fields,
	facets: nested?.facets == null ?
		undefined
	:
		Object.fromEntries(Object.entries(nested.facets).map(([facetId, childFacet]) => [
			facetId,
			entityFacetInput(childFacet.condition, childFacet.fields, childFacet),
		])),
})

export const facet = <const _Condition extends EntityFacetCondition>(
	condition: _Condition
) => <const _Fields extends EntityFieldDefinitionInputByName>(
	fields: _Fields
) => Object.assign(
		<const _Nested extends { readonly facets?: Record<string, AnyEntityFacetInput> }>(
			nested: _Nested
		): EntityFacetInput<
			string,
			_Condition,
			_Fields,
			NonNullable<_Nested['facets']>
		> => entityFacetInput(condition, fields, nested) as EntityFacetInput<
			string,
			_Condition,
			_Fields,
			NonNullable<_Nested['facets']>
		>,
		{
			condition,
			fields,
		}
	) as (
	& EntityFacetInput<
		string,
		_Condition,
		_Fields
	>
	& (<const _Nested extends { readonly facets?: Record<string, AnyEntityFacetInput> }>(
		nested: _Nested
	) => EntityFacetInput<
		string,
		_Condition,
		_Fields,
		NonNullable<_Nested['facets']>
	>)
)


export const entity = <
	const _EntityType extends string,
>(meta: {
	readonly entityType: _EntityType
	readonly label: string
	readonly labelPlural: string
	readonly description?: string
}) => <const _Fields extends EntityFieldDefinitionInputByName>(
	fields: _Fields
) => <
	const _Selectors extends Record<string, readonly string[]>,
	const _Facets extends Record<string, AnyEntityFacetInput> = {},
>(
	selectorsAndFacets: {
		readonly selectors: {
			readonly [
				_SelectorName in keyof _Selectors
			]: _Selectors[_SelectorName][number] extends keyof _Fields & string ?
				_Selectors[_SelectorName]
			:
				never
		}
		readonly facets?: {
			readonly [
				_FacetName in keyof _Facets
			]: _FacetName extends keyof _Fields ?
				never
			: EntityFacetInputIsValid<_Fields, _Facets, _Facets[_FacetName]> extends true ?
				_Facets[_FacetName]
			:
				never
		}
	}
): EntityDefinition<_EntityType> => ({
	...meta,
	selectors: Object.entries(selectorsAndFacets.selectors).map(([name, selectorFields]) => ({
		name,
		fields: selectorFields,
	})),
	fields: entityDefinitionFields(fields),
	facets: selectorsAndFacets.facets == null ?
		undefined
	:
		Object.entries(selectorsAndFacets.facets).map(([facetId, facetInput]) => entityFacetDefinition(facetId, facetInput)),
})

export type EntityFieldDefinitions<_EntityDefinition extends EntityDefinition> = (
	_EntityDefinition['fields'][number]
)

export function entityFieldDefinitions<
	const _EntityDefinition extends EntityDefinition,
>(
	entityDefinition: _EntityDefinition
): readonly EntityFieldDefinitions<_EntityDefinition>[]
export function entityFieldDefinitions(
	entityDefinition: EntityDefinition
): readonly EntityFieldDefinition[] {
	const facetFields = (
		facets: readonly EntityFacetDefinition[] | undefined,
		parentPath: EntityFacetPath = []
	): EntityFieldDefinition[] => (
		facets ?? []
	).flatMap((facetDefinition) => {
		const facetPath = [
			...parentPath,
			facetDefinition.id,
		]
		return [
			...facetDefinition.fields.map((fieldDefinition) => ({
				...fieldDefinition,
				facetPath,
			})),
			...facetFields(facetDefinition.facets, facetPath),
		]
	})

	return [
		...entityDefinition.fields,
		...facetFields(entityDefinition.facets),
	]
}
type EntitySelectorFieldValue<
	_Schema extends Schema,
	_EntityDefinition extends EntityDefinition,
	_FieldName extends string,
> = Extract<
	EntityFieldDefinitions<_EntityDefinition>,
	{ readonly name: `${_FieldName}` }
> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		readonly name: `${_FieldName}`
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: infer _PrimitiveType
	} ?
		_PrimitiveType extends {
			readonly infer: infer _Value
		} ?
			_Value
		:
			never
	: _FieldDefinition extends {
		readonly name: `${_FieldName}`
		readonly type: EntityFieldType.EntityReference
		readonly entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		EntitySelector<_Schema, _RefEntityType>
	:
		never
:
	never

type EntitySelectorFromDefinition<
	_Schema extends Schema,
	_EntityDefinition,
> = (
	_EntityDefinition extends EntityDefinition & {
		readonly selectors: infer _Selectors extends readonly EntitySelectorDefinition[]
	} ?
		{
			readonly [
				_SelectorIndex in keyof _Selectors
			]: _Selectors[_SelectorIndex] extends {
				readonly fields: infer _Fields extends readonly string[]
			} ?
				{
					readonly [
						_FieldName in _Fields[number]
					]: EntitySelectorFieldValue<_Schema, _EntityDefinition, _FieldName>
				}
			:
				never
		}[number]
	:
		never
	)

export type EntitySelectorForSelectorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_SelectorName extends string,
> = Extract<
	EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number],
	{ readonly name: _SelectorName }
> extends infer _Selector ?
	_Selector extends {
		readonly fields: infer _Fields extends readonly string[]
	} ?
		{
			readonly [
				_FieldName in _Fields[number]
			]: EntitySelectorFieldValue<_Schema, EntityDefinitionForEntityType<_Schema, _EntityType>, _FieldName>
		}
	:
		never
:
	never

const entitySelectorObjectRecord = (
	value: object
): Record<string, unknown> => Object.fromEntries(Object.entries(value))

const entitySelectorValue = (
	fieldName: string,
	value: unknown
) => (
	fieldName.startsWith('$')
	&& value != null
	&& typeof value === 'object'
	&& !Array.isArray(value)
	&& EntityMetaKey.Selector in value ?
		value[EntityMetaKey.Selector]
	:
		value
)

const entitySelectorHasOnlyFields = (
	entitySelector: Record<string, unknown>,
	fields: readonly string[]
) => (
	Object.keys(entitySelector).every((key) => fields.includes(key))
	&& fields.every((field) => field in entitySelector)
)

const entitySelectorFieldDefinition = (
	entityDefinition: EntityDefinition,
	selectorField: string
) => {
	const fieldDefinition = entityFieldDefinitions(entityDefinition)
		.find((candidate) => candidate.name === selectorField)
	if (fieldDefinition == null)
		throw new Error(`${entityDefinition.entityType}: selector references unknown field ${selectorField}`)

	return fieldDefinition
}

const parseEntitySelectorFieldValue = (
	schema: Schema,
	fieldDefinition: EntityFieldDefinition,
	value: unknown
) => {
	if (fieldDefinition.type === EntityFieldType.Primitive)
		return fieldDefinition.primitiveType(value)

	if (fieldDefinition.type === EntityFieldType.EntityReference) {
		const entityDefinition = schema.find((candidate) => candidate.entityType === fieldDefinition.entityType)
		if (entityDefinition == null)
			throw new Error(`Unknown referenced entity type ${fieldDefinition.entityType}`)

		return parseEntitySelector(schema, entityDefinition, value)
	}

	return arktype('never')(value)
}

const parseNamedEntitySelector = <
	const _Schema extends Schema,
	const _EntityDefinition extends EntityDefinition,
>(
	schema: _Schema,
	entityDefinition: _EntityDefinition,
	selector: EntitySelectorDefinition,
	entitySelector: object
): EntitySelectorFromDefinition<_Schema, _EntityDefinition> | InstanceType<typeof arktype.errors> => {
	const entitySelectorObject = entitySelectorObjectRecord(entitySelector)
	if (!entitySelectorHasOnlyFields(entitySelectorObject, selector.fields))
		return arktype('never')(entitySelector)

	const parsedEntries = selector.fields.flatMap((field) => {
		if (!(field in entitySelectorObject))
			return []

		const fieldDefinition = entitySelectorFieldDefinition(entityDefinition, field)
		const parsed = parseEntitySelectorFieldValue(
			schema,
			fieldDefinition,
			entitySelectorValue(
				field,
				entitySelectorObject[field]
			)
		)
		return parsed instanceof arktype.errors ?
			[]
		:
			[[
				field,
				fieldDefinition.normalize == null ?
					parsed
				:
					fieldDefinition.normalize(parsed),
			]]
	})

	if (parsedEntries.length !== selector.fields.length)
		return arktype('never')(entitySelector)

	return Object.fromEntries(parsedEntries) as EntitySelectorFromDefinition<_Schema, _EntityDefinition>
}

export function parseEntitySelector<
	const _Schema extends Schema,
	const _EntityDefinition extends EntityDefinition,
>(
	schema: _Schema,
	entityDefinition: _EntityDefinition,
	value: unknown
): EntitySelectorFromDefinition<_Schema, _EntityDefinition> | InstanceType<typeof arktype.errors>
export function parseEntitySelector(
	schema: Schema,
	entityDefinition: EntityDefinition,
	value: unknown
): EntitySelectorFromDefinition<Schema, EntityDefinition> | InstanceType<typeof arktype.errors> {
	if (value == null || typeof value !== 'object')
		return arktype('never')(value)

	for (const selector of entityDefinition.selectors) {
		const parsed = parseNamedEntitySelector(schema, entityDefinition, selector, value)
		if (!(parsed instanceof arktype.errors))
			return parsed
	}

	return arktype('never')(value)
}

export const validateEntitySelector = (
	schema: Schema,
	entityDefinition: EntityDefinition,
	entitySelector: object
) => {
	const entitySelectorObject = entitySelectorObjectRecord(entitySelector)
	const selector = entityDefinition.selectors.find((candidate) => (
		entitySelectorHasOnlyFields(entitySelectorObject, candidate.fields)
		&& !(parseNamedEntitySelector(schema, entityDefinition, candidate, entitySelector) instanceof arktype.errors)
	))
	if (selector == null)
		throw new Error(`${entityDefinition.entityType}: invalid selector ${stringify(entitySelector)}`)

	return {
		name: selector.name,
		fields: selector.fields,
	}
}

export const entitySelectorKey = (
	schema: Schema,
	entityDefinition: EntityDefinition,
	entitySelector: object
) => stringify(validateEntitySelector(schema, entityDefinition, entitySelector).fields.reduce<{
	readonly [_FieldName in string]: unknown
}>(
	(selectorValue, fieldName) => ({
		...selectorValue,
		[fieldName]: entitySelectorObjectRecord(entitySelector)[fieldName],
	}),
	{}
))

export const entitySelectorsFromFields = <
	const _Schema extends Schema,
	const _EntityDefinition extends EntityDefinition,
>(
	schema: _Schema,
	entityDefinition: _EntityDefinition,
	entitySelector: object,
	fields: Partial<Record<string, unknown>>
): EntitySelectorFromDefinition<_Schema, _EntityDefinition>[] => {
	const fieldValueByName = {
		...entitySelectorObjectRecord(entitySelector),
		...fields,
	}
	const selectors = [
		parseNamedEntitySelector(
			schema,
			entityDefinition,
			validateEntitySelector(schema, entityDefinition, entitySelector),
			entitySelector
		),
		...entityDefinition.selectors.flatMap((selector) => {
			const selectorValue = Object.fromEntries(
				selector.fields.flatMap((field) => {
					const fieldValue = entitySelectorValue(
						field,
						fieldValueByName[field]
					)
					if (fieldValue === undefined)
						return []

					const fieldDefinition = entitySelectorFieldDefinition(entityDefinition, field)
					return [[
						field,
						fieldDefinition.normalize == null ?
							fieldValue
						:
							fieldDefinition.normalize(fieldValue),
					]]
				})
			)

			if (Object.keys(selectorValue).length !== selector.fields.length)
				return []

			const parsed = parseNamedEntitySelector(schema, entityDefinition, selector, selectorValue)
			return parsed instanceof arktype.errors ?
				[]
			:
				[parsed]
		}),
	]
	const selectorKeys = new Set<string>()
	return selectors.flatMap((selector) => {
		if (selector instanceof arktype.errors)
			return []

		const selectorKey = stringify(selector)
		if (selectorKeys.has(selectorKey))
			return []

		selectorKeys.add(selectorKey)
		return [selector]
	})
}

type NonConditionalScalarPrimitiveFieldName<
	_Fields extends readonly EntityFieldDefinition[],
> = Exclude<
	_Fields[number],
	{ when: EntityFieldCondition }
> extends infer _Field ?
	_Field extends {
		readonly name: infer _FieldName extends string
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: SchemaType<string | number>
		readonly cardinality: EntityFieldCardinality.One
	} ?
		_FieldName
	:
	never
:
	never

type NonConditionalIndexedPrimitiveFieldName<
	_Fields extends readonly EntityFieldDefinition[],
> = Exclude<
	_Fields[number],
	{ when: EntityFieldCondition }
> extends infer _Field ?
	_Field extends {
		readonly name: infer _FieldName extends string
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: SchemaType<string | number | readonly (string | number)[]>
		readonly cardinality: EntityFieldCardinality.One
	} ?
		_Field['primitiveType'] extends SchemaType<readonly (string | number)[]> ?
			_FieldName
		:
			never
	:
		never
:
	never

type ScalarPrimitiveFieldValue<
	_Fields extends readonly EntityFieldDefinition[],
	_FieldName extends string,
> = _Fields[number] extends infer _Field ?
	_Field extends {
		readonly name: _FieldName
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: SchemaType<infer _Value extends string | number>
	} ?
		_Value
	:
	never
:
	never

type IndexedPrimitiveFieldItemValue<
	_Fields extends readonly EntityFieldDefinition[],
	_FieldName extends string,
> = _Fields[number] extends infer _Field ?
	_Field extends {
		readonly name: _FieldName
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: SchemaType<infer _Value>
		readonly cardinality: EntityFieldCardinality.One
	} ?
		_Value extends readonly (infer _Item extends string | number)[] ?
			_Item
		:
			never
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
	values: _Values
): {
	fieldName: _FieldName
	values: _Values
}
export function conditionalOn<
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalIndexedPrimitiveFieldName<_Fields>,
	const _Values extends readonly IndexedPrimitiveFieldItemValue<_Fields, _FieldName>[],
	const _ItemIndex extends number,
>(
	_fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
	options: {
		itemIndex: _ItemIndex
	}
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
	}
) {
	if (
		options?.itemIndex != null
		&& (
			!Number.isInteger(options.itemIndex)
			|| options.itemIndex < 0
		)
	)
		throw new Error(`Invalid conditional field index: ${options.itemIndex}`)

	return {
		fieldName,
		...(options?.itemIndex != null && {
			itemIndex: options.itemIndex,
		}),
		values,
	}
}

export type Schema = readonly EntityDefinition[]

export type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

export type EntityDefinitionForEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<_Schema[number], { entityType: _EntityType }>

export type EntityDefinitionByType<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: EntityDefinitionForEntityType<_Schema, _EntityType>
}

export type EntitySelector<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntitySelectorFromDefinition<_Schema, EntityDefinitionByType<_Schema>[_EntityType]>

export type EntitySelectorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number]['name']

export type EntityFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>['name']

export type EntityFacetId<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = NonNullable<EntityDefinitionForEntityType<_Schema, _EntityType>['facets']>[number]['id']

export type EntityFacetFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetId extends EntityFacetId<_Schema, _EntityType>,
> = Extract<
	NonNullable<EntityDefinitionForEntityType<_Schema, _EntityType>['facets']>[number],
	{ readonly id: _FacetId }
>['fields'][number]

export type EntityFacetFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetId extends EntityFacetId<_Schema, _EntityType>,
> = EntityFacetFieldDefinition<
	_Schema,
	_EntityType,
	_FacetId
>['name']

export type EntityNonFacetFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>

export type EntityNonFacetFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityNonFacetFieldDefinition<_Schema, _EntityType>['name']

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

type EntityConditionalDiscriminatorFieldName<
	_DiscriminatorName extends string,
> = (
	_DiscriminatorName extends `${infer _FieldName}[${number}]` ?
		_FieldName
	:
		_DiscriminatorName
)

type EntityConditionalDiscriminatorFieldValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = (
	EntityConditionalDiscriminatorFieldName<_DiscriminatorName> extends infer _FieldName extends EntityFieldName<_Schema, _EntityType> ?
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
	:
		never
)

type EntityConditionalDiscriminatorItemValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = (
	EntityConditionalDiscriminatorFieldName<_DiscriminatorName> extends infer _FieldName extends EntityFieldName<_Schema, _EntityType> ?
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName> extends readonly (infer _Item)[]
			? _Item
			: never
	:
		never
)

export type EntityFieldDefinitionByName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = Extract<EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>, { readonly name: _FieldName }>

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
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.SelectorKey]?: string
} & Partial<EntityFieldValues<_Schema, _EntityType>>

type EntityFieldSingleResolvedValueFromDefinition<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: infer _PrimitiveType extends SchemaType
	} ?
		_PrimitiveType['infer']
	: _FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
	: _FieldDefinition extends {
		readonly type: EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
	:
		never
)

export type EntityFieldSingleResolvedValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends string,
> = (
	_FieldName extends EntityFieldName<_Schema, _EntityType> ?
		EntityFieldSingleResolvedValueFromDefinition<_Schema, EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>>
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
			[EntityFieldCardinality.ZeroOrOne]: EntityReferenceValue<_Schema, _RefEntityType> | undefined
			[EntityFieldCardinality.One]: EntityReferenceValue<_Schema, _RefEntityType>
		}[_EntityFieldDefinition['cardinality']]

	:
		_EntityFieldDefinition extends {
		type: EntityFieldType.EntitiesReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.Many]: EntityReferenceValue<_Schema, _RefEntityType>[]
			[EntityFieldCardinality.ZeroOrMany]: EntityReferenceValue<_Schema, _RefEntityType>[] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		never
)

type EntityZeroCapableFieldCardinality = (
	| EntityFieldCardinality.Zero
	| EntityFieldCardinality.ZeroOrOne
	| EntityFieldCardinality.ZeroOrMany
)

type EntityNonZeroCapableFieldCardinality = (
	| EntityFieldCardinality.One
	| EntityFieldCardinality.Many
)

type EntityFieldValuesFromDefinitions<
	_Schema extends Schema,
	_FieldDefinitions extends EntityFieldDefinition,
> = (
	& {
		[
			_FieldDefinition in _FieldDefinitions as (
				_FieldDefinition extends { cardinality: EntityNonZeroCapableFieldCardinality } ?
					_FieldDefinition['name']
				:
					never
			)
		]: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
	& {
		[
			_FieldDefinition in _FieldDefinitions as (
				_FieldDefinition extends { cardinality: EntityZeroCapableFieldCardinality } ?
					_FieldDefinition['name']
				:
					never
			)
		]?: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
)

type EntityConditionalFieldDefinitionsForValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
	_DiscriminatorValue extends EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>,
> = EntityConditionalFieldDefinitionForDiscriminator<
	_Schema,
	_EntityType,
	_DiscriminatorName
> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		when: infer _Condition extends EntityFieldCondition
	} ?
		_DiscriminatorValue extends _Condition['values'][number] ?
			_FieldDefinition
		:
			never
	:
		never
:
	never

type EntityConditionalActiveDiscriminatorValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
	_DiscriminatorValue extends EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>,
> = (
	_DiscriminatorName extends `${string}[${number}]` ?
		{
			readonly [
				_FieldName in EntityConditionalDiscriminatorFieldName<_DiscriminatorName>
			]: [
				_DiscriminatorValue,
				...EntityConditionalDiscriminatorItemValue<_Schema, _EntityType, _DiscriminatorName>[],
			]
		}
	:
		{
			readonly [
				_FieldName in EntityConditionalDiscriminatorFieldName<_DiscriminatorName>
			]: _DiscriminatorValue
		}
)

type EntityConditionalInactiveDiscriminatorValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = (
	_DiscriminatorName extends `${string}[${number}]` ?
		{
			readonly [
				_FieldName in EntityConditionalDiscriminatorFieldName<_DiscriminatorName>
			]: [
				Exclude<
					EntityConditionalDiscriminatorItemValue<_Schema, _EntityType, _DiscriminatorName>,
					EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>
				>,
				...EntityConditionalDiscriminatorItemValue<_Schema, _EntityType, _DiscriminatorName>[],
			]
		}
	:
		{
			readonly [
				_FieldName in EntityConditionalDiscriminatorFieldName<_DiscriminatorName>
			]: Exclude<
				EntityConditionalDiscriminatorFieldValue<_Schema, _EntityType, _DiscriminatorName>,
				EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>
			>
		}
)

type EntityConditionalFieldValuesForDiscriminator<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = (
	| (
		EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName> extends infer _DiscriminatorValue extends EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName> ?
			& EntityConditionalActiveDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName, _DiscriminatorValue>
			& EntityFieldValuesFromDefinitions<
				_Schema,
				EntityConditionalFieldDefinitionsForValue<
					_Schema,
					_EntityType,
					_DiscriminatorName,
					_DiscriminatorValue
				>
			>
		:
			never
	)
	| (
		& EntityConditionalInactiveDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>
		& Partial<EntityFieldValuesFromDefinitions<
			_Schema,
			EntityConditionalFieldDefinitionForDiscriminator<
				_Schema,
				_EntityType,
				_DiscriminatorName
			>
		>>
	)
)

type UnionToIntersection<_Union> = (
	_Union extends _Union ?
		(_value: _Union) => void
	:
		never
) extends (_value: infer _Intersection) => void ?
	_Intersection
:
	never

type EntityConditionalFieldValuesIntersection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = (
	_DiscriminatorName extends _DiscriminatorName ?
		(
			_value: EntityConditionalFieldValuesForDiscriminator<
				_Schema,
				_EntityType,
				_DiscriminatorName
			>
		) => void
	:
		never
) extends (_value: infer _Intersection) => void ?
	_Intersection
:
	never

type EntityConditionalFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	[
		EntityConditionalDiscriminatorName<_Schema, _EntityType>,
	] extends [never] ?
		object
	:
		EntityConditionalFieldValuesIntersection<
			_Schema,
			_EntityType,
			EntityConditionalDiscriminatorName<_Schema, _EntityType>
		>
)

export type EntityResolvedFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& EntityFieldValuesFromDefinitions<_Schema, EntityBaseFieldDefinition<_Schema, _EntityType>>
	& EntityConditionalFieldValues<_Schema, _EntityType>
)

export type EntityFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldValuesFromDefinitions<
	_Schema,
	EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>
>

export type Entity<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& {
		[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
		[EntityMetaKey.Fields]?: Partial<EntityFieldValues<_Schema, _EntityType>>
	}
	& Partial<EntityFieldValues<_Schema, _EntityType>>
)

export type EntityProjectionDefinition = {
	readonly entityType: string
	readonly facetPath: EntityFacetPath
	readonly condition?: EntityFacetCondition
	readonly fields: readonly EntityFieldDefinition[]
	readonly facets?: readonly EntityFacetDefinition[]
}

export type EntityFieldDefinitionByEntityTypeAndName<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: (
		& {
			readonly [fieldName: string]: EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>> | undefined
		}
		& {
			readonly [
				_FieldName in EntityFieldName<_Schema, _EntityType>
			]: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		}
		)
	}

export type EntityFieldDefinitionByEntityTypePathAndName<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: Record<string, EntityFieldDefinition | undefined>
}

export type EntitySelectorDefinitionByEntityTypeAndName<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: (
		& {
			readonly [selectorName: string]: EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number] | undefined
		}
		& {
			readonly [
				_SelectorName in EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number]['name']
			]: Extract<
				EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number],
				{ readonly name: _SelectorName }
			>
		}
	)
}

export const indexSchema = <const _Schema extends Schema>(
	schema: _Schema
) => {
	const projectionDefinitionsForFacets = (
		entityType: string,
		facets: readonly EntityFacetDefinition[] | undefined,
		parentPath: EntityFacetPath = []
	): EntityProjectionDefinition[] => (
		facets ?? []
	).flatMap((facetDefinition) => {
		const facetPath = [
			...parentPath,
			facetDefinition.id,
		]
		return [
			{
				entityType,
				facetPath,
				condition: facetDefinition.condition,
				fields: facetDefinition.fields,
				facets: facetDefinition.facets,
			},
			...projectionDefinitionsForFacets(
				entityType,
				facetDefinition.facets,
				facetPath
			),
		]
	})
	const projectionDefinitions = schema.flatMap((entityDefinition) => (
		[
			{
				entityType: entityDefinition.entityType,
				facetPath: [],
				fields: entityDefinition.fields,
				facets: entityDefinition.facets,
			},
			...projectionDefinitionsForFacets(
				entityDefinition.entityType,
				entityDefinition.facets
			),
		]
	))
	return {
		entityDefinitionByType: Object.fromEntries(schema.map((entityDefinition) => [
			entityDefinition.entityType,
			entityDefinition,
		])) as EntityDefinitionByType<_Schema>,
		projectionDefinitions,
		projectionDefinitionByEntityTypeAndPath: Object.fromEntries(
			projectionDefinitions.map((projectionDefinition) => [
				entityFieldAddressKey(
					projectionDefinition.entityType,
					projectionDefinition.facetPath,
					''
				),
				projectionDefinition,
			])
		) as Record<string, EntityProjectionDefinition | undefined>,
		entityFieldDefinitionByEntityTypeAndName: Object.fromEntries(schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			])),
		])) as EntityFieldDefinitionByEntityTypeAndName<_Schema>,
		entityFieldDefinitionByEntityTypePathAndName: Object.fromEntries(schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				entityFieldAddressKey(
					entityDefinition.entityType,
					entityFieldFacetPath(fieldDefinition),
					fieldDefinition.name
				),
				fieldDefinition,
			])),
		])) as EntityFieldDefinitionByEntityTypePathAndName<_Schema>,
		entitySelectorDefinitionByEntityTypeAndName: Object.fromEntries(schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityDefinition.selectors.map((selectorDefinition) => [
				selectorDefinition.name,
				selectorDefinition,
			])),
		])) as EntitySelectorDefinitionByEntityTypeAndName<_Schema>,
	}
}
