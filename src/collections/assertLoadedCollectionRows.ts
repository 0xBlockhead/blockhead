// Types/constants
import { type as arktype } from 'arktype'
import { stringify } from 'devalue'

import {
	entityFieldCardinalityIsMultiple,
	entityFieldAddressKey,
	entityFieldFacetPath,
	entitySelectorKey,
	EntityMetaKey,
	validateEntitySelector,
	type EntityDefinition,
	type EntityFacetPath,
	type EntityFieldDefinition,
	type Schema,
} from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/EntityField.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


const sourceValues = new Set<string>(Object.values(Source))

const isEntityCollectionRowShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	return (
		EntityMetaKey.Selector in o
		&& EntityMetaKey.SelectorKey in o
		&& EntityMetaKey.Source in o
	)
}


const isEntityFieldCollectionRowShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	return (
		EntityMetaKey.ParentSelector in o
		&& EntityMetaKey.ParentSelectorKey in o
		&& EntityMetaKey.Source in o
		&& EntityMetaKey.Value in o
	)
}


/** Compact ref: `__selector` + `__selectorKey` without collection-row markers (may carry extra denormalized keys). */
const isCompactEntityRefShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	if (!(EntityMetaKey.Selector in o && EntityMetaKey.SelectorKey in o)) return false

	return (
		!isEntityCollectionRowShape(value)
		&& !isEntityFieldCollectionRowShape(value)
	)
}


const assertEntityCollectionRowShellGeneric = (
	record: Record<string, unknown>,
	path: string,
	selectorValidator: (selectorValue: unknown, selectorPath: string) => void
): void => {
	if (typeof record[EntityMetaKey.SelectorKey] !== 'string') {
		throw new Error(`${path}: ${EntityMetaKey.SelectorKey} must be a string`)
	}

	const src = record[EntityMetaKey.Source]
	if (typeof src !== 'string' || !sourceValues.has(src)) {
		throw new Error(`${path}: invalid ${EntityMetaKey.Source}`)
	}

	selectorValidator(record[EntityMetaKey.Selector], `${path}.${EntityMetaKey.Selector}`)
}


const assertEntityFieldCollectionRowShell = (
	record: Record<string, unknown>,
	path: string
): void => {
	if (typeof record[EntityMetaKey.ParentSelectorKey] !== 'string') {
		throw new Error(`${path}: ${EntityMetaKey.ParentSelectorKey} must be a string`)
	}

	const src = record[EntityMetaKey.Source]
	if (typeof src !== 'string' || !sourceValues.has(src)) {
		throw new Error(`${path}: invalid ${EntityMetaKey.Source}`)
	}

	if (record[EntityMetaKey.Value] === undefined) {
		throw new Error(`${path}: missing ${EntityMetaKey.Value}`)
	}
}


const ENTITY_ROW_ROOT_SKIP = new Set<string>([
	EntityMetaKey.Selector,
	EntityMetaKey.SelectorKey,
	EntityMetaKey.Source,
])


