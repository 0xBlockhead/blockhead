import {
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { iterateGrpcLive } from '$/sources/_shared/wire/Grpc/live.ts'
import type {
	GetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/types.ts'
import {
	decodeGetBlockYellowstoneSubscribeUpdate,
	encodeGetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/protobuf.ts'

export const subscribeSolanaAccountUpdates = async function* (
	binding: SourceBinding,
	accountRequest: GetBlockYellowstoneAccountRequest,
	signal?: AbortSignal
) {
	for await (const message of iterateGrpcLive({
		binding,
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
