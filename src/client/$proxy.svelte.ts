import type { RemoteResource } from '@sveltejs/kit'
import { stringify } from 'devalue'
import { tick } from 'svelte'

import type {
	EntityCollectionsContext,
} from '$/client/$client.svelte.ts'
import type {
	SubscribeEntityResource,
	SubscribeError,
	SubscribeFieldSelection,
	SubscribeSelection,
} from '$/client/$subscribe.svelte.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldResolvedValue,
	type EntityFieldSingleResolvedValue,
	type EntityReferenceValue,
	type EntitySelector,
	type EntityType as EntityTypeName,
	type Schema,
} from '$/schema/$schema.ts'


// Types/constants
type EntityProxyError<_Schema extends Schema> = readonly SubscribeError<_Schema>[] | undefined

export type EntityProxySelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = SubscribeSelection<_Schema, _EntityType>

export type EntityProxyFieldSelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = SubscribeFieldSelection<_Schema, _EntityType>

type EntityProxyEntitySelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = Omit<SubscribeSelection<_Schema, _EntityType>, 'fields'>

type EntityProxyRemoteResource<
	_Schema extends Schema,
	_Value,
> = Omit<RemoteResource<_Value>, 'error'> & {
	readonly error: EntityProxyError<_Schema>
}

type EntityProxyCallableFieldResource<
	_Schema extends Schema,
	_Value,
	_Selection,
> = EntityProxyRemoteResource<_Schema, _Value> & {
	(selection?: _Selection): EntityProxyCallableFieldResource<_Schema, _Value, _Selection>
}

type EntityProxyManyFieldCurrent<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	readonly values: readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
	readonly totalCount?: number
}

type EntityProxyManyReferenceFieldCurrent<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_ReferencedEntityType extends EntityTypeName<_Schema>,
> = {
	readonly values: readonly EntityProxyResource<_Schema, _ReferencedEntityType>[]
	readonly entities: readonly EntityProxyResource<_Schema, _ReferencedEntityType>[]
	readonly totalCount?: number
}

type EntityProxyReferenceFieldCurrent<
	_Schema extends Schema,
	_ReferencedEntityType extends EntityTypeName<_Schema>,
> = EntityProxyResource<_Schema, _ReferencedEntityType>
	& EntityReferenceValue<_Schema, _ReferencedEntityType>
	& {
		readonly value: EntityReferenceValue<_Schema, _ReferencedEntityType>
		readonly entity: EntityProxyCurrent<_Schema, _ReferencedEntityType>
	}

type EntityProxyFieldCurrent<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		EntityProxyManyReferenceFieldCurrent<_Schema, _EntityType, _FieldName, _ReferencedEntityType>
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		EntityProxyManyFieldCurrent<_Schema, _EntityType, _FieldName>
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		EntityProxyReferenceFieldCurrent<_Schema, _ReferencedEntityType> | undefined
	:
		EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
)

type EntityProxyFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
}

type EntityProxyCurrentFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>
}

export type EntityProxyCurrent<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = EntityProxyCurrentFields<_Schema, _EntityType> & {
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly value: {
		readonly entitySelector: EntitySelector<_Schema, _EntityType>
		readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	}
	readonly fields: EntityProxyCurrentFields<_Schema, _EntityType>
}

export type EntityProxyResource<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = EntityProxyRemoteResource<_Schema, EntityProxyCurrent<_Schema, _EntityType>> & {
	readonly entityType: _EntityType
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly value: {
		readonly entitySelector: EntitySelector<_Schema, _EntityType>
		readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	}
	readonly entity: EntityProxyCurrent<_Schema, _EntityType> | undefined
	field: <const _FieldName extends EntityFieldName<_Schema, _EntityType>>(
		fieldName: _FieldName,
		selection?: EntityProxyFieldSelection<_Schema, _EntityType>
	) => EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
} & EntityProxyFields<_Schema, _EntityType>

export type EntityProxyFieldResource<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		EntityProxyCallableFieldResource<
			_Schema,
			EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>,
			EntityProxyFieldSelection<_Schema, _EntityType>
		> & EntityProxyFields<_Schema, _ReferencedEntityType> & NonNullable<EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>>
	:
		EntityProxyCallableFieldResource<
			_Schema,
			EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>,
			EntityProxyFieldSelection<_Schema, _EntityType>
		> & NonNullable<EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>>
)

