import {
	EntityFieldCardinality,
	EntityFieldType,
	defineRoutes,
} from './model.ts'

enum EntityType {
	Network = 'Network',
}

const routeConditionSchema = {
	valueTypes: [
		{
			id: 'string',
			routeParam: {
				matcher: 'stringSegment',
			},
			type: {
				primitive: 'string',
			},
		},
	],
	entities: [
		{
			entityType: EntityType.Network,
			selectors: [
				{
					name: 'Id',
					fields: ['id'],
				},
			],
			fields: [
				{
					name: 'id',
					type: EntityFieldType.Primitive,
					cardinality: EntityFieldCardinality.One,
					valueType: 'string',
				},
				{
					name: 'kind',
					type: EntityFieldType.Primitive,
					cardinality: EntityFieldCardinality.One,
					valueType: 'string',
				},
				{
					name: 'tags',
					type: EntityFieldType.Primitive,
					cardinality: EntityFieldCardinality.Many,
					valueType: 'string',
				},
				{
					name: '$parent',
					type: EntityFieldType.EntityReference,
					cardinality: EntityFieldCardinality.ZeroOrOne,
					entityType: EntityType.Network,
				},
			],
			facets: [
				{
					name: 'Nested',
					condition: {
						path: ['kind'],
						is: 'nested',
					},
					fields: [
						{
							name: 'format',
							type: EntityFieldType.Primitive,
							cardinality: EntityFieldCardinality.One,
							valueType: 'string',
						},
					],
				},
			],
		},
	],
} as const

const mapping = {
	params: {
		id: ['id'],
	},
} as const

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							all: [
								{
									path: ['kind'],
									is: 'valid',
								},
								{
									path: ['tags'],
									includes: 'valid',
								},
								{
									path: ['tags', 0],
									isOneOf: ['valid'],
								},
								{
									path: ['Nested', 'format'],
									is: 'valid',
								},
							],
						},
					},
				},
			},
		},
	},
})

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
							...mapping,
							when: {
								// @ts-expect-error Conditions must reference declared fields.
								path: ['missing'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
							...mapping,
							when: {
								// @ts-expect-error Scalar fields do not support includes.
								path: ['kind'],
							includes: 'invalid',
						},
					},
				},
			},
		},
	},
})

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
							...mapping,
							when: {
								// @ts-expect-error Many-valued fields require includes or an item index.
								path: ['tags'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
							...mapping,
							when: {
								// @ts-expect-error Facet paths must name a declared projection field.
								path: ['Missing', 'format'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

defineRoutes(routeConditionSchema)({
	outcomes: {},
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
							...mapping,
							when: {
								// @ts-expect-error Entity references cannot discriminate route applicability.
								path: ['$parent'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})
