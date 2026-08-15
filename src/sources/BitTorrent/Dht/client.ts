import { createSocket } from 'node:dgram'

export type DhtRemote = {
	host: string
	port: number
}

export type DhtSocket = {
	send: (bytes: Uint8Array, remote: DhtRemote) => void
	onMessage: (listener: (bytes: Uint8Array) => void) => void
	onError: (listener: (error: Error) => void) => void
	close: () => void
}

export const createDhtSocket = (): DhtSocket => {
	const socket = createSocket('udp4')
	const messageListeners = new Set<(bytes: Uint8Array) => void>()
	const errorListeners = new Set<(error: Error) => void>()
	socket.on('message', (message) => {
		for (const listener of messageListeners)
			listener(message)
	})
	socket.on('error', (error) => {
		for (const listener of errorListeners)
			listener(error)
	})
	return {
		send: (bytes, remote) => {
			socket.send(bytes, remote.port, remote.host)
		},
		onMessage: (listener) => {
			messageListeners.add(listener)
		},
		onError: (listener) => {
			errorListeners.add(listener)
		},
		close: () => {
			socket.close()
		},
	}
}
