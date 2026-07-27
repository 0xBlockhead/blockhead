import {
	SourceOperationGroup,
} from '$/sources/SourceBinding.ts'
import { iterateGrpcLive } from '$/sources/_shared/wire/Grpc/live.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/GetBlock/bindings.ts'
import type {
	GetBlockYellowstoneAccountRequest,
	GetBlockYellowstoneAccountUpdate,
} from '$/sources/GetBlock/Yellowstone/types.ts'
import {
	decodeGetBlockYellowstoneAccountUpdate,
	encodeGetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/protobuf.ts'

const binding = bindings[Source.GetBlockYellowstone_Grpc]

export const subscribeSolanaAccountUpdates = async function* (
	accountRequest: GetBlockYellowstoneAccountRequest,
	signal?: AbortSignal
): AsyncGenerator<GetBlockYellowstoneAccountUpdate> {
	for await (const message of iterateGrpcLive({
		binding,
		operationGroup: SourceOperationGroup.GenericSubscribe,
		request: {
			service: 'geyser.Geyser',
			method: 'Subscribe',
			message: encodeGetBlockYellowstoneAccountRequest(accountRequest),
		},
		signal,
	}))
		yield decodeGetBlockYellowstoneAccountUpdate(message)
}