type SubscribeEntity<_Schema extends Schema> = <
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: _Selection
) => SubscribeEntityResource<_Schema, _EntityType, _Selection>

const resourceProperties = new Set<PropertyKey>([
	'current',
	'error',
	'loading',
	'ready',
	'then',
	'catch',
	'finally',
	Symbol.toStringTag,
])

const entityProperties = new Set<PropertyKey>([
	'entityType',
	'entitySelector',
	'value',
	'entity',
	'field',
	EntityMetaKey.Selector,
	...resourceProperties,
])

const cacheKeyObjectIds = new WeakMap<object, number>()
let cacheKeyObjectId = 0

const cacheKey = (
	value: unknown
): string => {
	if (value == null)
		return String(value)

	if (
		typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'boolean'
		|| typeof value === 'bigint'
	)
		return `${typeof value}:${String(value)}`

	if (typeof value === 'function') {
		const existingId = cacheKeyObjectIds.get(value)
		if (existingId != null)
			return `function:${String(existingId)}`

		cacheKeyObjectId += 1
		cacheKeyObjectIds.set(value, cacheKeyObjectId)
		return `function:${String(cacheKeyObjectId)}`
	}

	if (typeof value !== 'object')
		return `${typeof value}:${String(value)}`

	if (Array.isArray(value))
		return `[${value.map(cacheKey).join(',')}]`

	const objectValue = value as Record<string, unknown>
	return `{${Object.keys(objectValue)
		.toSorted()
		.map((key) => `${cacheKey(key)}:${cacheKey(objectValue[key])}`)
		.join(',')}}`
}

type FieldResultMany<_Value> = {
	readonly values: readonly _Value[]
	readonly totalCount?: number
}

type FieldResourceController<
	_Schema extends Schema,
	_Value,
	_Selection,
> = {
	readonly current: _Value | undefined
	readonly error: EntityProxyError<_Schema>
	readonly loading: boolean
	readonly ready: boolean
	readonly then: Promise<_Value>['then']
	readonly catch: Promise<_Value>['catch']
	readonly finally: Promise<_Value>['finally']
	readonly [Symbol.toStringTag]: string
	withSelection: (selection?: _Selection) => EntityProxyCallableFieldResource<_Schema, _Value, _Selection>
	nestedField: (fieldName: string, selection?: _Selection) => EntityProxyCallableFieldResource<_Schema, unknown, _Selection> | undefined
}


