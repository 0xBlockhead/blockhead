import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BigDipperJson } from '$/sources/BigDipper/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BigDipperJson>(binding, path)
)
