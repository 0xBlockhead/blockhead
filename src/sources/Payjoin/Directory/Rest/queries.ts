import { corsFetch, throwIfHttpNotOk } from '$/lib/http.ts'
import { payjoinOrigins } from '$/sources/Payjoin/index.ts'

const base = (directoryUrl: string) => directoryUrl.replace(/\/$/, '')

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
