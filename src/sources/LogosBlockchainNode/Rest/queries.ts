import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { LogosBlockchainNodeJson } from '$/sources/LogosBlockchainNode/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<LogosBlockchainNodeJson>(binding, path)
)
