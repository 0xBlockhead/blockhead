import { type as arktype } from 'arktype'
import { stringify } from 'devalue'

import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'

export enum EntityMetaKey {
	ParentSelector = '__parentSelector',
	ParentSelectorKey = '__parentSelectorKey',
	Selector = '__selector',
	SelectorKey = '__selectorKey',
	Source = '__source',
	Fields = '__fields',
	Value = '__value',
}

type SchemaType<
	_Value = unknown,
> = {
	readonly infer: _Value
	(value: unknown): unknown
}

export type EntityDenomination =
	| {
		readonly kind: 'unit'
		readonly unitField: string
	}
	| {
		readonly kind: 'decimal'
		readonly unitField: string
		readonly decimalPlacesField: string
	}

export type EntityFieldQuantity =
	| {
		readonly kind: 'intrinsicUnit'
		readonly unit: string
	}
	| {
		readonly kind: 'denomination'
		readonly owner: 'self' | readonly [`$${string}`, ...`$${string}`[]]
	}

export type EntityDefinition<
	_EntityType extends string = string,
	_Source extends string = string,
	_Selectors extends readonly EntitySelectorDefinition[] = readonly EntitySelectorDefinition[],
	_Fields extends readonly EntityFieldDefinition<_Source>[] = readonly EntityFieldDefinition<_Source>[],
	_Facets extends readonly EntityFacetDefinition<_Source>[] | undefined = readonly EntityFacetDefinition<_Source>[] | undefined,
> = {
	readonly entityType: _EntityType
	readonly labels: {
		readonly singular: string
		readonly plural: string
	}
	readonly description?: string
	readonly denomination?: EntityDenomination
	readonly selectors: _Selectors
	readonly fields: _Fields
	readonly facets?: _Facets
}

