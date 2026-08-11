import { resolve } from '$app/paths'

import { NetworkExecutionModel, networks } from '$/constants/Network.ts'
import { ipfsResourceAddressFromInput, ipfsResourceHref } from '$/lib/ipfs.ts'


export const entityHrefFromSearchInput = (query: string) => {
	if (/^ip(?:fs|ns):\/\//i.test(query)) {
		const ipfsResourceAddress = ipfsResourceAddressFromInput({
			targetInput: query,
		})

		if (ipfsResourceAddress)
			return ipfsResourceHref(ipfsResourceAddress)
	}

	if (/^magnet:\?/i.test(query))
		return resolve(
			'/magnet/[magnetUri=stringSegment]',
			{
				magnetUri: encodeURIComponent(query),
			}
		)

	if (/^https?:\/\//i.test(query))
		return resolve(
			'/(explore)/url/[url=absoluteUrl]',
			{
				url: encodeURIComponent(query),
			}
		)

	const accountIdentifier = query.match(/^([a-z0-9-]{3,8}):([-_a-zA-Z0-9]{1,32}):([-%.a-zA-Z0-9]{1,128})$/)
	const networkIdentifier = query.match(/^([a-z0-9-]{3,8}):([-_a-zA-Z0-9]{1,32})$/)

	if (accountIdentifier)
		return resolve(
			'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
			{
				namespace: accountIdentifier[1],
				reference: accountIdentifier[2],
				accountAddress: accountIdentifier[3],
			}
		)

	if (networkIdentifier)
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
			{
				network: query,
			}
		)

	if (/^[^\s]+\.eth$/i.test(query))
		return resolve(
			'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
			{
				ensName: query,
			}
		)
}

export const evmAccountCandidatesFromSearchInput = (query: string) => (
	!/^0x[a-fA-F0-9]{40}$/.test(query) ?
		[]
	:
		networks.flatMap((network) => (
			'caip2' in network
			&& network.executionModels.some((executionModel) => executionModel === NetworkExecutionModel.Evm) ?
				[{
					name: network.name,
					caip2: `${network.caip2.namespace}:${network.caip2.reference}`,
					namespace: network.caip2.namespace,
					reference: network.caip2.reference,
					accountAddress: query,
				}]
			:
				[]
		))
)
