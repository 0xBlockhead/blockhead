import type { ClientContext } from '$/client/$client.svelte.ts'
import { entityFieldAddressKey } from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'


export const retryEntityField = (
	client: Pick<ClientContext<typeof schema, Source>, 'entityFieldCollections'>,
	entityType: EntityType,
	facetPath: readonly string[],
	fieldName: string,
) => {
	const fieldAddress = entityFieldAddressKey(entityType, facetPath, fieldName)
	const collection = client.entityFieldCollections[entityType]?.[fieldAddress]
	if (collection === undefined)
		throw new Error(`${fieldAddress}: cannot retry an unknown field`)
	collection.utils.refresh()
}