export type EntityFacetDefinition<_Source extends string = string> = {
	readonly name: string
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

export function entityFieldAddressKey<
	const _EntityType extends string,
	const _FacetPath extends EntityFacetPath,
	const _FieldName extends string,
>(
	entityType: _EntityType,
	facetPath: _FacetPath,
	fieldName: _FieldName
): `${_EntityType}\x1e${EntityFacetPathKey<_FacetPath>}\x1e${_FieldName}`
export function entityFieldAddressKey(
	entityType: string,
	facetPath: EntityFacetPath,
	fieldName: string
): string
export function entityFieldAddressKey(
	entityType: string,
	facetPath: EntityFacetPath,
	fieldName: string
) {
	return `${entityType}${facetPath.join('')}${fieldName}`
}

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
		facetPath?: EntityFacetPath
		normalize?: EntityFieldValueNormalizer
	}
	& (
		| {
			name: string
			type: EntityFieldType.Primitive
			primitiveType: SchemaType
			cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
			quantity?: EntityFieldQuantity
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
		readonly isOneOf: readonly [
			string | number | boolean | null,
			...(string | number | boolean | null)[],
		]
	}
	| {
		readonly path: readonly (string | number)[]
		readonly includes: string | number | boolean | null
	}
	| {
		readonly all: readonly [EntityFacetCondition, ...EntityFacetCondition[]]
	}

export type EntityFacetConditionPlan = {
	readonly dependencies: readonly EntityFieldAddress[]
	readonly predicates: readonly (
		| {
			readonly dependencyIndex: number
			readonly itemIndex?: number
			readonly is: string | number | boolean | null
		}
		| {
			readonly dependencyIndex: number
			readonly itemIndex?: number
			readonly isOneOf: readonly (string | number | boolean | null)[]
		}
		| {
			readonly dependencyIndex: number
			readonly includes: string | number | boolean | null
		}
	)[]
}

export const evaluateEntityFacetConditionPlan = (
	plan: EntityFacetConditionPlan,
	dependencyValues: readonly unknown[]
): ProjectionResolution => {
	if (plan.dependencies.some((_, index) => dependencyValues[index] === undefined))
		return ProjectionResolution.Blocked

	return plan.predicates.every((predicate) => {
		const dependencyValue = dependencyValues[predicate.dependencyIndex]
		const conditionValue = (
			'itemIndex' in predicate && predicate.itemIndex !== undefined && Array.isArray(dependencyValue) ?
				dependencyValue[predicate.itemIndex]
			:
				dependencyValue
		)

		return (
			'is' in predicate ?
				conditionValue === predicate.is
			: 'isOneOf' in predicate ?
				predicate.isOneOf.some((value) => value === conditionValue)
			: Array.isArray(conditionValue) ?
				conditionValue.some((value) => value === predicate.includes)
			:
				false
		)
	}) ? ProjectionResolution.Applicable : ProjectionResolution.NotApplicable
}

type EntityFieldDefinitionInput<_Source extends string = string> = (
	EntityFieldDefinition<_Source> extends infer _FieldDefinition ?
		_FieldDefinition extends EntityFieldDefinition<_Source> ?
			& Omit<_FieldDefinition, 'name' | 'type'>
			& { readonly type?: never }
		:
			never
	:
		never
)

type EntityFieldDefinitionInputByName<_Source extends string = string> = Record<string, EntityFieldDefinitionInput<_Source>>

type EntityFieldTypeFromName<_FieldName extends string> = (
	_FieldName extends `$$${infer _ReferenceName}` ?
		_ReferenceName extends '' ? never : EntityFieldType.EntitiesReference
	: _FieldName extends `$${infer _ReferenceName}` ?
		_ReferenceName extends '' ? never : EntityFieldType.EntityReference
	:
		EntityFieldType.Primitive
)

type EntityFieldDefinitionInputForName<
	_FieldName extends string,
	_Source extends string = string,
> = (
	EntityFieldTypeFromName<_FieldName> extends infer _FieldType extends EntityFieldType ?
		& Omit<
			Extract<EntityFieldDefinition<_Source>, { readonly type: _FieldType }>,
			'name' | 'type'
		>
		& { readonly type?: never }
		& (
			_FieldType extends EntityFieldType.Primitive ?
				{ readonly entityType?: never }
			:
				{
					readonly primitiveType?: never
					readonly quantity?: never
				}
		)
	:
		never
)

type EntityFieldDefinitionInputsWithValidNames<
	_Fields extends EntityFieldDefinitionInputByName,
> = {
	readonly [_FieldName in keyof _Fields]: _FieldName extends string ?
		'type' extends keyof _Fields[_FieldName] ?
			never
		: _Fields[_FieldName] extends EntityFieldDefinitionInputForName<_FieldName> ?
			_Fields[_FieldName]
		:
			never
	:
		never
}

type EntityFieldDefinitionFromInput<
	_FieldName extends string,
	_Field extends EntityFieldDefinitionInput,
> = (
	_Field extends EntityFieldDefinitionInputForName<_FieldName> ?
		EntityFieldTypeFromName<_FieldName> extends infer _FieldType extends EntityFieldType ?
			& Extract<EntityFieldDefinition, { readonly type: _FieldType }>
			& Omit<_Field, 'name' | 'type'>
			& { readonly name: _FieldName }
		:
			never
	:
		never
)

type EntityFieldDefinitionFromNamedInput<
	_Fields,
	_FieldName extends keyof _Fields & string,
> = (
	_Fields[_FieldName] extends infer _Field extends EntityFieldDefinitionInput ?
		EntityFieldDefinitionFromInput<_FieldName, _Field>
	:
		never
)

type EntityFieldDefinitionsFromInputs<
	_Fields extends EntityFieldDefinitionInputByName,
> = readonly {
	readonly [_FieldName in keyof _Fields & string]: EntityFieldDefinitionFromInput<
		_FieldName,
		_Fields[_FieldName]
	>
}[keyof _Fields & string][]

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

type EntityFacetDefinitionsFromInputs<
	_Facets extends Record<string, AnyEntityFacetInput>,
> = readonly {
	readonly [_FacetName in keyof _Facets & string]: {
		readonly name: _FacetName
		readonly condition: _Facets[_FacetName]['condition']
		readonly fields: EntityFieldDefinitionsFromInputs<_Facets[_FacetName]['fields']>
		readonly facets?: EntityFacetDefinitionsFromInputs<NonNullable<_Facets[_FacetName]['facets']>>
	}
}[keyof _Facets & string][]

type EntitySelectorDefinitionsFromInputs<
	_Selectors extends Record<string, readonly string[]>,
> = readonly {
	readonly [_SelectorName in keyof _Selectors & string]: {
		readonly name: _SelectorName
		readonly fields: _Selectors[_SelectorName]
	}
}[keyof _Selectors & string][]

type EntityFacetConditionTarget<
	_Fields,
	_Facets,
	_Path,
> = (
	_Path extends readonly [infer _Segment extends string, ...infer _Rest extends readonly (string | number)[]] ?
		_Segment extends keyof _Facets ?
			EntityFacetConditionTarget<
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
			_Rest extends readonly [] ?
				{
					readonly field: EntityFieldDefinitionFromNamedInput<_Fields, _Segment>
					readonly indexed: false
				}
			: _Rest extends readonly [number] ?
				EntityFieldDefinitionFromNamedInput<_Fields, _Segment> extends {
					readonly type: EntityFieldType.Primitive
					readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
				} ?
					{
						readonly field: EntityFieldDefinitionFromNamedInput<_Fields, _Segment>
						readonly indexed: true
					}
				:
					never
			:
				never
		:
			never
	:
		never
)

type EntityFacetScalarConditionTargetIsValid<_Target> = (
	[_Target] extends [never] ?
		false
	: _Target extends {
		readonly field: {
			readonly type: EntityFieldType.Primitive
			readonly cardinality: infer _Cardinality
		}
		readonly indexed: infer _Indexed
	} ?
		_Indexed extends true ?
			true
		: _Cardinality extends EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany ?
			false
		:
			true
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
	: _Condition extends {
		readonly path: infer _Path extends readonly (string | number)[]
		readonly includes: string | number | boolean | null
	} ?
		EntityFacetConditionTarget<_Fields, _Facets, _Path> extends infer _Target ?
			[_Target] extends [never] ?
				false
			: _Target extends {
				readonly field: {
					readonly type: EntityFieldType.Primitive
					readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
				}
				readonly indexed: false
			} ?
				true
			:
				false
		:
			false
	: _Condition extends {
		readonly path: infer _Path extends readonly (string | number)[]
		readonly is: string | number | boolean | null
	} | {
		readonly path: infer _Path extends readonly (string | number)[]
		readonly isOneOf: readonly [
			string | number | boolean | null,
			...(string | number | boolean | null)[],
		]
	} ?
		EntityFacetScalarConditionTargetIsValid<EntityFacetConditionTarget<_Fields, _Facets, _Path>>
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
		readonly fields: infer _FacetFields
		readonly facets?: infer _NestedFacets
	} ?
		EntityFacetConditionIsValid<_Fields, _AllFacets, _Condition> extends true ?
			Extract<keyof NonNullable<_NestedFacets>, keyof _Fields | keyof _FacetFields> extends never ?
				false extends {
				readonly [
					_NestedFacetName in keyof NonNullable<_NestedFacets>
				]: _NestedFacetName extends string ?
					_NestedFacetName extends Capitalize<_NestedFacetName> ?
						EntityFacetInputIsValid<
							_Fields & _FacetFields,
							_AllFacets,
							NonNullable<_NestedFacets>[_NestedFacetName]
						>
					:
						false
				:
					false
				}[keyof NonNullable<_NestedFacets>] ?
					false
				:
					true
			:
				false
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
	type: name.startsWith('$$') ?
		EntityFieldType.EntitiesReference
	: name.startsWith('$') ?
		EntityFieldType.EntityReference
	:
		EntityFieldType.Primitive,
} as EntityFieldDefinition<_Source>))

