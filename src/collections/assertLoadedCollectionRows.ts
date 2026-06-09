// Types/constants
import { type as arktype } from 'arktype'
import type { Type } from 'arktype'

import {
	EntityFieldCardinality,
	EntityFieldType,
	entityFieldDefinitions,
	EntityMetaKey,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


const sourceValues = new Set<string>(Object.values(Source))

const allEntityIdArktypes = schema.map((definition) => definition.id) as readonly Type[]


const idMatchesSomeEntity = (idValue: unknown): boolean => (
	allEntityIdArktypes.some((idType) => (
		!(idType(idValue) instanceof arktype.errors)
	))
)


const assertValidEntityIdUnion = (idValue: unknown, path: string): void => {
	if (!idMatchesSomeEntity(idValue)) {
		throw new Error(`${path}: not a valid entity id for any registered entity type`)
	}
}


const isEntityCollectionRowShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	return (
		EntityMetaKey.Id in o
		&& EntityMetaKey.IdKey in o
		&& EntityMetaKey.Source in o
		&& EntityMetaKey.Fields in o
	)
}


const isEntityFieldCollectionRowShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	return (
		EntityMetaKey.ParentId in o
		&& EntityMetaKey.ParentIdKey in o
		&& EntityMetaKey.Source in o
		&& EntityMetaKey.Value in o
	)
}


/** Compact ref: `__id` + `__idKey` without collection-row markers (may carry extra denormalized keys). */
const isCompactEntityRefShape = (value: object): boolean => {
	const o = value as Record<string, unknown>

	if (!(EntityMetaKey.Id in o && EntityMetaKey.IdKey in o)) return false

	return (
		!isEntityCollectionRowShape(value)
		&& !isEntityFieldCollectionRowShape(value)
	)
}


const assertEntityCollectionRowShellGeneric = (
	record: Record<string, unknown>,
	path: string,
	idValidator: (idValue: unknown, idPath: string) => void,
): void => {
	if (typeof record[EntityMetaKey.IdKey] !== 'string') {
		throw new Error(`${path}: ${EntityMetaKey.IdKey} must be a string`)
	}

	const src = record[EntityMetaKey.Source]
	if (typeof src !== 'string' || !sourceValues.has(src)) {
		throw new Error(`${path}: invalid ${EntityMetaKey.Source}`)
	}

	const fields = record[EntityMetaKey.Fields]
	if (fields == null || typeof fields !== 'object' || Array.isArray(fields)) {
		throw new Error(`${path}: ${EntityMetaKey.Fields} must be an object`)
	}

	idValidator(record[EntityMetaKey.Id], `${path}.${EntityMetaKey.Id}`)
}


const assertEntityFieldCollectionRowShell = (
	record: Record<string, unknown>,
	path: string,
): void => {
	if (typeof record[EntityMetaKey.ParentIdKey] !== 'string') {
		throw new Error(`${path}: ${EntityMetaKey.ParentIdKey} must be a string`)
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
	EntityMetaKey.Id,
	EntityMetaKey.IdKey,
	EntityMetaKey.Source,
	EntityMetaKey.Fields,
])


const walkLoadedValue = (
	value: unknown,
	path: string,
	seen: WeakSet<object>,
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
			assertValidEntityIdUnion,
		)
		walkLoadedValue(record[EntityMetaKey.Fields], `${path}.${EntityMetaKey.Fields}`, seen)
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
		if (typeof record[EntityMetaKey.IdKey] !== 'string') {
			throw new Error(`${path}: ${EntityMetaKey.IdKey} must be a string`)
		}
		assertValidEntityIdUnion(record[EntityMetaKey.Id], `${path}.${EntityMetaKey.Id}`)
		for (const key of Object.keys(record)) {
			if (key === EntityMetaKey.Id || key === EntityMetaKey.IdKey) continue
			walkLoadedValue(record[key], `${path}.${key}`, seen)
		}
		return
	}

	for (const key of Object.keys(record)) {
		walkLoadedValue(record[key], `${path}.${key}`, seen)
	}
}


const assertPrimitiveManyElements = (
	context: string,
	field: Extract<EntityFieldDefinition, { type: EntityFieldType.Primitive }>,
	value: unknown,
) => {
	if (!Array.isArray(value)) {
		throw new Error(`${context}: ${field.name} must be an array`)
	}

	for (const element of value) {
		if (element === undefined) continue
		const out = field.primitiveType(element)
		if (out instanceof arktype.errors) {
			throw new Error(`${context}.${field.name}: ${out.summary}`)
		}
	}
}


const assertPrimitiveScalar = (
	context: string,
	field: Extract<EntityFieldDefinition, { type: EntityFieldType.Primitive }>,
	value: unknown,
) => {
	if (value === undefined) return
	const out = field.primitiveType(value)
	if (out instanceof arktype.errors) {
		throw new Error(`${context}.${field.name}: ${out.summary}`)
	}
}