// State
class EntityProxyController<
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
> {
	readonly entityType: _EntityType
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
	readonly #context: EntityCollectionsContext<_Schema>
	readonly #subscribeEntity: SubscribeEntity<_Schema>
	readonly #selection: EntityProxyEntitySelection<_Schema, _EntityType>
	readonly #fieldResources = new Map<string, EntityProxyCallableFieldResource<_Schema, unknown, EntityProxyFieldSelection<_Schema, _EntityType>>>()

	#fields = $derived.by(() => {
		const fields: Record<string, unknown> = {}
		for (const [key, resource] of this.#fieldResources)
			if (resource.ready)
				fields[key.slice(0, key.indexOf(':'))] = resource.current

		return fields as EntityProxyCurrentFields<_Schema, _EntityType>
	})
	#current = $derived.by(() => (
		this.#fieldResources.size === 0 ?
			undefined
		:
			{
				...this.#fields,
				entitySelector: this.entitySelector,
				[EntityMetaKey.Selector]: this.entitySelector,
				value: {
					entitySelector: this.entitySelector,
					[EntityMetaKey.Selector]: this.entitySelector,
				},
				fields: this.#fields,
			}
	))
	#loading = $derived.by(() => (
		[...this.#fieldResources.values()].some((resource) => resource.loading)
	))
	#ready = $derived.by(() => (
		this.#fieldResources.size > 0
		&& [...this.#fieldResources.values()].every((resource) => resource.ready)
	))
	#error = $derived.by(() => (
		[...this.#fieldResources.values()].find((resource) => resource.error != null)?.error
	))

	constructor(
		context: EntityCollectionsContext<_Schema>,
		subscribeEntity: SubscribeEntity<_Schema>,
		entityType: _EntityType,
		entitySelector: EntitySelector<_Schema, _EntityType>,
		selection: EntityProxySelection<_Schema, _EntityType> = {}
	) {
		this.#context = context
		this.#subscribeEntity = subscribeEntity
		this.entityType = entityType
		this.entitySelector = entitySelector
		this.#selection = selection as EntityProxyEntitySelection<_Schema, _EntityType>

		for (const [
			fieldName,
			fieldSelection,
		] of Object.entries(
			(selection.fields ?? {}) as Record<string, true | EntityProxyFieldSelection<_Schema, _EntityType>>
		))
			if (fieldSelection)
				this.field(
					fieldName as EntityFieldName<_Schema, _EntityType>,
					fieldSelection === true ?
						undefined
					:
						fieldSelection as EntityProxyFieldSelection<_Schema, _EntityType>
				)
	}

	get current(): EntityProxyCurrent<_Schema, _EntityType> | undefined {
		return this.#current
	}

	get [EntityMetaKey.Selector]() {
		return this.entitySelector
	}

	get value() {
		return {
			entitySelector: this.entitySelector,
			[EntityMetaKey.Selector]: this.entitySelector,
		}
	}

	get entity() {
		return this.current
	}

	get error() {
		return this.#error
	}

	get loading() {
		return this.#loading
	}

	get ready() {
		return this.#ready
	}

	get then(): Promise<EntityProxyCurrent<_Schema, _EntityType>>['then'] {
		return (onFulfilled, onRejected) => {
			const result = Promise.all([...this.#fieldResources.values()].map((resource) => resource))
				.then(tick)
				.then(() => this.current ?? {
					...this.#fields,
					entitySelector: this.entitySelector,
					[EntityMetaKey.Selector]: this.entitySelector,
					value: {
						entitySelector: this.entitySelector,
						[EntityMetaKey.Selector]: this.entitySelector,
					},
					fields: this.#fields,
				})

			return result.then(onFulfilled, onRejected)
		}
	}

	get catch(): Promise<EntityProxyCurrent<_Schema, _EntityType>>['catch'] {
		return (onRejected) => this.then(undefined, onRejected)
	}

	get finally(): Promise<EntityProxyCurrent<_Schema, _EntityType>>['finally'] {
		return (onFinally) => this.then(
			(value) => {
				onFinally?.()
				return value
			},
			(error) => {
				onFinally?.()
				throw error
			}
		)
	}

	get [Symbol.toStringTag]() {
		return 'RemoteResource'
	}

	field<const _FieldName extends EntityFieldName<_Schema, _EntityType>>(
		fieldName: _FieldName,
		selection?: EntityProxyFieldSelection<_Schema, _EntityType>
	): EntityProxyFieldResource<_Schema, _EntityType, _FieldName> {
		const fieldDefinition = this.#context.entityFieldDefinitionByEntityTypeAndName[this.entityType][fieldName]
		if (fieldDefinition == null)
			throw new Error(`${this.entityType}.${fieldName}: unknown selection field`)

		const key = `${fieldName}:${cacheKey(selection ?? {})}`
		const cached = this.#fieldResources.get(key)
		if (cached != null)
			return cached as EntityProxyFieldResource<_Schema, _EntityType, _FieldName>

		const resource = createCallableFieldResource(
			new EntityProxyFieldController(
				this,
				this.#context,
				this.#subscribeEntity,
				this.entityType,
				this.entitySelector,
				this.#selection,
				fieldName,
				fieldDefinition,
				selection
			)
		)
		this.#fieldResources.set(key, resource)
		return resource as EntityProxyFieldResource<_Schema, _EntityType, _FieldName>
	}
}

class EntityProxyFieldController<
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>,
> {
		readonly fieldDefinition: EntityFieldDefinition
		readonly #entity: EntityProxyController<_Schema, _EntityType>
		readonly #context: EntityCollectionsContext<_Schema>
		readonly #subscribeEntity: SubscribeEntity<_Schema>
		readonly #entitySelection: EntityProxySelection<_Schema, _EntityType>
		readonly #fieldName: _FieldName
		readonly #fieldSelection: EntityProxyFieldSelection<_Schema, _EntityType> | undefined
		readonly #source: SubscribeEntityResource<_Schema, _EntityType, SubscribeSelection<_Schema, _EntityType>>
		readonly #childEntities = new Map<string, EntityProxyResource<_Schema, EntityTypeName<_Schema>>>()
		readonly #nestedFields = new Map<string, EntityProxyCallableFieldResource<_Schema, unknown, EntityProxyFieldSelection<_Schema, _EntityType>>>()

		#rawCurrent = $derived.by(() => (
			this.#source.current == null ?
				undefined
			:
				(this.#source.current.fields as Record<string, EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName> | undefined>)[this.#fieldName]
		))
		#current = $derived.by(() => this.#project(this.#rawCurrent))

	constructor(
		entity: EntityProxyController<_Schema, _EntityType>,
		context: EntityCollectionsContext<_Schema>,
		subscribeEntity: SubscribeEntity<_Schema>,
		entityType: _EntityType,
		entitySelector: EntitySelector<_Schema, _EntityType>,
		entitySelection: EntityProxySelection<_Schema, _EntityType>,
			fieldName: _FieldName,
			fieldDefinition: EntityFieldDefinition,
			fieldSelection?: EntityProxyFieldSelection<_Schema, _EntityType>
		) {
			this.#entity = entity
			this.#context = context
			this.#subscribeEntity = subscribeEntity
			this.#entitySelection = entitySelection
			this.#fieldName = fieldName
			this.fieldDefinition = fieldDefinition
			this.#fieldSelection = fieldSelection
			this.#source = subscribeEntity(
				entityType,
				entitySelector,
				{
					...entitySelection,
					fields: {
						[fieldName]: fieldSelection ?? true,
					},
				} as SubscribeSelection<_Schema, _EntityType>
			)
		}

		get current(): EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName> | undefined {
			return this.#current
		}

		get error() {
			return this.#source.error
		}

		get loading() {
			return this.#source.loading
		}

		get ready() {
			return this.#source.ready
		}

		get then(): Promise<EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>>['then'] {
			return (onFulfilled, onRejected) => {
				const result = this.#source
					.then((source) => this.#project(
						(source.fields as Record<string, EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName> | undefined>)[this.#fieldName]
					))
					.then(async (value) => {
					await tick()
					return value as EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>
				})

				return result.then(onFulfilled, onRejected)
			}
		}

	get catch(): Promise<EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>>['catch'] {
		return (onRejected) => this.then(undefined, onRejected)
	}

	get finally(): Promise<EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>>['finally'] {
		return (onFinally) => this.then(
			(value) => {
				onFinally?.()
				return value
			},
			(error) => {
				onFinally?.()
				throw error
			}
		)
	}

		get [Symbol.toStringTag]() {
			return 'RemoteResource'
		}

	withSelection(
		selection?: EntityProxyFieldSelection<_Schema, _EntityType>
	): EntityProxyCallableFieldResource<_Schema, EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>, EntityProxyFieldSelection<_Schema, _EntityType>> {
		return selection == null ?
			createCallableFieldResource(this)
		:
			this.#entity.field(this.#fieldName, selection)
	}

	nestedField(
		fieldName: string,
		selection?: EntityProxyFieldSelection<_Schema, _EntityType>
	): EntityProxyCallableFieldResource<_Schema, unknown, EntityProxyFieldSelection<_Schema, _EntityType>> | undefined {
		if (this.fieldDefinition.type !== EntityFieldType.EntityReference)
			return undefined

		const key = `${fieldName}:${cacheKey(selection ?? {})}`
		const cached = this.#nestedFields.get(key)
		if (cached != null)
			return cached

		const resource: EntityProxyCallableFieldResource<_Schema, unknown, EntityProxyFieldSelection<_Schema, _EntityType>> = createCallableFieldResource(
			new EntityProxyNestedFieldController(
				this as unknown as EntityProxyFieldController<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
				fieldName,
				selection
			)
		)
		this.#nestedFields.set(key, resource)
		return resource
	}

	#project(
		raw: EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName> | undefined
	): EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName> | undefined {
		if (
			this.fieldDefinition.type === EntityFieldType.EntityReference
			&& raw != null
		)
			return this.#referenceProxy(raw as EntityReferenceValue<_Schema, EntityTypeName<_Schema>>) as EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>

		if (
			this.fieldDefinition.type === EntityFieldType.EntitiesReference
			&& raw != null
		) {
			const result = raw as unknown as FieldResultMany<EntityReferenceValue<_Schema, EntityTypeName<_Schema>>>
			return {
				values: result.values.map((value) => this.#referenceProxy(value)),
				entities: result.values.map((value) => this.#referenceProxy(value)),
				...(result.totalCount != null && {
					totalCount: result.totalCount,
				}),
			} as EntityProxyFieldCurrent<_Schema, _EntityType, _FieldName>
		}

		return raw
	}

	#referenceProxy(
		value: EntityReferenceValue<_Schema, EntityTypeName<_Schema>>
	) {
		const entityType = (
			this.fieldDefinition as EntityFieldDefinition & {
				readonly entityType: EntityTypeName<_Schema>
			}
		).entityType
		const entitySelector = value[EntityMetaKey.Selector]
		const selection = {
			...(this.#fieldSelection?.sources != null && {
				sources: this.#fieldSelection.sources,
			}),
			...(this.#fieldSelection?.selectorSources != null && {
				selectorSources: this.#fieldSelection.selectorSources,
			}),
			...(this.#fieldSelection?.sources == null && this.#entitySelection.sources != null && {
				sources: this.#entitySelection.sources,
			}),
		} satisfies EntityProxySelection<_Schema, EntityTypeName<_Schema>>
		const key = stringify({
			entityType,
			entitySelector,
			selection,
		})
		const cached = this.#childEntities.get(key)
		if (cached != null)
			return cached

		const resource = createEntityProxyResource(
			this.#context,
			this.#subscribeEntity,
			entityType,
			entitySelector,
			selection
		)
		this.#childEntities.set(key, resource)
		return resource
	}
}

