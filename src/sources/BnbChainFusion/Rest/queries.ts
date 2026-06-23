import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BnbChainFusionJson } from '$/sources/BnbChainFusion/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BnbChainFusionJson>(binding, path)
)
