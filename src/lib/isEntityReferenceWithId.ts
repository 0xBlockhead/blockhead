import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const isEntityReferenceWithId = <_E extends EntityType>(
	v: JsonValue | { readonly [EntityMetaKey.Id]: EntityId<typeof schema, _E> } | undefined,
): v is { [EntityMetaKey.Id]: EntityId<typeof schema, _E> } => (
	v != null
	&& typeof v === 'object'
	&& !Array.isArray(v)
	&& EntityMetaKey.Id in v
)
