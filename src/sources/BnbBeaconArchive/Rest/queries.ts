import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BnbBeaconArchiveJson } from '$/sources/BnbBeaconArchive/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BnbBeaconArchiveJson>(binding, path)
)
