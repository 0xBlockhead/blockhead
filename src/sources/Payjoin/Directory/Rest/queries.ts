import { throwIfHttpNotOk } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Payjoin/bindings.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

const payjoinDirectoryBinding = bindings[Source.PayjoinDirectory_Rest][0]

export const ohttpGatewayUrlForDirectory = (directoryUrl: string) => (
	`${directoryUrl.replace(/\/$/, '')}/.well-known/ohttp-gateway`
)

export const getOhttpKeyConfigBase64 = async (
	{
		directoryUrl,
	}: {
		directoryUrl: string
	}
) => {
	const url = ohttpGatewayUrlForDirectory(directoryUrl)
	const response = await sourceFetch(
		payjoinDirectoryBinding,
		url,
		{
			headers: {
				accept: 'application/ohttp-keys',
			},
		}
	)
	await throwIfHttpNotOk(response, url)
	return Buffer.from(await response.arrayBuffer()).toString('base64')
}