const entityFacetDefinition = <_Source extends string>(
	name: string,
	facetInput: AnyEntityFacetInput<_Source>
): EntityFacetDefinition<_Source> => ({
	name,
	condition: facetInput.condition,
	fields: entityDefinitionFields(facetInput.fields),
	facets: facetInput.facets == null ?
		undefined
	:
	Object.entries(facetInput.facets).map(([facetName, childFacet]) => entityFacetDefinition(facetName, childFacet)),
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
	Object.fromEntries(Object.entries(nested.facets).map(([facetName, childFacet]) => [
			facetName,
			entityFacetInput(childFacet.condition, childFacet.fields, childFacet),
		])),
})

export const facet = <const _Condition extends EntityFacetCondition>(
	condition: _Condition
) => <const _Fields extends EntityFieldDefinitionInputByName>(
	fields: _Fields & EntityFieldDefinitionInputsWithValidNames<_Fields>
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
	readonly labels: {
		readonly singular: string
		readonly plural: string
	}
	readonly description?: string
	readonly denomination?: EntityDenomination
}) => <const _Fields extends EntityFieldDefinitionInputByName>(
	fields: _Fields & EntityFieldDefinitionInputsWithValidNames<_Fields>
) => {
	function defineEntity<
		const _Selectors extends Record<string, readonly string[]>,
		const _Facets extends Record<string, AnyEntityFacetInput> = {},
	>(
		selectorsAndFacets: {
			readonly selectors: {
				readonly [
					_SelectorName in keyof _Selectors
				]: _Selectors[_SelectorName] extends readonly [string, ...string[]] ?
					_Selectors[_SelectorName][number] extends keyof _Fields & string ?
						EntityFieldDefinitionFromNamedInput<
							_Fields,
							_Selectors[_SelectorName][number]
						>['type'] extends (
							| EntityFieldType.Primitive
							| EntityFieldType.EntityReference
						) ?
							EntityFieldDefinitionFromNamedInput<
								_Fields,
								_Selectors[_SelectorName][number]
							>['cardinality'] extends (
								| EntityFieldCardinality.One
								| EntityFieldCardinality.ZeroOrOne
							) ?
								_Selectors[_SelectorName]
							:
								never
						:
							never
					:
						never
				:
					never
			}
			readonly facets?: {
				readonly [
					_FacetName in keyof _Facets
				]: _FacetName extends string ?
					_FacetName extends Capitalize<_FacetName> ?
						_FacetName extends keyof _Fields ?
							never
						: EntityFacetInputIsValid<_Fields, _Facets, _Facets[_FacetName]> extends true ?
							_Facets[_FacetName]
						:
							never
					:
					never
				:
					never
			}
		}
	): EntityDefinition<
		_EntityType,
		string,
		EntitySelectorDefinitionsFromInputs<_Selectors>,
		EntityFieldDefinitionsFromInputs<_Fields>,
		EntityFacetDefinitionsFromInputs<_Facets>
	>
	function defineEntity(
		selectorsAndFacets: {
			readonly selectors: Record<string, readonly string[]>
			readonly facets?: Record<string, AnyEntityFacetInput>
		}
	): EntityDefinition {
		return {
			...meta,
			selectors: Object.entries(selectorsAndFacets.selectors).map(([name, selectorFields]) => ({
				name: String(name),
				fields: selectorFields,
			})),
			fields: entityDefinitionFields(fields),
			facets: selectorsAndFacets.facets == null ?
				undefined
			:
				Object.entries(selectorsAndFacets.facets).map(([facetName, facetInput]) => entityFacetDefinition(String(facetName), facetInput)),
		}
	}

	return defineEntity
}

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
			facetDefinition.name,
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