const walkLoadedValue = (
	value: unknown,
	path: string,
	seen: WeakSet<object>
): void => {
	if (value === undefined || value === null) return

	if (typeof value !== 'object') return

	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			walkLoadedValue(value[i], `${path}[${i}]`, seen)
		}
		return
	}

	const o = value
	if (seen.has(o)) return
	seen.add(o)

	const record = value as Record<string, unknown>

	if (isEntityCollectionRowShape(value)) {
		assertEntityCollectionRowShellGeneric(
			record,
			path,
			(selectorValue, selectorPath) => {
				if (selectorValue == null || typeof selectorValue !== 'object' || Array.isArray(selectorValue))
					throw new Error(`${selectorPath}: must be an entity selector object`)

				if (!schema.some((definition) => {
					try {
						validateEntitySelector(schema, definition, selectorValue)
						return true
					} catch {
						return false
					}
				}))
					throw new Error(`${selectorPath}: not a valid entity selector for any registered entity type`)
			}
		)
		for (const key of Object.keys(record)) {
			if (ENTITY_ROW_ROOT_SKIP.has(key)) continue
			walkLoadedValue(record[key], `${path}.${key}`, seen)
		}
		return
	}

	if (isEntityFieldCollectionRowShape(value)) {
		assertEntityFieldCollectionRowShell(record, path)
		walkLoadedValue(record[EntityMetaKey.Value], `${path}.${EntityMetaKey.Value}`, seen)
		return
	}

	if (isCompactEntityRefShape(value)) {
		if (typeof record[EntityMetaKey.SelectorKey] !== 'string') {
			throw new Error(`${path}: ${EntityMetaKey.SelectorKey} must be a string`)
		}
		const selector = record[EntityMetaKey.Selector]
		if (
			selector == null
			|| typeof selector !== 'object'
			|| Array.isArray(selector)
			|| !schema.some((definition) => {
				try {
					validateEntitySelector(schema, definition, selector)
					return true
				} catch {
					return false
				}
			})
		)
			throw new Error(`${path}.${EntityMetaKey.Selector}: not a valid entity selector for any registered entity type`)
		for (const key of Object.keys(record)) {
			if (key === EntityMetaKey.Selector || key === EntityMetaKey.SelectorKey) continue
			walkLoadedValue(record[key], `${path}.${key}`, seen)
		}
		return
	}

	for (const key of Object.keys(record)) {
		walkLoadedValue(record[key], `${path}.${key}`, seen)
	}
}


/**
 * Recursively validate resolver-shaped data: nested compact refs (`__selector` + `__selectorKey`),
 * embedded entity/field collection rows, arrays, and plain objects (any entry point).
 */
export const assertLoadedValue = (
	value: unknown,
	path = '$',
	seen = new WeakSet<object>()
): void => {
	walkLoadedValue(value, path, seen)
}


export enum ResolverOutputMaterialization {
	Entity = 'Entity',
	Field = 'Field',
	Count = 'Count',
}

type ResolverOutputMaterializationInput = (
	| {
		kind: ResolverOutputMaterialization.Entity
		entityDefinition: EntityDefinition
		selector: object
		selectorKey: string
		snapshot: unknown
	}
	| {
		kind: ResolverOutputMaterialization.Field
		entityDefinition: EntityDefinition
		parentSelector: object
		parentSelectorKey: string
		fieldDefinition: EntityFieldDefinition
		value: unknown
	}
	| {
		kind: ResolverOutputMaterialization.Count
		entityDefinition: EntityDefinition
		parentSelector: object
		parentSelectorKey: string
		fieldDefinition: EntityFieldDefinition
		value: unknown
		filterKey: string
	}
) & {
	schema: Schema
	schemaIndex: {
		readonly entityDefinitionByType: Readonly<Record<string, EntityDefinition | undefined>>
		readonly entityFieldDefinitionByEntityTypePathAndName: Readonly<Record<
			string,
			Readonly<Record<string, EntityFieldDefinition | undefined>> | undefined
		>>
	}
	source: string
}

