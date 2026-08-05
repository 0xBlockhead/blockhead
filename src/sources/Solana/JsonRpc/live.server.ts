import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'
import {
	isJsonNumber,
	isJsonObject,
	isJsonString,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

export const iterateSolanaSlotLive = async function* (
	targetKey: string,
	signal?: AbortSignal
): AsyncGenerator<{
	slot: number
	parent: number
	root: number
}> {
	for await (const event of iterateSourceLive({
		source: Source.Solana_JsonRpc,
		targetKey,
		operationGroup: SourceOperationGroup.GenericSubscribe,
	}, signal, JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		method: 'slotSubscribe',
	}))) {
		if (event.type === 'connected')
			continue
		if (event.type === 'grpc-message')
			throw new Error('Solana_JsonRpc: slotSubscribe received a gRPC message')

		let message: JsonValue
		try {
			message = JSON.parse(event.payload)
		} catch {
			continue
		}
		if (
			!isJsonObject(message)
			|| !isJsonString(message.method)
			|| message.method !== 'slotNotification'
			|| !isJsonObject(message.params)
			|| !isJsonObject(message.params.result)
		)
			continue

		const {
			slot,
			parent,
			root,
		} = message.params.result
		if (
			!isJsonNumber(slot)
			|| !Number.isSafeInteger(slot)
			|| slot < 0
			|| !isJsonNumber(parent)
			|| !Number.isSafeInteger(parent)
			|| parent < 0
			|| !isJsonNumber(root)
			|| !Number.isSafeInteger(root)
			|| root < 0
		)
			throw new Error('Solana_JsonRpc: slotNotification returned an invalid slot')

		yield {
			slot,
			parent,
			root,
		}
	}
}
