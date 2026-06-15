import { type Provider, HttpProvider, WebSocketProvider } from '@tevm/voltaire/provider'

const httpProviderByUrl = new Map<string, Provider>()
const websocketProviderByUrl = new Map<string, Provider>()

export const getHttpProvider = (url: string): Provider => {
	let provider = httpProviderByUrl.get(url)
	if (provider == null) {
		provider = new HttpProvider(url)
		httpProviderByUrl.set(url, provider)
	}
	return provider
}

export const getWebsocketProvider = (url: string): Provider => {
	let provider = websocketProviderByUrl.get(url)
	if (provider == null) {
		provider = new WebSocketProvider(url)
		websocketProviderByUrl.set(url, provider)
	}
	return provider
}
