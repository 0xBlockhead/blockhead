import { sourceBindingId, type SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { sourceLive } from '$/sources/_runtime/live.remote.ts'
import type { GrpcRequest } from '$/sources/_shared/wire/Grpc/types.ts'

export const iterateGrpcLive = async function* ({
	binding,
	operationGroup,
	request,
	signal,
}: {
	binding: SourceBinding
	operationGroup: SourceOperationGroup
	request: GrpcRequest
	signal?: AbortSignal
}): AsyncGenerator<Uint8Array> {
	if (signal?.aborted)
		return

	const events = sourceLive({
		bindingId: sourceBindingId(binding),
		source: binding.source,
		targetKey: binding.target.key,
		operationGroup,
		grpc: {
			service: request.service,
			method: request.method,
			...(request.message != null && {
				messageBase64: globalThis.btoa(
					Array.from(
						request.message,
						(byte) => String.fromCharCode(byte)
					).join('')
				),
			}),
		},
	})[Symbol.asyncIterator]()
	const abort = () => {
		void events.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await events.next();
			!result.done;
			result = await events.next()
		) {
			if (signal?.aborted)
				return
			if (result.value.type !== 'grpc-message')
				throw new Error(`${binding.source}: managed gRPC received a non-gRPC live event`)

			yield Uint8Array.from(
				globalThis.atob(result.value.messageBase64),
				(character) => character.charCodeAt(0)
			)
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await events.return?.()
	}
}
