import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { OsmosisLCDJson } from '$/sources/OsmosisLCD/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<OsmosisLCDJson>(binding, path)
)