class EntityProxyNestedFieldController<
	const _Schema extends Schema,
	_Selection,
> {
	readonly #parent: EntityProxyFieldController<
		_Schema,
		EntityTypeName<_Schema>,
		EntityFieldName<_Schema, EntityTypeName<_Schema>>
	>
	readonly #fieldName: string
	readonly #fieldSelection: _Selection | undefined
	readonly #nestedFields = new Map<string, EntityProxyCallableFieldResource<_Schema, unknown, _Selection>>()

	#child = $derived.by(() => (
		this.#parent.current == null ?
			undefined
		:
			(this.#parent.current as EntityProxyReferenceFieldCurrent<_Schema, EntityTypeName<_Schema>>).field(this.#fieldName as EntityFieldName<_Schema, EntityTypeName<_Schema>>, this.#fieldSelection as EntityProxyFieldSelection<_Schema, EntityTypeName<_Schema>>)
	))

	constructor(
		parent: EntityProxyFieldController<
			_Schema,
			EntityTypeName<_Schema>,
			EntityFieldName<_Schema, EntityTypeName<_Schema>>
		>,
		fieldName: string,
		fieldSelection?: _Selection
	) {
		this.#parent = parent
		this.#fieldName = fieldName
		this.#fieldSelection = fieldSelection
	}

	get current() {
		return this.#child?.current
	}

	get error() {
		return this.#parent.error ?? this.#child?.error
	}

	get loading() {
		return (
			this.#parent.loading
			|| (
				this.#parent.ready
				&& this.#parent.current != null
				&& this.#child?.loading === true
			)
		)
	}

	get ready() {
		return (
			this.#parent.ready
			&& (
				this.#parent.current == null
				|| this.#child?.ready === true
			)
		)
	}

	get then(): Promise<unknown>['then'] {
		return (onFulfilled, onRejected) => {
			const result = this.#parent
				.then(() => this.#child)
				.then((child) => child == null ? undefined : child)
				.then(tick)
				.then(() => this.current)

			return result.then(onFulfilled, onRejected)
		}
	}

	get catch(): Promise<unknown>['catch'] {
		return (onRejected) => this.then(undefined, onRejected)
	}

	get finally(): Promise<unknown>['finally'] {
		return (onFinally) => this.then(
			(value) => {
				onFinally?.()
				return value
			},
			(error) => {
				onFinally?.()
				throw error
			}
		)
	}

	get [Symbol.toStringTag]() {
		return 'RemoteResource'
	}

	withSelection(
		selection?: _Selection
	): EntityProxyCallableFieldResource<_Schema, unknown, _Selection> {
		return selection == null ?
			createCallableFieldResource(this)
		:
			this.#parent.nestedField(this.#fieldName, selection as EntityProxyFieldSelection<_Schema, EntityTypeName<_Schema>>) as EntityProxyCallableFieldResource<_Schema, unknown, _Selection>
	}

	nestedField(
		fieldName: string,
		selection?: _Selection
	): EntityProxyCallableFieldResource<_Schema, unknown, _Selection> {
		const key = `${fieldName}:${cacheKey(selection ?? {})}`
		const cached = this.#nestedFields.get(key)
		if (cached != null)
			return cached

		const resource: EntityProxyCallableFieldResource<_Schema, unknown, _Selection> = createCallableFieldResource(
			new EntityProxyNestedFieldController(
				this as unknown as EntityProxyFieldController<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
				fieldName,
				selection
			)
		)
		this.#nestedFields.set(key, resource)
		return resource
	}
}

