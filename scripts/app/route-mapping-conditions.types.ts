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
	probeCases: [
		{
			id: 'default',
			params: {
				id: 'fixture',
			},
		},
	],
} as const

defineRoutes(routeConditionSchema)({
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

// @ts-expect-error Conditions must reference declared fields.
defineRoutes(routeConditionSchema)({
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							path: ['missing'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

// @ts-expect-error Scalar fields do not support includes.
defineRoutes(routeConditionSchema)({
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							path: ['kind'],
							includes: 'invalid',
						},
					},
				},
			},
		},
	},
})

// @ts-expect-error Many-valued fields require includes or an item index.
defineRoutes(routeConditionSchema)({
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							path: ['tags'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

// @ts-expect-error Facet paths must name a declared projection field.
defineRoutes(routeConditionSchema)({
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							path: ['Missing', 'format'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})

// @ts-expect-error Entity references cannot discriminate route applicability.
defineRoutes(routeConditionSchema)({
	children: {
		'[id]': {
			selectors: {
				[EntityType.Network]: {
					Id: {
						...mapping,
						when: {
							path: ['$parent'],
							is: 'invalid',
						},
					},
				},
			},
		},
	},
})
