import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getHeaderSyncState = (binding: SourceBinding) => (
	request(binding, 'header.SyncState')
)

export const getHeaderLocalHead = (binding: SourceBinding) => (
	request(binding, 'header.LocalHead')
)

export const getNodeInfo = (binding: SourceBinding) => (
	request(binding, 'node.Info')
)
