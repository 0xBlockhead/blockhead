import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	TransmissionRequest,
	TransmissionResponse,
} from '$/sources/Transmission/Rpc/types.ts'

const sessionHeader = 'x-transmission-session-id'

export const request = async (
	binding: SourceBinding,
	body: TransmissionRequest
) => {
	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(body),
	})

	const sessionId = response.headers.get(sessionHeader)
	const retryResponse = (
		response.status === 409 && sessionId != null ?
			await sourceFetch(binding, firstHttpUrlForBinding(binding), {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					[sessionHeader]: sessionId,
				},
				body: JSON.stringify(body),
			})
		:
			response
	)

	if (!retryResponse.ok)
		await throwHttpError(`Transmission ${body.method}`, retryResponse)

	return retryResponse.json<TransmissionResponse>()
}

export const torrentGet = (
	binding: SourceBinding,
	fields: readonly string[]
) => (
	request(binding, {
		method: 'torrent-get',
		arguments: {
			fields: [...fields],
		},
	})
)

export const sessionStats = (binding: SourceBinding) => (
	request(binding, {
		method: 'session-stats',
	})
)