type EntitySelectorFromSelectorDefinition<
	_Schema extends Schema,
	_EntityDefinition extends EntityDefinition,
	_SelectorDefinition,
	_AllSelectorFields extends string = _EntityDefinition['selectors'][number]['fields'][number],
> = (
	_SelectorDefinition extends {
		readonly fields: infer _Fields extends readonly string[]
	} ?
		{
			readonly [
				_FieldName in _Fields[number]
			]: EntitySelectorFieldValue<_Schema, _EntityDefinition, _FieldName>
		}
		& {
			readonly [
				_FieldName in Exclude<_AllSelectorFields, _Fields[number]>
			]?: never
		}
	:
		never
)

type RouteEntitySelectorFieldValue<
	_EntityDefinition extends EntityDefinition,
	_FieldName extends string,
	_Value extends object,
> = Extract<
	EntityFieldDefinitions<_EntityDefinition>,
	{ readonly name: _FieldName }
> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		readonly type: EntityFieldType.Primitive
		readonly primitiveType: {
			readonly infer: infer _PrimitiveValue
		}
	} ?
		_PrimitiveValue
	: _FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference
	} ?
		_FieldName extends keyof _Value ?
			_Value[_FieldName]
		:
			never
	:
		never
:
	never

export type RouteEntitySelectorForSelectorName<
	_EntityDefinition extends EntityDefinition,
	_SelectorName extends _EntityDefinition['selectors'][number]['name'],
	_Value extends object,
	_SelectorDefinition = Extract<
		_EntityDefinition['selectors'][number],
		{ readonly name: _SelectorName }
	>,
	_AllSelectorFields extends string = _EntityDefinition['selectors'][number]['fields'][number],
> = (
	_SelectorDefinition extends {
		readonly fields: infer _Fields extends readonly string[]
	} ?
		{
			readonly [
				_FieldName in _Fields[number]
			]: RouteEntitySelectorFieldValue<_EntityDefinition, _FieldName, _Value>
		}
		& {
			readonly [
				_FieldName in Exclude<_AllSelectorFields, _Fields[number]>
			]?: never
		}
	:
		never
)

type EntitySelectorFromDefinition<
	_Schema extends Schema,
	_EntityDefinition,
> = (
	_EntityDefinition extends EntityDefinition & {
		readonly selectors: infer _Selectors extends readonly EntitySelectorDefinition[]
	} ?
		EntitySelectorFromSelectorDefinition<_Schema, _EntityDefinition, _Selectors[number]>
	:
		never
)

