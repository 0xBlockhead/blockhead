import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/EntityType.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const isEntityReferenceWithId = <_E extends EntityType>(
	v: JsonValue | { readonly [EntityMetaKey.Selector]: EntitySelector<typeof schema, _E> } | undefined,
): v is { [EntityMetaKey.Selector]: EntitySelector<typeof schema, _E> } => (
	v != null
	&& typeof v === 'object'
	&& !Array.isArray(v)
	&& EntityMetaKey.Selector in v
)
