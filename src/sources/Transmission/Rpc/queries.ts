import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Transmission/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	TransmissionRequest,
} from '$/sources/Transmission/Rpc/types.ts'
import {
	transmissionSessionResponseWire,
	transmissionSessionStatsResponseWire,
	transmissionTorrentsResponseWire,
} from '$/sources/Transmission/Rpc/types.ts'

const binding = bindings[Source.TransmissionRpc_JsonRpc][0]

const sessionHeader = 'x-transmission-session-id'

const request = async <_Arguments>(
	binding: SourceBinding,
	body: TransmissionRequest,
	responseWire: { assert: (value: unknown) => {
		result: string
		arguments?: _Arguments
	} }
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

	let transmissionResponse
	try {
		transmissionResponse = responseWire.assert(await retryResponse.json())
	} catch {
		throw new Error(`Transmission_Rpc: invalid ${body.method} response envelope`)
	}
	if (transmissionResponse.result !== 'success')
		throw new Error(`Transmission_Rpc: ${body.method} failed: ${transmissionResponse.result}`)
	if (transmissionResponse.arguments == null)
		throw new Error(`Transmission_Rpc: ${body.method} response missing arguments`)

	return transmissionResponse.arguments
}

export const torrentGet = (
	fields: readonly string[]
) => (
	request(binding, {
		method: 'torrent-get',
		arguments: {
			fields: [...fields],
		},
	}, transmissionTorrentsResponseWire)
)

export const sessionStats = () => (
	request(binding, {
		method: 'session-stats',
	}, transmissionSessionStatsResponseWire)
)

export const sessionGet = () => (
	request(binding, {
		method: 'session-get',
	}, transmissionSessionResponseWire)
)