export type EntitySelectorForSelectorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_SelectorName extends string,
> = EntitySelectorFromSelectorDefinition<
	_Schema,
	EntityDefinitionForEntityType<_Schema, _EntityType>,
	Extract<
		EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number],
		{ readonly name: _SelectorName }
	>
>

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
	const fieldDefinition = entityDefinition.fields
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
	const _SelectorName extends _EntityDefinition['selectors'][number]['name'],
>(
	schema: _Schema,
	entityDefinition: _EntityDefinition,
	value: unknown,
	selectorName: _SelectorName
): EntitySelectorFromSelectorDefinition<
	_Schema,
	_EntityDefinition,
	Extract<_EntityDefinition['selectors'][number], { readonly name: _SelectorName }>
> | InstanceType<typeof arktype.errors>
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
	value: unknown,
	selectorName?: string
): EntitySelectorFromDefinition<Schema, EntityDefinition> | InstanceType<typeof arktype.errors> {
	if (value == null || typeof value !== 'object')
		return arktype('never')(value)

	if (selectorName != null) {
		const selector = entityDefinition.selectors.find((candidate) => candidate.name === selectorName)
		return selector == null ?
			arktype('never')(value)
		:
			parseNamedEntitySelector(schema, entityDefinition, selector, value)
	}

	for (const selector of entityDefinition.selectors) {
		const parsed = parseNamedEntitySelector(schema, entityDefinition, selector, value)
		if (!(parsed instanceof arktype.errors))
			return parsed
	}

	return arktype('never')(value)
}

export function parseRouteEntitySelector<
	const _EntityDefinition extends EntityDefinition,
	const _SelectorName extends _EntityDefinition['selectors'][number]['name'],
	const _Value extends object,
>(
	schema: Schema,
	entityDefinition: _EntityDefinition,
	value: _Value,
	selectorName: _SelectorName
): RouteEntitySelectorForSelectorName<
	_EntityDefinition,
	_SelectorName,
	_Value
> | InstanceType<typeof arktype.errors>
export function parseRouteEntitySelector(
	schema: Schema,
	entityDefinition: EntityDefinition,
	value: object,
	selectorName: string
) {
	return parseEntitySelector(schema, entityDefinition, value, selectorName)
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

export const canonicalEntitySelector = (
	schema: Schema,
	entityDefinition: EntityDefinition,
	entitySelector: object
) => {
	const parsed = parseNamedEntitySelector(
		schema,
		entityDefinition,
		validateEntitySelector(schema, entityDefinition, entitySelector),
		entitySelector
	)
	if (parsed instanceof arktype.errors)
		throw new Error(`${entityDefinition.entityType}: invalid selector ${stringify(entitySelector)}`)

	return parsed
}

export const entitySelectorKey = (
	schema: Schema,
	entityDefinition: EntityDefinition,
	entitySelector: object
) => stringify(canonicalEntitySelector(schema, entityDefinition, entitySelector))

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

export type Schema = readonly EntityDefinition[]

export type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

export type EntityDefinitionForEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	_Schema extends {
		readonly entityDefinitionByType: infer _EntityDefinitionByType extends Readonly<Record<string, EntityDefinition>>
	} ?
		_EntityType extends keyof _EntityDefinitionByType ?
			_EntityDefinitionByType[_EntityType]
		:
			never
	:
		Extract<_Schema[number], { entityType: _EntityType }>
)

export type EntityDefinitionByType<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: EntityDefinitionForEntityType<_Schema, _EntityType>
}

export type EntitySelector<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = _EntityType extends EntityType<_Schema> ?
	EntitySelectorFromDefinition<_Schema, EntityDefinitionForEntityType<_Schema, _EntityType>>
:
	never

export type EntitySelectorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number]['name']

export type EntityFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>['name']

type EntityFacetDefinitionAtPath<
	_Facets extends readonly EntityFacetDefinition[] | undefined,
	_Path extends readonly string[],
> = _Path extends readonly [
	infer _FacetName extends string,
	...infer _Remaining extends string[],
]
	? Extract<NonNullable<_Facets>[number], { readonly name: _FacetName }> extends infer _Facet extends EntityFacetDefinition
		? _Remaining extends []
			? _Facet
			: EntityFacetDefinitionAtPath<_Facet['facets'], _Remaining>
		: never
	: never

type EntityFacetPathsFromDefinition<
	_Facet extends EntityFacetDefinition,
	_ParentPath extends readonly string[],