const assertFieldsObjectPrimitives = (
	context: string,
	entityDefinition: EntityDefinition,
	fieldsObject: Record<string, unknown>,
) => {
	for (const field of entityFieldDefinitions(entityDefinition)) {
		if (field.type !== EntityFieldType.Primitive) continue
		const v = fieldsObject[field.name]
		if (v === undefined) continue
		(
			field.cardinality === EntityFieldCardinality.Many
			|| field.cardinality === EntityFieldCardinality.ZeroOrMany ?
				assertPrimitiveManyElements(context, field, v)
			:
				assertPrimitiveScalar(context, field, v)
		)
	}
}


/**
 * Recursively validate resolver-shaped data: nested compact refs (`__id` + `__idKey`),
 * embedded entity/field collection rows, arrays, and plain objects (any entry point).
 */
export const assertLoadedValue = (
	value: unknown,
	path = '$',
	seen = new WeakSet<object>(),
): void => {
	walkLoadedValue(value, path, seen)
}


export const assertResolverDefinitionResult = (
	entityDefinition: EntityDefinition,
	row: unknown,
): void => {
	if (row == null || typeof row !== 'object' || Array.isArray(row)) {
		throw new Error(`EntityCollection ${entityDefinition.entityType}: row must be an object`)
	}

	const record = row as Record<string, unknown>
	const path = `EntityCollection ${entityDefinition.entityType}`

	if (!isEntityCollectionRowShape(row)) {
		throw new Error(`${path}: expected a collection row (${EntityMetaKey.Id}, ${EntityMetaKey.Fields}, …)`)
	}

	const idOut = entityDefinition.id(record[EntityMetaKey.Id])
	if (idOut instanceof arktype.errors) {
		throw new Error(`${path}.${EntityMetaKey.Id}: ${idOut.summary}`)
	}

	assertEntityCollectionRowShellGeneric(
		record,
		path,
		(_idValue, idPath) => {
			const out = entityDefinition.id(_idValue)
			if (out instanceof arktype.errors) {
				throw new Error(`${idPath}: ${out.summary}`)
			}
		},
	)

	const fieldsObject = record[EntityMetaKey.Fields] as Record<string, unknown>
	assertFieldsObjectPrimitives(path, entityDefinition, fieldsObject)

	for (const field of entityFieldDefinitions(entityDefinition)) {
		if (field.type !== EntityFieldType.Primitive) continue
		const spread = record[field.name]
		if (spread === undefined) continue
		const fromFields = fieldsObject[field.name]
		if (spread === fromFields) continue
		(
			field.cardinality === EntityFieldCardinality.Many
			|| field.cardinality === EntityFieldCardinality.ZeroOrMany ?
				assertPrimitiveManyElements(`${path} (root)`, field, spread)
			:
				assertPrimitiveScalar(`${path} (root)`, field, spread)
		)
	}

	const seen = new WeakSet<object>()
	seen.add(row)
	walkLoadedValue(record[EntityMetaKey.Fields], `${path}.${EntityMetaKey.Fields}`, seen)
	for (const key of Object.keys(record)) {
		if (ENTITY_ROW_ROOT_SKIP.has(key)) continue
		walkLoadedValue(record[key], `${path}.${key}`, seen)
	}
}


export const assertResolverValuePartResult = (
	entityTypeLabel: string,
	fieldDefinition: EntityFieldDefinition,
	row: unknown,
): void => {
	if (row == null || typeof row !== 'object' || Array.isArray(row)) {
		throw new Error(
			`EntityFieldCollection ${entityTypeLabel}.${fieldDefinition.name}: row must be an object`,
		)
	}

	const record = row as Record<string, unknown>
	const path = `EntityFieldCollection ${entityTypeLabel}.${fieldDefinition.name}`

	if (record[EntityMetaKey.ParentId] === undefined) {
		throw new Error(`${path}: missing ${EntityMetaKey.ParentId}`)
	}

	if (!isEntityFieldCollectionRowShape(row)) {
		throw new Error(
			`${path}: expected a field collection row (${EntityMetaKey.ParentId}, ${EntityMetaKey.Value}, …)`,
		)
	}

	assertEntityFieldCollectionRowShell(record, path)

	const value = record[EntityMetaKey.Value]
	const seen = new WeakSet<object>()
	seen.add(row)

	if (fieldDefinition.type === EntityFieldType.Primitive) {
		const out = fieldDefinition.primitiveType(value)
		if (out instanceof arktype.errors) {
			throw new Error(`${path}.${EntityMetaKey.Value}: ${out.summary}`)
		}
		walkLoadedValue(value, `${path}.${EntityMetaKey.Value}`, seen)
		return
	}

	walkLoadedValue(value, `${path}.${EntityMetaKey.Value}`, seen)
}
