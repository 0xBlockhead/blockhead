import type { ClientContext } from '$/client/$client.svelte.ts'
import type {
	schema,
} from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'


export type AppClient = ClientContext<typeof schema, Source>

let appClient: AppClient | undefined

export const registerAppClient = (client: AppClient) => {
	appClient = client
	return client
}

export const unregisterAppClient = (client: AppClient) => {
	if (appClient === client)
		appClient = undefined
}

export const getAppClient = () => {
	if (appClient == null)
		throw new Error('App client was read before bootstrap completed')

	return appClient
}