> = _Facet extends EntityFacetDefinition ?
	string extends _Facet['name'] ?
		readonly string[]
	:
		(
			| readonly [..._ParentPath, _Facet['name']]
			| EntityFacetPathsFromDefinitions<
				_Facet['facets'],
				readonly [..._ParentPath, _Facet['name']]
			>
		)
:
	never

type EntityFacetPathsFromDefinitions<
	_Facets extends readonly EntityFacetDefinition[] | undefined,
	_ParentPath extends readonly string[] = readonly [],
> = _Facets extends readonly EntityFacetDefinition[] ?
	_Facets[number] extends infer _Facet extends EntityFacetDefinition ?
		EntityFacetPathsFromDefinition<_Facet, _ParentPath>
	:
		never
:
	never

export type EntityFacetPathFor<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFacetPathsFromDefinitions<
	EntityDefinitionForEntityType<_Schema, _EntityType>['facets']
>

export type EntityProjectionPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = readonly [] | EntityFacetPathFor<_Schema, _EntityType>

export type EntityFacetDefinitionForPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = EntityFacetDefinitionAtPath<
		EntityDefinitionForEntityType<_Schema, _EntityType>['facets'],
		_FacetPath
	>

export type EntityFacetFieldNameAtPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = EntityFacetDefinitionForPath<_Schema, _EntityType, _FacetPath>['fields'][number]['name']

export type EntityFacetFieldDefinitionAtPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
	_FieldName extends EntityFacetFieldNameAtPath<_Schema, _EntityType, _FacetPath>,
> = Extract<
	EntityFacetDefinitionForPath<_Schema, _EntityType, _FacetPath>['fields'][number],
	{ readonly name: _FieldName }
>

export type EntityFacetName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[] = [],
> = _FacetPath extends readonly [] ?
	NonNullable<EntityDefinitionForEntityType<_Schema, _EntityType>['facets']>[number]['name']
:
	NonNullable<EntityFacetDefinitionForPath<_Schema, _EntityType, _FacetPath>['facets']>[number]['name']

export type EntityFacetFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetName extends EntityFacetName<_Schema, _EntityType>,
> = Extract<
	NonNullable<EntityDefinitionForEntityType<_Schema, _EntityType>['facets']>[number],
	{ readonly name: _FacetName }
>['fields'][number]

export type EntityFacetFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetName extends EntityFacetName<_Schema, _EntityType>,
> = EntityFacetFieldDefinition<
	_Schema,
	_EntityType,
	_FacetName
>['name']

export type EntityBaseFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityFieldDefinitions<EntityDefinitionForEntityType<_Schema, _EntityType>>

export type EntityBaseFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityBaseFieldDefinition<_Schema, _EntityType>['name']

export type EntityFieldDefinitionAtPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = _FacetPath extends readonly [] ?
	EntityBaseFieldDefinition<_Schema, _EntityType>
:
	EntityFacetDefinitionForPath<_Schema, _EntityType, _FacetPath>['fields'][number]

export type EntityFieldNameAtPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
> = EntityFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath>['name']

type EntityFieldAddressForPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType>,
> = _FacetPath extends EntityProjectionPath<_Schema, _EntityType> ? {
	[_FieldName in EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>]: {
		readonly entityType: _EntityType
		readonly facetPath: _FacetPath
		readonly fieldName: _FieldName
	}
}[EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>] : never

export type EntityFieldAddressFor<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
> = _EntityType extends EntityType<_Schema> ?
	EntityFieldAddressForPath<
		_Schema,
		_EntityType,
		EntityProjectionPath<_Schema, _EntityType>
	>
:
	never

type EntityFacetPathKey<_FacetPath extends readonly string[]> = (
	_FacetPath extends readonly [
		infer _FacetName extends string,
		...infer _RemainingFacetPath extends readonly string[],
	] ?
		_RemainingFacetPath extends readonly [] ?
			_FacetName
		:
			`${_FacetName}\x1e${EntityFacetPathKey<_RemainingFacetPath>}`
	:
		''
)

type EntityFieldAddressKeyForPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType>,
> = _FacetPath extends EntityProjectionPath<_Schema, _EntityType> ?
	`${_EntityType}\x1e${EntityFacetPathKey<_FacetPath>}\x1e${EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>}`
:
	never

export type EntityFieldAddressKeyFor<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
> = _EntityType extends EntityType<_Schema> ?
	EntityFieldAddressKeyForPath<
		_Schema,
		_EntityType,
		EntityProjectionPath<_Schema, _EntityType>
	>
