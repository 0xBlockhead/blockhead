import { throwIfHttpNotOk } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Payjoin/bindings.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

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
		Object.fromEntries(bindings[Source.PayjoinDirectory_Rest].map((binding) => [binding.target.key, binding]))['directory'],
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
