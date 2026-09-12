import { type as arktype } from 'arktype'

import {
	entity,
	facet,
	entityFieldAddressKey,
	type EntityFieldValuesByAddress,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'

const fixtureSchema = [entity({
	entityType: 'AddressedFieldFixture',
	labels: { singular: 'fixture', plural: 'fixtures' },
})({
	id: { primitiveType: arktype('string'), cardinality: EntityFieldCardinality.One },
	name: { primitiveType: arktype('string'), cardinality: EntityFieldCardinality.One },
	count: { primitiveType: arktype('number'), cardinality: EntityFieldCardinality.One },
	$$children: { entityType: 'AddressedFieldFixture', cardinality: EntityFieldCardinality.Many },
})({
	selectors: { Id: ['id'] },
	facets: {
		Variant: facet({ path: ['id'], is: 'variant' })({
			name: { primitiveType: arktype('number'), cardinality: EntityFieldCardinality.One },
		})({ facets: {
			Nested: facet({ path: ['Variant', 'name'], is: 0 })({
				name: { primitiveType: arktype('boolean'), cardinality: EntityFieldCardinality.One },
			}),
		} }),
	},
}), entity({
	entityType: 'OtherAddressedFixture',
	labels: { singular: 'other fixture', plural: 'other fixtures' },
})({
	id: { primitiveType: arktype('string'), cardinality: EntityFieldCardinality.One },
	name: { primitiveType: arktype('boolean'), cardinality: EntityFieldCardinality.One },
	otherOnly: { primitiveType: arktype('number'), cardinality: EntityFieldCardinality.One },
})({ selectors: { Id: ['id'] } })] as const

type Values = EntityFieldValuesByAddress<typeof fixtureSchema, 'AddressedFieldFixture'>
const name = entityFieldAddressKey('AddressedFieldFixture', [], 'name')
const count = entityFieldAddressKey('AddressedFieldFixture', [], 'count')
const children = entityFieldAddressKey('AddressedFieldFixture', [], '$$children')
const variantName = entityFieldAddressKey('AddressedFieldFixture', ['Variant'], 'name')
const nestedName = entityFieldAddressKey('AddressedFieldFixture', ['Variant', 'Nested'], 'name')

const valid: Values = {
	[name]: '',
	[count]: 0,
	[variantName]: 0,
	[nestedName]: false,
	[children]: [{ __selector: { id: 'child' }, __fields: { [name]: 'Child' } }],
}
const wrongName: Values = {
	// @ts-expect-error Another field's number type cannot satisfy a string field.
	[name]: 42,
}
const wrongCount: Values = {
	// @ts-expect-error Another field's string type cannot satisfy a numeric field.
	[count]: '42',
}
const wrongChild: Values = {
	// @ts-expect-error Nested addressed fields retain their own types through a cycle.
	[children]: [{ __selector: { id: 'child' }, __fields: { [name]: 42 } }],
}

const wrongFacet: Values = {
	// @ts-expect-error A root name string cannot satisfy a numeric facet name.
	[variantName]: 'root',
}
const wrongNestedFacet: Values = {
	// @ts-expect-error A parent facet number cannot satisfy a nested boolean name.
	[nestedName]: 0,
}

void [valid, wrongName, wrongCount, wrongChild, wrongFacet, wrongNestedFacet]

type BothValues = EntityFieldValuesByAddress<typeof fixtureSchema, typeof fixtureSchema[number]['entityType']>
const otherName = entityFieldAddressKey('OtherAddressedFixture', [], 'name')
const validBoth: BothValues = { [name]: 'first', [otherName]: false }
const wrongOtherName: BothValues = {
	// @ts-expect-error A union of entity types must not union their same-named field values.
	[otherName]: 'first',
}
const wrongFirstName: BothValues = {
	// @ts-expect-error The other entity's boolean name cannot satisfy this entity's string name.
	[name]: true,
}
const crossedOtherField: BothValues = {
	// @ts-expect-error A field of the other entity cannot appear under this entity's address.
	[entityFieldAddressKey('AddressedFieldFixture', [], 'otherOnly')]: 1,
}
const crossedFirstField: BothValues = {
	// @ts-expect-error A field of this entity cannot appear under the other entity's address.
	[entityFieldAddressKey('OtherAddressedFixture', [], 'count')]: 1,
}
void [validBoth, wrongOtherName, wrongFirstName, crossedOtherField, crossedFirstField]