:
	never

export type EntityFieldValuesByAddress<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[_Address in EntityFieldAddressFor<_Schema, _EntityType> as
		`${_Address['entityType']}\x1e${EntityFacetPathKey<_Address['facetPath']>}\x1e${_Address['fieldName']}`
	]?: EntityFieldValueFromDefinition<
		_Schema,
		Extract<
			EntityFieldDefinitionAtPath<_Schema, _Address['entityType'], _Address['facetPath']>,
			{ readonly name: _Address['fieldName'] }
		>
	>
}

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
	readonly [EntityMetaKey.Fields]?: EntityFieldValuesByAddress<_Schema, _EntityType>
}

export type EntityFieldSingleResolvedValueFromDefinition<
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

export type EntityFieldDefinitionAtPathByName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
	_FieldName extends EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>,
> = Extract<
	EntityFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath>,
	{ readonly name: _FieldName }
>

type EntitySelectionField<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = _FieldDefinition extends {
	readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
	readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
} ?
	true | EntitySelection<_Schema, _ReferencedEntityType>
:
	true

export type EntitySelectedFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[] = readonly [],
> = {
	readonly [
		_FieldName in EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>
	]?: EntitySelectionField<
		_Schema,
		EntityFieldDefinitionAtPathByName<_Schema, _EntityType, _FacetPath, _FieldName>
	>
}

export type EntitySelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[] = readonly [],
> = {
	readonly fields?: EntitySelectedFields<_Schema, _EntityType, _FacetPath>
}

type EntitySelectedFieldSingleValue<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection,
> = _FieldDefinition extends {
	readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
	readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
} ?
	_FieldSelection extends EntitySelection<_Schema, _ReferencedEntityType> ?
		& Pick<
			EntityReferenceValue<_Schema, _ReferencedEntityType>,
			EntityMetaKey.Selector | EntityMetaKey.SelectorKey
		>
		& EntitySelectedValue<
			_Schema,
			_ReferencedEntityType,
			readonly [],
			_FieldSelection
		>
	:
		EntityReferenceValue<_Schema, _ReferencedEntityType>
:
	EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>

type EntitySelectedFieldValue<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection,
> = _FieldDefinition extends {
	readonly cardinality: EntityFieldCardinality.Zero
} ?
	undefined
: _FieldDefinition extends {
	readonly cardinality: EntityFieldCardinality.ZeroOrOne
} ?
	EntitySelectedFieldSingleValue<_Schema, _FieldDefinition, _FieldSelection> | undefined
: _FieldDefinition extends {
	readonly cardinality: EntityFieldCardinality.Many
} ?
	EntitySelectedFieldSingleValue<_Schema, _FieldDefinition, _FieldSelection>[]
: _FieldDefinition extends {
	readonly cardinality: EntityFieldCardinality.ZeroOrMany
} ?
	EntitySelectedFieldSingleValue<_Schema, _FieldDefinition, _FieldSelection>[] | undefined
:
	EntitySelectedFieldSingleValue<_Schema, _FieldDefinition, _FieldSelection>

export type EntitySelectedValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends readonly string[],
	_Selection extends EntitySelection<_Schema, _EntityType, _FacetPath>,
> = _Selection extends {
	readonly fields: infer _Fields extends EntitySelectedFields<_Schema, _EntityType, _FacetPath>
} ? {
		readonly [
			_FieldName in keyof _Fields & EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>
		]: EntitySelectedFieldValue<
			_Schema,
			EntityFieldDefinitionAtPathByName<_Schema, _EntityType, _FacetPath, _FieldName>,
			_Fields[_FieldName]
		>
} : Partial<EntityFieldValuesFromDefinitions<
	_Schema,
	EntityFieldDefinitionAtPath<_Schema, _EntityType, _FacetPath>
>>

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
	readonly conditionPlan: EntityFacetConditionPlan
	readonly directDependencies: readonly EntityFieldAddress[]
	readonly transitiveDependencies: readonly EntityFieldAddress[]
	readonly topologicalIndex: number
	readonly fields: readonly EntityFieldDefinition[]
	readonly facets?: readonly EntityFacetDefinition[]
	readonly childFacetPaths: readonly EntityFacetPath[]
}

export type EntityFieldDefinitionByEntityTypePathAndName<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: Record<string, EntityFieldDefinition | undefined>
}

