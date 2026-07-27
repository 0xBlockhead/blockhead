import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	Source,
	entity,
} from '../../APP.ts'

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'valid fixture',
		plural: 'valid fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		Id: ['id'],
	},
	views: {
		plural: {
			// @ts-expect-error Filter paths must start at a declared selector field.
			filters: [
				{
					prop: 'id',
					selectorPath: 'id',
				},
				{
					prop: 'missing',
					selectorPath: 'missing',
				},
			],
		},
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'source selection fixture',
		plural: 'source selection fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		Id: ['id'],
	},
	views: {
		plural: {
			query: {
				// @ts-expect-error Source-selection fields must name fields declared by the view entity.
				sources: {
					default: [Source.Constants_Internal],
					cases: [{
						when: [{
							field: 'missing',
							equals: 'value',
						}],
						sources: [Source.Constants_Internal],
					}],
				},
			},
		},
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'valid optional fixture',
		plural: 'valid optional fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		valueType: 'string',
	},
})({
	selectors: {
		Id: ['id'],
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'many fixture',
		plural: 'many fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.Many,
		valueType: 'string',
	},
})({
	selectors: {
		// @ts-expect-error Selector fields must be singular.
		Id: ['id'],
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'zero fixture',
		plural: 'zero fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.Zero,
		valueType: 'string',
	},
})({
	selectors: {
		// @ts-expect-error Selector fields must be singular.
		Id: ['id'],
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'missing fixture',
		plural: 'missing fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		// @ts-expect-error Selector fields must name declared base fields.
		Missing: ['missing'],
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'empty fixture',
		plural: 'empty fixtures',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		// @ts-expect-error Selector tuples must be nonempty.
		Empty: [],
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'entities-reference fixture',
		plural: 'entities-reference fixtures',
	},
})({
	$$ids: {
		label: 'IDs',
		type: EntityFieldType.EntitiesReference,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		entityType: EntityType.Network,
	},
})({
	selectors: {
		// @ts-expect-error Selector fields must be primitive or singular entity references.
		Invalid: ['$$ids'],
	},
})
