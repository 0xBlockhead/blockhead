import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { XrpScanJson } from '$/sources/XrpScan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<XrpScanJson>(binding, path)
)
