import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/EnsMetadataService/bindings.ts'
import type { paths } from '$/sources/EnsMetadataService/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

export const getEnsNftMetadata = (
	{
		networkName,
		contractAddress,
		tokenId,
	}: paths['/{networkName}/{contractAddress(0x[a-fA-F0-9]{40})}/{tokenId}']['get']['parameters']['path']
) => (
	getJson<paths['/{networkName}/{contractAddress(0x[a-fA-F0-9]{40})}/{tokenId}']['get']['responses'][200]['content']['application/json']>(
		bindings[Source.EnsMetadataService],
		`/${networkName}/${encodeURIComponent(contractAddress)}/${encodeURIComponent(tokenId)}`
	)
)

export const getAvatarMetadata = (
	{
		networkName,
		name,
	}: paths['/{networkName}/avatar/{name}/meta']['get']['parameters']['path']
) => (
	getJson<paths['/{networkName}/avatar/{name}/meta']['get']['responses'][200]['content']['application/json']>(
		bindings[Source.EnsMetadataService],
		`/${networkName}/avatar/${encodeURIComponent(name)}/meta`
	)
)
