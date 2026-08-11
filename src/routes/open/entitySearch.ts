import { resolve } from '$app/paths'

import { NetworkExecutionModel, NetworkNamespace, networks } from '$/constants/Network.ts'
import { ipfsResourceAddressFromInput, ipfsResourceHref } from '$/lib/ipfs.ts'
import { swarmResourceHrefFromInput } from '$/lib/swarm.ts'


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

export const utxoTransactionNetworkChoices = networks.flatMap((network) => (
	[
		NetworkNamespace.Bitcoin,
		NetworkNamespace.BitcoinCash,
		NetworkNamespace.Cardano,
		NetworkNamespace.Dogecoin,
		NetworkNamespace.Elements,
		NetworkNamespace.Litecoin,
		NetworkNamespace.Zcash,
	].some((namespace) => namespace === network.namespace) ?
		[{
			name: network.name,
			environment: network.environment,
			network: 'caip2' in network ?
				`${network.caip2.namespace}:${network.caip2.reference}`
			:
				network.slug,
			identity: 'caip2' in network ?
				`${network.caip2.namespace}:${network.caip2.reference}`
			:
				`${network.namespace} catalog slug: ${network.slug}`,
		}]
	:
		[]
))

export const nostrHexEntityKinds = [
	{
		value: 'profile',
		label: 'Profile public key',
	},
	{
		value: 'note',
		label: 'Note event',
	},
	{
		value: 'article-version',
		label: 'Article version event',
	},
	{
		value: 'profile-metadata-version',
		label: 'Profile metadata event',
	},
	{
		value: 'reaction',
		label: 'Reaction event',
	},
	{
		value: 'repost',
		label: 'Repost event',
	},
] as const

export const entityHrefFromSearchInput = (query: string) => {
	const youtubeVideo = (
		query.match(/^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[/?#]|$)/i)
		?? query.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:shorts|embed)\/([a-zA-Z0-9_-]{11})(?:[/?#]|$)/i)
		?? query.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})(?:[&#]|$)/i)
	)

	if (youtubeVideo)
		return resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
			{
				videoId: youtubeVideo[1],
			}
		)

	const arweaveResource = query.match(/^ar:\/\/([a-zA-Z0-9_-]{43})\/([^?#]+)(?:[?#].*)?$/)

	if (arweaveResource)
		return resolve(
			'/(arweave)/arweave/resource/[transactionId=stringSegment]/[contentPath=stringSegment]',
			{
				transactionId: arweaveResource[1],
				contentPath: arweaveResource[2],
			}
		)

	if (/^did:plc:[a-z2-7]{24}$/.test(query))
		return resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
			{
				did: encodeURIComponent(query),
			}
		)

	if (/^(?:bzz|swarm):\/\//i.test(query))
		return swarmResourceHrefFromInput(query)

	const activityPubHandle = query.match(/^@([a-zA-Z0-9_.-]+)@((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/)

	if (activityPubHandle)
		return resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/@[acct=stringSegment]',
			{
				instanceOrigin: encodeURIComponent(`https://${activityPubHandle[2].toLowerCase()}`),
				acct: activityPubHandle[1],
			}
		)

	if (/^rad:z[1-9A-HJ-NP-Za-km-z]+$/.test(query))
		return resolve(
			'/radicle/repository/[rid=stringSegment]',
			{
				rid: query,
			}
		)

	if (/^at:\/\/[^/\s]+\/app\.bsky\.feed\.post\/[^/\s]+$/.test(query))
		return resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
			{
				uri: encodeURIComponent(query),
			}
		)

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

export const utxoTransactionHrefFromCoordinates = ({
	query,
	networkKey,
}: {
	query: string
	networkKey: string | null
}) => {
	const network = utxoTransactionNetworkChoices.find((candidate) => candidate.network === networkKey)

	if (!network || !/^[0-9a-fA-F]{64}$/.test(query)) return

	return resolve(
		'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
		{
			network: network.network,
			transactionId: query,
		}
	)
}

export const nostrHexHrefFromCoordinates = ({
	query,
	entityKind,
}: {
	query: string
	entityKind: string | null
}) => {
	if (!/^[0-9a-fA-F]{64}$/.test(query)) return

	if (entityKind === 'profile')
		return resolve(
			'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
			{
				pubkey: query,
			}
		)

	if (nostrHexEntityKinds.some((candidate) => candidate.value === entityKind))
		return resolve(
			`/(social)/(nostr)/nostr/(globalNostrNetwork)/${entityKind}/[eventId=stringSegment]`,
			{
				eventId: query,
			}
		)
}
