import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/XrplClio/bindings.ts'
import { xrplLedgerLive } from '$/sources/XrplClio/JsonRpc/live.remote.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonObject, JsonValue } from '$/typescript/JsonValue.ts'

const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getServerInfo = (binding: SourceBinding) => (
	request(binding, 'server_info')
)

export const getLedgerClosed = (binding: SourceBinding) => (
	request(binding, 'ledger_closed')
)

export const getClosedLedger = () => {
	const binding = bindings[Source.XrplClio_JsonRpc].find((candidate) => (
		candidate.delivery === SourceDelivery.RemoteQuery
	))
	if (binding == null)
		throw new Error('XrplClio_JsonRpc: RemoteQuery binding is missing')

	return getLedgerClosed(binding)
}

export const subscribeLedger = async function* (
	binding: SourceBinding,
	signal?: AbortSignal
): AsyncGenerator<JsonObject> {
	if (signal?.aborted)
		return

	if (
		binding.delivery !== SourceDelivery.RemoteLive
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericSubscribe)
		|| !binding.endpoints.some((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.WebSocketUrl
		))
	)
		throw new Error('XrplClio_JsonRpc: subscribeLedger requires the RemoteLive WebSocket binding')

	const ledgers = xrplLedgerLive({
		targetKey: binding.target.key,
	})[Symbol.asyncIterator]()
	const abort = () => {
		void ledgers.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await ledgers.next();
			!result.done;
			result = await ledgers.next()
		) {
			if (signal?.aborted)
				return

			yield result.value
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await ledgers.return?.()
	}
}

export const streamLedger = (signal?: AbortSignal) => {
	const binding = bindings[Source.XrplClio_JsonRpc].find((candidate) => (
		candidate.delivery === SourceDelivery.RemoteLive
	))
	if (binding == null)
		throw new Error('XrplClio_JsonRpc: RemoteLive binding is missing')

	return subscribeLedger(binding, signal)
}