function materializeEntityReference(
	schema: Schema,
	schemaIndex: ResolverOutputMaterializationInput['schemaIndex'],
	fieldDefinition: Extract<EntityFieldDefinition, {
		type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
	}>,
	value: unknown,
	path: string
): Record<string, unknown> {
	if (value == null || typeof value !== 'object' || Array.isArray(value))
		throw new Error(`${path}: expected entity reference`)

	const reference = Object.fromEntries<unknown>(Object.entries(value))
	const referencedEntityDefinition = schemaIndex.entityDefinitionByType[fieldDefinition.entityType]
	if (referencedEntityDefinition == null)
		throw new Error(`${path}: unknown referenced entity type ${fieldDefinition.entityType}`)

	const selector = reference[EntityMetaKey.Selector]
	if (selector == null || typeof selector !== 'object' || Array.isArray(selector))
		throw new Error(`${path}.${EntityMetaKey.Selector}: expected selector object`)

	validateEntitySelector(schema, referencedEntityDefinition, selector)
	const selectorKey = entitySelectorKey(schema, referencedEntityDefinition, selector)
	if (
		reference[EntityMetaKey.SelectorKey] !== undefined
		&& reference[EntityMetaKey.SelectorKey] !== selectorKey
	)
		throw new Error(`${path}.${EntityMetaKey.SelectorKey}: does not match selector`)

	for (const key of Object.keys(value)) {
		if (
			key === EntityMetaKey.Selector
			|| key === EntityMetaKey.SelectorKey
			|| key === EntityMetaKey.Fields
		)
			continue

		throw new Error(`${path}.${key}: direct denormalized sibling fields are not allowed`)
	}

	const suppliedFields = reference[EntityMetaKey.Fields]
	if (suppliedFields != null && (typeof suppliedFields !== 'object' || Array.isArray(suppliedFields)))
		throw new Error(`${path}.${EntityMetaKey.Fields}: expected fields object`)
	const nestedFields = Object.fromEntries<unknown>(Object.entries(suppliedFields ?? {}))
	const materializedFieldEntries = Object.entries(
		nestedFields
	).map(([
		addressKey,
		fieldValue,
	]) => {
		const denormalizedFieldDefinition = (
			schemaIndex.entityFieldDefinitionByEntityTypePathAndName[fieldDefinition.entityType]?.[addressKey]
		)
		if (
			denormalizedFieldDefinition == null
			|| entityFieldAddressKey(
				fieldDefinition.entityType,
				entityFieldFacetPath(denormalizedFieldDefinition),
				denormalizedFieldDefinition.name
			) !== addressKey
		)
			throw new Error(`${path}.${EntityMetaKey.Fields}.${addressKey}: invalid canonical field address`)

		return [
			addressKey,
			materializeResolverFieldValue(
				schema,
				schemaIndex,
				denormalizedFieldDefinition,
				fieldValue,
				`${path}.${EntityMetaKey.Fields}.${addressKey}`
			),
			denormalizedFieldDefinition,
		] as const
	})
	const materializedFields = Object.fromEntries(materializedFieldEntries.map(([
		addressKey,
		fieldValue,
	]) => [
		addressKey,
		fieldValue,
	]))

	return {
		[EntityMetaKey.Selector]: selector,
		[EntityMetaKey.SelectorKey]: selectorKey,
		...Object.fromEntries(materializedFieldEntries.flatMap(([
			,
			fieldValue,
			denormalizedFieldDefinition,
		]) => (
			denormalizedFieldDefinition.facetPath == null ? [[
				denormalizedFieldDefinition.name,
				fieldValue,
			]] : []
		))),
		...(materializedFieldEntries.length > 0 && {
			[EntityMetaKey.Fields]: materializedFields,
		}),
	}
}

function materializeResolverFieldItem(
	schema: Schema,
	schemaIndex: ResolverOutputMaterializationInput['schemaIndex'],
	fieldDefinition: EntityFieldDefinition,
	value: unknown,
	path: string
) {
	if (fieldDefinition.type === EntityFieldType.Primitive) {
		const parsed = fieldDefinition.primitiveType(value)
		if (parsed instanceof arktype.errors)
			throw new Error(`${path}: ${parsed.summary}`)

		return parsed
	}

	return materializeEntityReference(
		schema,
		schemaIndex,
		fieldDefinition,
		value,
		path
	)
}

function materializeResolverFieldItems(
	schema: Schema,
	schemaIndex: ResolverOutputMaterializationInput['schemaIndex'],
	fieldDefinition: EntityFieldDefinition,
	value: unknown,
	path: string
): unknown[] {
	if (fieldDefinition.cardinality === EntityFieldCardinality.Zero) {
		if (value !== undefined)
			throw new Error(`${path}: Zero-cardinality field returned a value`)

		return []
	}

	if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
		if (!Array.isArray(value))
			throw new Error(`${path}: multiple-cardinality field returned a non-array value`)

		return value.map((item, index) => materializeResolverFieldItem(
			schema,
			schemaIndex,
			fieldDefinition,
			item,
			`${path}[${index}]`
		))
	}

	if (value === undefined) {
		if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
			return []

		throw new Error(`${path}: required field returned no value`)
	}

	return [materializeResolverFieldItem(
		schema,
		schemaIndex,
		fieldDefinition,
		value,
		path
	)]
}

