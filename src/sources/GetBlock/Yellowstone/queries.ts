import {
	SourceOperationGroup,
} from '$/sources/SourceBinding.ts'
import { iterateGrpcLive } from '$/sources/_shared/wire/Grpc/live.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/GetBlock/bindings.ts'
import type {
	GetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/types.ts'
import {
	decodeGetBlockYellowstoneSubscribeUpdate,
	encodeGetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/protobuf.ts'

export const subscribeSolanaAccountUpdates = async function* (
	accountRequest: GetBlockYellowstoneAccountRequest,
	signal?: AbortSignal
) {
	for await (const message of iterateGrpcLive({
		binding: bindings[Source.GetBlockYellowstone_Grpc][0],
		operationGroup: SourceOperationGroup.GenericSubscribe,
		request: {
			service: 'geyser.Geyser',
			method: 'Subscribe',
			message: encodeGetBlockYellowstoneAccountRequest(accountRequest),
		},
		signal,
	})) {
		const update = decodeGetBlockYellowstoneSubscribeUpdate(message)
		if (update.kind === 'account')
			yield update.update
	}
}
