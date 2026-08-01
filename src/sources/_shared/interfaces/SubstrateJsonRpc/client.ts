import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const substrateJsonRpc = <_Result>({
	binding,
	method,
	params,
}: {
	binding: SourceBinding
	method: string
	params?: readonly unknown[]
}) => jsonRpc2<_Result>(binding, method, params ?? [])
