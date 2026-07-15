import { corsFetch, throwIfHttpNotOk } from '$/lib/http.ts'

const base = (directoryUrl: string) => directoryUrl.replace(/\/$/, '')
const payjoinOrigins = [
	{
		origin: 'https://{payjoin-ohttp-relay-host}',
		corsEnabled: false,
	},
	{
		origin: 'https://{payjoin-receiver-host}',
		corsEnabled: false,
	},
	{
		origin: 'https://payjo.in',
		corsEnabled: false,
	},
	{
		origin: 'http://127.0.0.1:8080',
		corsEnabled: false,
	},
	{
		origin: 'http://localhost:8080',
		corsEnabled: false,
	},
] as const

export const ohttpGatewayUrlForDirectory = (directoryUrl: string) => (
	`${base(directoryUrl)}/.well-known/ohttp-gateway`
)

export const getOhttpKeyConfigBase64 = async ({
	directoryUrl,
}: {
	directoryUrl: string
}) => {
	const url = ohttpGatewayUrlForDirectory(directoryUrl)
	const response = await corsFetch(
		url,
		{
			origins: payjoinOrigins,
			init: {
				headers: {
					accept: 'application/ohttp-keys',
				},
			},
		}
	)
	await throwIfHttpNotOk(response, url)
	return Buffer.from(await response.arrayBuffer()).toString('base64')
}
