import { type Provider, HttpProvider, WebSocketProvider } from '@tevm/voltaire/provider'

const httpByUrl = new Map<string, Provider>()
const wsByUrl = new Map<string, Provider>()

export const getHttpProvider = (url: string): Provider => {
	let p = httpByUrl.get(url)
	if (p == null) {
		p = new HttpProvider(url)
		httpByUrl.set(url, p)
	}
	return p
}

export const getWebsocketProvider = (url: string): Provider => {
	let p = wsByUrl.get(url)
	if (p == null) {
		p = new WebSocketProvider(url)
		wsByUrl.set(url, p)
	}
	return p
}