function materializeResolverFieldValue(
	schema: Schema,
	schemaIndex: ResolverOutputMaterializationInput['schemaIndex'],
	fieldDefinition: EntityFieldDefinition,
	value: unknown,
	path: string
): unknown {
	const values = materializeResolverFieldItems(
		schema,
		schemaIndex,
		fieldDefinition,
		value,
		path
	)

	return entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
		values
	: values[0]
}

export function materializeResolverOutput<const _Selector extends object>(
	input: Extract<ResolverOutputMaterializationInput, {
		kind: ResolverOutputMaterialization.Entity
	}> & {
		selector: _Selector
	}
): {
	[EntityMetaKey.Selector]: _Selector
	[EntityMetaKey.SelectorKey]: string
	[EntityMetaKey.Source]: string
}[]
export function materializeResolverOutput<const _ParentSelector extends object>(
	input: Extract<ResolverOutputMaterializationInput, {
		kind: ResolverOutputMaterialization.Field
	}> & {
		parentSelector: _ParentSelector
	}
): {
	facetPath: EntityFacetPath
	facetPathKey: string
	fieldName: string
	valueIndex?: number
	[EntityMetaKey.ParentSelector]: _ParentSelector
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: unknown
	valueKey: string
}[]
export function materializeResolverOutput<const _ParentSelector extends object>(
	input: Extract<ResolverOutputMaterializationInput, {
		kind: ResolverOutputMaterialization.Count
	}> & {
		parentSelector: _ParentSelector
	}
): {
	facetPath: EntityFacetPath
	facetPathKey: string
	fieldName: string
	filterKey: string
	[EntityMetaKey.ParentSelector]: _ParentSelector
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: number
}[]
export function materializeResolverOutput(
	input: ResolverOutputMaterializationInput
) {
	const selector = input.kind === ResolverOutputMaterialization.Entity ?
		input.selector
	:
		input.parentSelector
	const selectorKey = entitySelectorKey(input.schema, input.entityDefinition, selector)
	const suppliedSelectorKey = input.kind === ResolverOutputMaterialization.Entity ?
		input.selectorKey
	:
		input.parentSelectorKey
	if (suppliedSelectorKey !== selectorKey)
		throw new Error(`${input.entityDefinition.entityType}.${input.source}: selector key does not match selector`)

	if (input.kind === ResolverOutputMaterialization.Entity)
		return [{
			[EntityMetaKey.Selector]: selector,
			[EntityMetaKey.SelectorKey]: selectorKey,
			[EntityMetaKey.Source]: input.source,
		}]

	const facetPath = entityFieldFacetPath(input.fieldDefinition)
	const facetPathKey = stringify(facetPath)
	const path = `${input.entityDefinition.entityType}.${facetPath.join('.')}.${input.fieldDefinition.name}.${input.source}`
	if (input.kind === ResolverOutputMaterialization.Count) {
		if (!Number.isSafeInteger(input.value) || Number(input.value) < 0)
			throw new Error(`${path}: invalid count ${String(input.value)}`)
		const count = Number(input.value)

		return [{
			facetPath,
			facetPathKey,
			fieldName: input.fieldDefinition.name,
			filterKey: input.filterKey,
			[EntityMetaKey.ParentSelector]: selector,
			[EntityMetaKey.ParentSelectorKey]: selectorKey,
			[EntityMetaKey.Source]: input.source,
			[EntityMetaKey.Value]: count,
		}]
	}

	const values = materializeResolverFieldItems(
		input.schema,
		input.schemaIndex,
		input.fieldDefinition,
		input.value,
		path
	)

	return values.map((value, valueIndex) => ({
		facetPath,
		facetPathKey,
		fieldName: input.fieldDefinition.name,
		...(entityFieldCardinalityIsMultiple(input.fieldDefinition.cardinality) && {
			valueIndex,
		}),
		[EntityMetaKey.ParentSelector]: selector,
		[EntityMetaKey.ParentSelectorKey]: selectorKey,
		[EntityMetaKey.Source]: input.source,
		[EntityMetaKey.Value]: value,
		valueKey: (
			input.fieldDefinition.type === EntityFieldType.Primitive ?
				`Value:${stringify(value)}`
			:
				`Entity:${String(Object.getOwnPropertyDescriptor(value, EntityMetaKey.SelectorKey)?.value)}`
		),
	}))
}
