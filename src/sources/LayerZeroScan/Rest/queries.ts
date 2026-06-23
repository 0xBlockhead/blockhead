import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { LayerZeroScanJson } from '$/sources/LayerZeroScan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<LayerZeroScanJson>(binding, path)
)
