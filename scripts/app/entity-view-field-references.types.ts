import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	_ViewItemKind,
	entity,
	facet,
	type _ViewItem,
	type _ViewListSection,
	type _ViewQuery,
} from '../../APP.ts'


const rejectedQueryMetadata = {
	// @ts-expect-error Query slot metadata is not consumed by the compiler.
	slot: 'unused',
} satisfies _ViewQuery

const rejectedQuerySelectionMetadata = {
	// @ts-expect-error Singular query selection metadata is not consumed by the compiler.
	selection: {
		limit: 1,
	},
} satisfies _ViewQuery

const rejectedViewItemMetadata = {
	kind: _ViewItemKind.Text,
	// @ts-expect-error View item slot metadata is not consumed by the compiler.
	slot: 'unused',
} satisfies _ViewItem

const rejectedListSectionMetadata = {
	field: '$$items',
	// @ts-expect-error List section key metadata is not consumed by the compiler.
	key: 'unused',
} satisfies _ViewListSection

const rejectedListSectionItemMetadata = {
	field: '$$items',
	// @ts-expect-error List section Item metadata is not consumed by the compiler.
	Item: { raw: '<p>unused</p>' },
} satisfies _ViewListSection

const rejectedListSectionEmptyMetadata = {
	field: '$$items',
	// @ts-expect-error List section Empty metadata is not consumed by the compiler.
	Empty: { raw: '<p>unused</p>' },
} satisfies _ViewListSection

const rejectedListSectionSlotMetadata = {
	field: '$$items',
	// @ts-expect-error List section slot metadata is not consumed by the compiler.
	slot: 'unused',
} satisfies _ViewListSection

void rejectedQueryMetadata
void rejectedQuerySelectionMetadata
void rejectedViewItemMetadata
void rejectedListSectionMetadata
void rejectedListSectionItemMetadata
void rejectedListSectionEmptyMetadata
void rejectedListSectionSlotMetadata


entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'type fixture',
		plural: 'type fixtures',
	},
})({
	id: {
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
	kind: {
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
	'$$items': {
		type: EntityFieldType.EntitiesReference,
		cardinality: EntityFieldCardinality.Many,
		entityType: EntityType.Network,
	},
})({
	selectors: {
		Id: ['id'],
	},
	facets: {
		Parent: facet({
			path: ['kind'],
			is: 'parent',
		})({
			facetField: {
				type: EntityFieldType.Primitive,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				valueType: 'string',
			},
		})({
			facets: {
				Child: facet({
					path: ['kind'],
					is: 'child',
				})({
					nestedField: {
						type: EntityFieldType.Primitive,
						cardinality: EntityFieldCardinality.ZeroOrOne,
						valueType: 'string',
					},
				})({}),
			},
		}),
	},
	views: {
		singular: {
			query: {
				// @ts-expect-error Singular query fields must reference captured entity fields.
				fields: [
					'id',
					['Parent', 'facetField'],
					['Parent', 'Child', 'nestedField'],
					'missingQueryField',
				],
			},
			summary: {
				// @ts-expect-error Summary items must reference captured entity fields.
				title: [
					'id',
					{ field: ['Parent', 'facetField'] },
					'missingSummaryField',
				],
			},
			content: {
				// @ts-expect-error Definition-list items must reference captured entity fields.
				dl: [[
					'id',
					{ field: ['Parent', 'missingFacetField'] },
				]],
				// @ts-expect-error List source fields must reference captured entity fields.
				lists: [{
					field: 'missingListField',
				}],
			},
			carousels: [{
				label: 'Fixture carousel',
				// @ts-expect-error Carousel conditions must reference captured entity fields.
				conditions: [{
					field: ['MissingFacet', 'facetField'],
				}],
				sections: [{
					field: ['Parent', 'Child', 'missingNestedField'],
				}],
			}],
		},
		plural: {
			query: {
				// @ts-expect-error Plural query fields must reference captured entity fields.
				openFields: [
					'$$items',
					'missingPluralQueryField',
				],
			},
			row: {
				// @ts-expect-error Plural row items must reference captured entity fields.
				title: [
					'id',
					{ field: 'missingPluralRowField' },
				],
			},
		},
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'sibling facet fixture',
		plural: 'sibling facet fixtures',
	},
})({
	id: {
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
	kind: {
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		Id: ['id'],
	},
	facets: {
		Left: facet({
			path: ['kind'],
			is: 'left',
		})({
			symbol: {
				type: EntityFieldType.Primitive,
				cardinality: EntityFieldCardinality.One,
				valueType: 'string',
			},
			'$icon': {
				type: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				entityType: EntityType.Network,
			},
			'$$markets': {
				type: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
				entityType: EntityType.Network,
			},
		})({
			facets: {
				Nested: facet({
					path: ['kind'],
					is: 'left-nested',
				})({
					nestedSymbol: {
						type: EntityFieldType.Primitive,
						cardinality: EntityFieldCardinality.One,
						valueType: 'string',
					},
				})({}),
			},
		}),
		Right: facet({
			path: ['kind'],
			is: 'right',
		})({
			symbol: {
				type: EntityFieldType.Primitive,
				cardinality: EntityFieldCardinality.One,
				valueType: 'string',
			},
			'$icon': {
				type: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				entityType: EntityType.Network,
			},
			'$$markets': {
				type: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
				entityType: EntityType.Network,
			},
		})({}),
	},
	views: {
		singular: {
			query: {
				fields: [
					['Left', 'symbol'],
					['Right', 'symbol'],
					['Left', '$icon'],
					['Right', '$icon'],
					['Left', '$$markets'],
					['Right', '$$markets'],
				],
			},
			summary: {
				title: [
					['Left', 'symbol'],
					['Right', 'symbol'],
				],
			},
			content: {
				dl: [[
					['Left', '$icon'],
					['Right', '$icon'],
				]],
			},
			lists: [
				{ field: ['Left', '$$markets'] },
				{ field: ['Right', '$$markets'] },
			],
		},
		plural: {
			row: {
				title: [
					['Left', 'symbol'],
					['Right', 'symbol'],
				],
			},
		},
	},
})

entity({
	entityType: EntityType.Network,
	labels: {
		singular: 'invalid sibling facet fixture',
		plural: 'invalid sibling facet fixtures',
	},
})({
	id: {
		type: EntityFieldType.Primitive,
		cardinality: EntityFieldCardinality.One,
		valueType: 'string',
	},
})({
	selectors: {
		Id: ['id'],
	},
	views: {
		singular: {
			query: {
				// @ts-expect-error unqualified sibling facet field
				fields: ['symbol'],
			},
			content: {
				// @ts-expect-error wrong sibling facet field; invalid nested facet path
				dl: [[
					['Right', 'leftOnly'],
					['Left', 'MissingNested', 'nestedSymbol'],
				]],
			},
		},
		plural: {},
	},
})
