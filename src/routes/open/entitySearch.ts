import { resolve } from '$app/paths'

import { NetworkExecutionModel, networks } from '$/constants/Network.ts'
import { ipfsResourceAddressFromInput, ipfsResourceHref } from '$/lib/ipfs.ts'


export const evmNetworkChoices = networks.flatMap((network) => (
	'caip2' in network
	&& network.executionModels.some((executionModel) => executionModel === NetworkExecutionModel.Evm) ?
		[{
			name: network.name,
			environment: network.environment,
			caip2: `${network.caip2.namespace}:${network.caip2.reference}`,
			namespace: network.caip2.namespace,
			reference: network.caip2.reference,
		}]
	:
		[]
))

export const evmHashEntityKinds = [
	{
		value: 'transaction',
		label: 'Transaction',
	},
	{
		value: 'user-operation',
		label: 'ERC-4337 user operation',
	},
] as const

export const evmAddressEntityKinds = [
	{
		value: 'account',
		label: 'Account',
	},
	{
		value: 'contract',
		label: 'Contract',
	},
] as const

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
		evmNetworkChoices.map((network) => ({
			...network,
			accountAddress: query,
		}))
)

export const evmAddressHrefFromCoordinates = ({
	query,
	networkCaip2,
	entityKind,
}: {
	query: string
	networkCaip2: string | null
	entityKind: string | null
}) => {
	const network = evmNetworkChoices.find((candidate) => candidate.caip2 === networkCaip2)

	if (!network || !/^0x[a-fA-F0-9]{40}$/.test(query)) return

	if (entityKind === 'account')
		return resolve(
			'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
			{
				namespace: network.namespace,
				reference: network.reference,
				accountAddress: query,
			}
		)

	if (entityKind === 'contract')
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
			{
				network: network.caip2,
				address: query,
			}
		)
}

export const evmHashHrefFromCoordinates = ({
	query,
	networkCaip2,
	entityKind,
}: {
	query: string
	networkCaip2: string | null
	entityKind: string | null
}) => {
	const network = evmNetworkChoices.find((candidate) => candidate.caip2 === networkCaip2)

	if (!network || !/^0x[a-fA-F0-9]{64}$/.test(query)) return

	if (entityKind === 'transaction')
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
			{
				network: network.caip2,
				transactionId: query,
			}
		)

	if (entityKind === 'user-operation')
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
			{
				network: network.caip2,
				userOperationHash: query,
			}
		)
}