export type EntitySelectorDefinitionByEntityTypeAndName<_Schema extends Schema> = {
	readonly [_EntityType in EntityType<_Schema>]: {
		readonly [
			_SelectorName in EntitySelectorName<_Schema, _EntityType>
		]: Extract<
			EntityDefinitionForEntityType<_Schema, _EntityType>['selectors'][number],
			{ readonly name: _SelectorName }
		>
	}
}

export const indexSchema = <const _Schema extends Schema>(schema: _Schema) => {
	const conditionLeaves = (
		entityType: string,
		condition: EntityFacetCondition | undefined
	): {
		dependency: EntityFieldAddress
		itemIndex?: number
		condition: Exclude<EntityFacetCondition, { readonly all: readonly EntityFacetCondition[] }>
	}[] => {
		if (condition == null)
			return []
		if ('all' in condition)
			return condition.all.flatMap((child) => conditionLeaves(entityType, child))

		const indexed = condition.path.at(-1)
		const fieldName = typeof indexed === 'number' ? condition.path.at(-2) : indexed
		if (typeof fieldName !== 'string')
			return []

		return [{
			dependency: {
				entityType,
				facetPath: condition.path.slice(0, typeof indexed === 'number' ? -2 : -1).filter((segment): segment is string => typeof segment === 'string'),
				fieldName,
			},
			...(typeof indexed === 'number' && { itemIndex: indexed }),
			condition,
		}]
	}
	const conditionPlan = (
		entityType: string,
		conditions: readonly (EntityFacetCondition | undefined)[]
	): EntityFacetConditionPlan => {
		const leaves = conditions.flatMap((condition) => conditionLeaves(entityType, condition))
		const dependencies = [...new Map(leaves.map(({ dependency }) => [
			entityFieldAddressKey(dependency.entityType, dependency.facetPath, dependency.fieldName),
			dependency,
		])).values()]

		return {
			dependencies,
			predicates: leaves.map(({ condition, dependency, itemIndex }) => ({
				dependencyIndex: dependencies.findIndex((candidate) => (
					entityFieldAddressKey(candidate.entityType, candidate.facetPath, candidate.fieldName)
					=== entityFieldAddressKey(dependency.entityType, dependency.facetPath, dependency.fieldName)
				)),
				...(itemIndex !== undefined && { itemIndex }),
				...('is' in condition ? { is: condition.is } : 'isOneOf' in condition ? { isOneOf: condition.isOneOf } : { includes: condition.includes }),
			})),
		}
	}
	let topologicalIndex = 0
	const projectionDefinitionsForFacets = (
		entityType: string,
		facets: readonly EntityFacetDefinition[] | undefined,
		parentPath: EntityFacetPath = [],
		ancestorConditions: readonly EntityFacetCondition[] = []
	): EntityProjectionDefinition[] => (
		facets ?? []
	).flatMap((facetDefinition) => {
		const facetPath = [
			...parentPath,
			facetDefinition.name,
		]
		const directDependencies = conditionPlan(entityType, [facetDefinition.condition]).dependencies
		const projectionConditionPlan = conditionPlan(entityType, [
			...ancestorConditions,
			facetDefinition.condition,
		])
		const transitiveDependencies = projectionConditionPlan.dependencies
		const projectionDefinition = {
			entityType,
			facetPath,
			condition: facetDefinition.condition,
			conditionPlan: projectionConditionPlan,
			directDependencies,
			transitiveDependencies,
			topologicalIndex: topologicalIndex++,
			fields: facetDefinition.fields,
			facets: facetDefinition.facets,
			childFacetPaths: (facetDefinition.facets ?? []).map((childFacet) => [
				...facetPath,
				childFacet.name,
			]),
		} satisfies EntityProjectionDefinition
		return [
			projectionDefinition,
			...projectionDefinitionsForFacets(
				entityType,
				facetDefinition.facets,
				facetPath,
				[
					...ancestorConditions,
					...(facetDefinition.condition == null ? [] : [facetDefinition.condition]),
				]
			),
		]
	})
	const projectionDefinitions = schema.flatMap((entityDefinition) => (
		[
			{
				entityType: entityDefinition.entityType,
				facetPath: [],
				conditionPlan: {
					dependencies: [],
					predicates: [],
				},
				fields: entityDefinition.fields,
				facets: entityDefinition.facets,
				directDependencies: [],
				transitiveDependencies: [],
				topologicalIndex: topologicalIndex++,
				childFacetPaths: (entityDefinition.facets ?? []).map((facetDefinition) => [facetDefinition.name]),
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