const createCallableFieldResource = <
	const _Schema extends Schema,
	_Value,
	_Selection,
>(
	controller: FieldResourceController<_Schema, _Value, _Selection>
): EntityProxyCallableFieldResource<_Schema, _Value, _Selection> => {
	const target = ((selection?: _Selection) => controller.withSelection(selection)) as EntityProxyCallableFieldResource<_Schema, _Value, _Selection>
	return new Proxy(target, {
		get(target, property, receiver) {
			if (resourceProperties.has(property))
				return Reflect.get(controller, property, controller)

			if (typeof property === 'string') {
				const nested = controller.nestedField(property)
				if (nested != null)
					return nested
			}

			if (property in target)
				return Reflect.get(target, property, receiver)

			return undefined
		},
		apply(_target, _this, argumentsList: [selection?: _Selection]) {
			return controller.withSelection(argumentsList[0])
		},
	})
}

const createEntityProxyResource = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
>(
	context: EntityCollectionsContext<_Schema>,
	subscribeEntity: SubscribeEntity<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: EntityProxySelection<_Schema, _EntityType>
): EntityProxyResource<_Schema, _EntityType> => {
	const controller = new EntityProxyController(
		context,
		subscribeEntity,
		entityType,
		entitySelector,
		selection
	)
	return new Proxy(controller, {
		get(target, property, receiver) {
			if (property === EntityMetaKey.Selector)
				return target.entitySelector

			if (property === 'value')
				return {
					entitySelector: target.entitySelector,
					[EntityMetaKey.Selector]: target.entitySelector,
				}

			if (property === 'entity')
				return target.current

			if (property === 'field')
				return target.field.bind(target)

			if (entityProperties.has(property))
				return Reflect.get(target, property, target)

			if (property in target)
				return Reflect.get(target, property, receiver)

			if (typeof property !== 'string')
				return undefined

			if (property in target.entitySelector)
				return target.entitySelector[property as keyof typeof target.entitySelector]

			return target.field(property as EntityFieldName<_Schema, _EntityType>)
		},
	}) as EntityProxyResource<_Schema, _EntityType>
}

export const createEntityProxy = <
	const _Schema extends Schema,
>(
	context: EntityCollectionsContext<_Schema>,
	subscribeEntity: SubscribeEntity<_Schema>
) => <
	const _EntityType extends EntityTypeName<_Schema>,
>(
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: EntityProxySelection<_Schema, _EntityType>
) => createEntityProxyResource(
	context,
	subscribeEntity,
	entityType,
	entitySelector,
	selection
)
