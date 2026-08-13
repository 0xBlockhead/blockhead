import { throwIfHttpNotOk } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Payjoin/bindings.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

export const ohttpGatewayUrlForDirectory = (directoryUrl: string) => {
	const directory = new URL(directoryUrl)
	if (
		directory.protocol !== 'https:'
		|| directory.href !== `${directory.origin}/`
		|| directory.username !== ''
		|| directory.password !== ''
		|| !bindings[Source.PayjoinDirectory_Rest].some((binding) => (
			binding.endpoints.some((endpoint) => endpoint.locator === directory.origin)
		))
	)
		throw new Error('PayjoinDirectory_Rest: directory URL must be a registered public HTTPS origin')

	return new URL('/.well-known/ohttp-gateway', directory).href
}

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
			redirect: 'manual',
		}
	)
	await throwIfHttpNotOk(response, url)
	return globalThis.btoa(
		String.fromCharCode(...new Uint8Array(await response.arrayBuffer()))
	)
}
