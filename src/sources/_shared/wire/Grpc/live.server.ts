import {
	connect,
	constants,
	type ClientHttp2Session,
	type ClientHttp2Stream,
	type IncomingHttpHeaders,
} from 'node:http2'

import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	WireProtocol,
	type SourceBinding,
	type SourceServerCredentialDefinition,
} from '$/sources/SourceBinding.ts'
import type { GrpcRequest } from '$/sources/_shared/wire/Grpc/types.ts'

export type GrpcLiveEvent = {
	type: 'grpc-message'
	source: string
	targetKey: string
	messageBase64: string
}

const frameGrpcMessage = (message: Uint8Array): Uint8Array => {
	const frame = new Uint8Array(message.length + 5)
	new DataView(frame.buffer).setUint32(1, message.length)
	frame.set(message, 5)
	return frame
}

const parseGrpcFrames = (
	buffer: Uint8Array
): {
	messages: Uint8Array[]
	remainder: Uint8Array
} => {
	const messages: Uint8Array[] = []
	let offset = 0
	while (buffer.length - offset >= 5) {
		if (buffer[offset] !== 0)
			throw new Error('Managed gRPC returned a compressed message')
		const length = new DataView(
			buffer.buffer,
			buffer.byteOffset + offset + 1,
			4
		).getUint32(0)
		if (buffer.length - offset - 5 < length)
			break
		messages.push(buffer.slice(offset + 5, offset + 5 + length))
		offset += 5 + length
	}
	return {
		messages,
		remainder: buffer.slice(offset),
	}
}

const grpcStatusError = (headers: IncomingHttpHeaders): Error | undefined => {
	const status = headers['grpc-status']
	if (status == null || status === '0')
		return
	return new Error(
		`gRPC ${status}: ${decodeURIComponent(String(headers['grpc-message'] ?? 'request failed'))}`
	)
}

const streamChunks = (
	stream: ClientHttp2Stream
): ReadableStream<Uint8Array> => new ReadableStream({
	start(controller) {
		stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
		stream.once('end', () => controller.close())
		stream.once('error', (error) => controller.error(error))
	},
	cancel() {
		stream.close(constants.NGHTTP2_CANCEL)
	},
})

const closeGrpcStream = (
	stream: ClientHttp2Stream,
	session: ClientHttp2Session
) => {
	if (!stream.closed)
		stream.close(constants.NGHTTP2_CANCEL)
	if (!session.closed)
		session.destroy()
}

export const iterateManagedGrpcLive = async function* ({
	binding,
	request,
	serverCredential,
	signal,
}: {
	binding: SourceBinding
	request: GrpcRequest
	serverCredential?: SourceServerCredentialDefinition
	signal?: AbortSignal
}): AsyncGenerator<GrpcLiveEvent> {
	if (
		binding.wireProtocol !== WireProtocol.Grpc
		|| binding.apiFamily !== ApiFamily.GrpcService
		|| binding.delivery !== SourceDelivery.RemoteLive
	)
		throw new Error(`${binding.source}: managed gRPC stream requires Grpc / GrpcService / RemoteLive`)

	const endpoint = binding.endpoints.find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.HttpUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: managed gRPC stream requires an HTTP/2 URL`)

	if (
		binding.credentials.some((credential) => credential.scope === SourceCredentialScope.RuntimeSecret)
		&& serverCredential == null
	)
		throw new Error(`${binding.source}: missing server credential definition`)

	const secret = serverCredential == null ? undefined : process.env[serverCredential.envKey]?.trim()
	if (serverCredential != null && (secret == null || secret === ''))
		throw new Error(`${binding.source}: missing runtime credential ${serverCredential.envKey}`)

	let locator = endpoint.locator
	if (serverCredential?.injection.endpointTemplate != null) {
		const placeholder = `{${serverCredential.injection.endpointTemplate.slot}}`
		if (!locator.includes(placeholder))
			throw new Error(`${binding.source}: endpoint lacks runtime credential placeholder ${placeholder}`)
		locator = locator.replaceAll(placeholder, encodeURIComponent(secret))
	}
	if (locator.includes('{'))
		throw new Error(`${binding.source}: unresolved endpoint template`)

	const url = new URL(locator)
	if (serverCredential?.injection.query != null)
		url.searchParams.set(serverCredential.injection.query.name, secret)
	const session = connect(url.origin)
	const stream = session.request({
		':method': 'POST',
		':path': `${url.pathname.replace(/\/$/, '')}/${request.service}/${request.method}${url.search}`,
		'content-type': 'application/grpc',
		te: 'trailers',
		...(serverCredential?.injection.header != null && {
			[serverCredential.injection.header.name]: `${serverCredential.injection.header.prefix ?? ''}${secret}`,
		}),
	})
	let responseHeaders: IncomingHttpHeaders | undefined
	let trailers: IncomingHttpHeaders = {}
	stream.once('response', (headers) => {
		responseHeaders = headers
	})
	stream.once('trailers', (headers) => {
		trailers = headers
	})
	const abort = () => closeGrpcStream(stream, session)
	signal?.addEventListener('abort', abort, { once: true })

	try {
		if (signal?.aborted)
			return
		stream.write(frameGrpcMessage(request.message ?? new Uint8Array()))

		let remainder = new Uint8Array()
		const reader = streamChunks(stream).getReader()
		for (
			let result = await reader.read();
			!result.done;
			result = await reader.read()
		) {
			const buffer = new Uint8Array(remainder.length + result.value.length)
			buffer.set(remainder)
			buffer.set(result.value, remainder.length)
			const parsed = parseGrpcFrames(buffer)
			remainder = parsed.remainder
			for (const message of parsed.messages)
				yield {
					type: 'grpc-message',
					source: binding.source,
					targetKey: binding.target.key,
					messageBase64: Buffer.from(message).toString('base64'),
				}
		}
		if (remainder.length !== 0)
			throw new Error(`${binding.source}: truncated gRPC response frame`)
		if (signal?.aborted)
			return
		if (
			responseHeaders == null
			|| responseHeaders[':status'] !== 200
			|| !String(responseHeaders['content-type'] ?? '').startsWith('application/grpc')
		)
			throw new Error(`${binding.source}: gRPC endpoint rejected the stream`)
		const statusHeaders = trailers['grpc-status'] == null ? responseHeaders : trailers
		if (statusHeaders['grpc-status'] == null)
			throw new Error(`${binding.source}: gRPC response lacks final status`)
		const error = grpcStatusError(statusHeaders)
		if (error != null)
			throw error
	} finally {
		signal?.removeEventListener('abort', abort)
		closeGrpcStream(stream, session)
	}
}
