export type SelectorWitness = Readonly<{
	identity: string
	values: Readonly<Record<string, string | number>>
}>

export type SelectorCollision = Readonly<{
	selectorValues: readonly (string | number)[]
	identities: readonly string[]
}>

const collisionsForFields = (
	witnesses: readonly SelectorWitness[],
	fields: readonly string[]
): readonly SelectorCollision[] => {
	const identitiesBySelector = new Map<string, { selectorValues: readonly (string | number)[]; identities: string[] }>()
	for (const witness of witnesses) {
		const selectorValues = fields.map((field) => witness.values[field])
		if (selectorValues.some((value) => value == null))
			throw new Error(`Selector witness ${witness.identity} is missing a value for ${fields[selectorValues.indexOf(undefined)]}`)
		const key = JSON.stringify(selectorValues)
		const group = identitiesBySelector.get(key) ?? { selectorValues, identities: [] }
		group.identities.push(witness.identity)
		identitiesBySelector.set(key, group)
	}
	return [...identitiesBySelector.values()]
		.filter(({ identities }) => new Set(identities).size > 1)
		.map(({ selectorValues, identities }) => ({ selectorValues, identities: [...new Set(identities)].toSorted() }))
		.toSorted((left, right) => JSON.stringify(left.selectorValues).localeCompare(JSON.stringify(right.selectorValues), 'en'))
}

export const auditSelectorWitnesses = (
	witnesses: readonly SelectorWitness[], selectorFields: readonly string[], independentFields: readonly string[] = []
) => ({
	collisions: collisionsForFields(witnesses, selectorFields),
	redundantFields: selectorFields.filter((field) => collisionsForFields(witnesses, selectorFields.filter((candidate) => candidate !== field)).length === 0),
	missingIndependentFields: independentFields.filter((field) => !selectorFields.includes(field) && collisionsForFields(witnesses, selectorFields).some(({ identities }) => {
		const values = identities.map((identity) => witnesses.find((witness) => witness.identity === identity)?.values[field])
		return new Set(values).size > 1
	})),
})
