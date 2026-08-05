import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'
import {
	isJsonObject,
	isJsonString,
	type JsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

export const iterateXrplLedgerLive = async function* (
	targetKey: string,
	signal?: AbortSignal
): AsyncGenerator<JsonObject> {
	for await (const event of iterateSourceLive({
		source: Source.XrplClio_JsonRpc,
		targetKey,
		operationGroup: SourceOperationGroup.GenericSubscribe,
	}, signal, JSON.stringify({
		id: 'XrplClio_JsonRpc:subscribe:ledger',
		command: 'subscribe',
		streams: ['ledger'],
	}))) {
		if (event.type === 'connected')
			continue
		if (event.type === 'grpc-message')
			throw new Error('XrplClio_JsonRpc: ledger subscription received a gRPC message')

		let message: JsonValue
		try {
			message = JSON.parse(event.payload)
		} catch {
			continue
		}
		if (
			!isJsonObject(message)
			|| !isJsonString(message.type)
			|| message.type !== 'ledgerClosed'
		)
			continue

		yield message
	}
}
