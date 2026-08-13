import { resolve } from '$app/paths'

import { base58, bech32, hex } from '@scure/base'

import {
	NetworkExecutionModel,
	NetworkLedgerModel,
	NetworkResourceKind,
	networkResourceUrls,
	networks,
} from '$/constants/Network.ts'
import { ipfsResourceAddressFromInput, ipfsResourceHref } from '$/lib/ipfs.ts'
import { swarmResourceHrefFromInput } from '$/lib/swarm.ts'
import { parseFarcasterUrlIngress } from '$/routes/(social)/(farcaster)/farcaster/farcasterUrlIngress.ts'
import beaconchaInBindings from '$/sources/BeaconchaIn/bindings.ts'
import { Source } from '$/sources/Source.ts'


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
	network.ledgerModels.some((ledgerModel) => ledgerModel === NetworkLedgerModel.Utxo) ?
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

export const solanaTransactionNetworkChoices = networks.flatMap((network) => (
	network.executionModels.some((executionModel) => executionModel === NetworkExecutionModel.SolanaRuntime) ?
		[{
			name: network.name,
			environment: network.environment,
			network: 'caip2' in network ?
				`${network.caip2.namespace}:${network.caip2.reference}`
			:
				network.slug,
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

const evmExplorerNetworkByHost = Object.fromEntries(
	networkResourceUrls.flatMap((resource) => {
		const network = networks.find((candidate) => candidate.slug === resource.networkSlug)
		return (
			resource.kind === NetworkResourceKind.BlockExplorer
			&& network != null
			&& 'caip2' in network
			&& network.caip2.namespace === 'eip155' ?
				[[new URL(resource.url).hostname, `${network.caip2.namespace}:${network.caip2.reference}`]]
			:
				[]
		)
	})
)

const beaconchaInNetworkByHost = Object.fromEntries(
	beaconchaInBindings[Source.BeaconchaIn_Rest].flatMap((binding) => (
		binding.endpoints.map((endpoint) => [
			new URL(endpoint.locator).hostname,
			`eip155:${binding.target.key}`,
		])
	))
)

const evmErc20CoinInstanceHref = (
	networkCaip2: string,
	contractAddress: string
) => {
	const network = evmNetworkChoices.find((candidate) => candidate.caip2 === networkCaip2)
	if (network == null) return

	return resolve(
		'/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
		{
			chainId: network.reference,
			coinInstanceSlug: contractAddress.toLowerCase(),
		}
	)
}

const farcasterHrefFromSearchInput = (query: string) => {
	if (!/^https:\/\/(?:farcaster\.xyz|warpcast\.com)\//i.test(query)) return

	try {
		const ingress = parseFarcasterUrlIngress(query)

		if (ingress.kind === 'profile')
			return resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
				{
					userId: String(ingress.fid),
				}
			)

		if (ingress.kind === 'channel')
			return resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
				{
					channelId: ingress.channelId,
				}
			)

		if (ingress.username !== undefined)
			return resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
				{
					fname: ingress.username,
					hash: ingress.hashPrefix,
				}
			)
	} catch {
		return undefined
	}
}

export const entityHrefFromSearchInput = (query: string) => {
	const farcasterHref = farcasterHrefFromSearchInput(query)
	if (farcasterHref !== undefined) return farcasterHref

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

	const youtubePlaylist = query.match(/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?(?:[^#]*&)?list=([a-zA-Z0-9_-]+)(?:[&#]|$)/i)

	if (youtubePlaylist)
		return resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
			{
				playlistId: youtubePlaylist[1],
			}
		)

	const youtubeChannel = query.match(/^https?:\/\/(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)(?:[/?#]|$)/i)

	if (youtubeChannel)
		return resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
			{
				channelId: youtubeChannel[1],
			}
		)

	const xPost = query.match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]{1,15})\/status\/([0-9]+)(?:[/?#]|$)/i)

	if (xPost)
		return resolve(
			'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
			{
				postId: xPost[2],
			}
		)

	const xUser = query.match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]{1,15})\/?(?:[?#].*)?$/i)

	if (xUser)
		return resolve(
			'/x/user/@[username=stringSegment]',
			{
				username: xUser[1],
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

	const activityPubNote = query.match(/^https:\/\/((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})\/@[a-zA-Z0-9_.-]+\/([0-9]+)\/?(?:[?#].*)?$/)

	if (activityPubNote)
		return resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
			{
				instanceOrigin: encodeURIComponent(`https://${activityPubNote[1].toLowerCase()}`),
				localStatusId: activityPubNote[2],
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

	const bskyPost = query.match(/^https:\/\/bsky\.app\/profile\/((?:did:plc:[a-z2-7]{24}|[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+))\/post\/([^/?#\s]+)(?:[?#].*)?$/i)

	if (bskyPost)
		return resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
			{
				uri: encodeURIComponent(`at://${bskyPost[1].toLowerCase()}/app.bsky.feed.post/${bskyPost[2]}`),
			}
		)

	const bskyDidProfile = query.match(/^https:\/\/bsky\.app\/profile\/(did:plc:[a-z2-7]{24})\/?(?:[?#].*)?$/i)

	if (bskyDidProfile)
		return resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
			{
				did: encodeURIComponent(bskyDidProfile[1].toLowerCase()),
			}
		)

	const bskyHandleProfile = query.match(/^https:\/\/bsky\.app\/profile\/([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)\/?(?:[?#].*)?$/i)

	if (bskyHandleProfile)
		return resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]',
			{
				handle: bskyHandleProfile[1].toLowerCase(),
			}
		)

	const redditLink = query.match(/^https:\/\/(?:www\.)?reddit\.com\/r\/[a-z0-9_]{3,21}\/comments\/([a-z0-9]+)(?:\/[^?#\s]*)?(?:[?#].*)?$/i)

	if (redditLink)
		return resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
			{
				fullname: `t3_${redditLink[1].toLowerCase()}`,
			}
		)

	const redditSubreddit = query.match(/^https:\/\/(?:www\.)?reddit\.com\/r\/([a-z0-9_]{3,21})\/?(?:[?#].*)?$/i)

	if (redditSubreddit)
		return resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
			{
				name: redditSubreddit[1].toLowerCase(),
			}
		)

	const gitlabResource = query.match(/^https:\/\/gitlab\.com\/(.+)\/([^/?#\s]+?)(?:\.git)?\/-\/(issues|merge_requests|releases)\/([^/?#\s]+)\/?(?:[?#].*)?$/i)

	if (
		gitlabResource
		&& (
			gitlabResource[3] === 'releases'
			|| /^[0-9]+$/.test(gitlabResource[4])
		)
	)
		return resolve(
			gitlabResource[3] === 'issues' ?
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]'
			: gitlabResource[3] === 'merge_requests' ?
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]'
			:
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]',
			gitlabResource[3] === 'issues' ?
				{
					forgeHost: 'gitlab.com',
					owner: encodeURIComponent(gitlabResource[1]),
					repositoryName: gitlabResource[2],
					issueNumber: gitlabResource[4],
				}
			: gitlabResource[3] === 'merge_requests' ?
				{
					forgeHost: 'gitlab.com',
					owner: encodeURIComponent(gitlabResource[1]),
					repositoryName: gitlabResource[2],
					pullRequestNumber: gitlabResource[4],
				}
			:
				{
					forgeHost: 'gitlab.com',
					owner: encodeURIComponent(gitlabResource[1]),
					repositoryName: gitlabResource[2],
					releaseTagName: gitlabResource[4],
				}
		)

	const gitlabRepository = query.match(/^https:\/\/gitlab\.com\/(.+)\/([^/?#\s]+?)(?:\.git)?\/?(?:[?#].*)?$/i)

	if (gitlabRepository && !gitlabRepository[1].includes('/-/'))
		return resolve(
			'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]',
			{
				forgeHost: 'gitlab.com',
				owner: encodeURIComponent(gitlabRepository[1]),
				repositoryName: gitlabRepository[2],
			}
		)

	const githubResource = query.match(/^https:\/\/(?:www\.)?github\.com\/([^/?#\s]+)\/([^/?#\s]+?)(?:\.git)?\/(issues|pull|releases\/tag)\/([^/?#\s]+)\/?(?:[?#].*)?$/i)

	if (
		githubResource
		&& (
			githubResource[3] === 'releases/tag'
			|| /^[0-9]+$/.test(githubResource[4])
		)
	)
		return resolve(
			githubResource[3] === 'issues' ?
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]'
			: githubResource[3] === 'pull' ?
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]'
			:
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]',
			githubResource[3] === 'issues' ?
				{
					forgeHost: 'github.com',
					owner: githubResource[1],
					repositoryName: githubResource[2],
					issueNumber: githubResource[4],
				}
			: githubResource[3] === 'pull' ?
				{
					forgeHost: 'github.com',
					owner: githubResource[1],
					repositoryName: githubResource[2],
					pullRequestNumber: githubResource[4],
				}
			:
				{
					forgeHost: 'github.com',
					owner: githubResource[1],
					repositoryName: githubResource[2],
					releaseTagName: githubResource[4],
				}
		)

	const githubRepository = query.match(/^https:\/\/(?:www\.)?github\.com\/([^/?#\s]+)\/([^/?#\s]+?)(?:\.git)?\/?(?:[?#].*)?$/i)

	if (githubRepository)
		return resolve(
			'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]',
			{
				forgeHost: 'github.com',
				owner: githubRepository[1],
				repositoryName: githubRepository[2],
			}
		)

	const snapshotProposal = query.match(/^https:\/\/snapshot\.(?:org|box)\/#\/(?:s:)?[^/?#\s]+\/proposal\/(0x[a-f0-9]{64})\/?(?:[?&].*)?$/i)

	if (snapshotProposal)
		return resolve(
			'/~/snapshot/proposal/[proposalId=stringSegment]',
			{
				proposalId: snapshotProposal[1].toLowerCase(),
			}
		)

	const tallyProposal = query.match(/^https:\/\/(?:www\.)?tally\.xyz\/gov\/[^/?#\s]+\/proposal\/([0-9]+)\/?(?:[?#].*)?$/i)

	if (tallyProposal)
		return resolve(
			'/~/tally/proposal/[proposalId=stringSegment]',
			{
				proposalId: tallyProposal[1],
			}
		)

	const caip19Erc20Asset = query.match(/^eip155:([0-9]+)\/erc20:(0x[a-fA-F0-9]{40})$/)

	if (caip19Erc20Asset)
		return evmErc20CoinInstanceHref(
			`eip155:${caip19Erc20Asset[1]}`,
			caip19Erc20Asset[2]
		)

	const mempoolSpaceResource = query.match(/^https:\/\/(?:www\.)?mempool\.space\/(?:(testnet)\/)?(tx|block|address)\/([^/?#\s]+)\/?(?:[?#].*)?$/i)

	if (mempoolSpaceResource) {
		const network = `bip122:${mempoolSpaceResource[1] == null ? '000000000019d6689c085ae165831e93' : '000000000933ea01ad0ee984209779ba'}`
		if (mempoolSpaceResource[2] === 'tx' && /^[a-f0-9]{64}$/i.test(mempoolSpaceResource[3]))
			return resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network,
					transactionId: mempoolSpaceResource[3].toLowerCase(),
				}
			)

		if (mempoolSpaceResource[2] === 'block' && /^[a-f0-9]{64}$/i.test(mempoolSpaceResource[3]))
			return resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
				{
					network,
					blockHash: mempoolSpaceResource[3].toLowerCase(),
				}
			)

		if (
			mempoolSpaceResource[2] === 'address'
			&& /^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,61}|(?:bc|tb)1[ac-hj-np-z02-9]{11,71})$/i.test(mempoolSpaceResource[3])
		)
			return resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]',
				{
					network,
					address: mempoolSpaceResource[3],
				}
			)
	}

	const mempoolSpaceLightningResource = query.match(/^https:\/\/(?:www\.)?mempool\.space\/lightning\/(node|channel)\/([^/?#\s]+)\/?(?:[?#].*)?$/i)

	if (
		mempoolSpaceLightningResource?.[1] === 'node'
		&& /^(?:02|03)[a-f0-9]{64}$/i.test(mempoolSpaceLightningResource[2])
	)
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]',
			{
				network: 'bip122:000000000019d6689c085ae165831e93',
				pubkey: mempoolSpaceLightningResource[2].toLowerCase(),
			}
		)

	if (
		mempoolSpaceLightningResource?.[1] === 'channel'
		&& /^(?:0|[1-9][0-9]*)$/.test(mempoolSpaceLightningResource[2])
	)
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
			{
				network: 'bip122:000000000019d6689c085ae165831e93',
				channelId: mempoolSpaceLightningResource[2],
			}
		)

	const beaconchaInResource = query.match(/^https:\/\/([^/?#\s]+)\/(validator|epoch|slot)\/([0-9]+)\/?(?:[?#].*)?$/i)

	if (beaconchaInResource && beaconchaInNetworkByHost[beaconchaInResource[1].toLowerCase()] != null)
		return (
			beaconchaInResource[2] === 'validator' ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]',
					{
						network: beaconchaInNetworkByHost[beaconchaInResource[1].toLowerCase()],
						validatorId: beaconchaInResource[3],
					}
				)
			: beaconchaInResource[2] === 'epoch' ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
					{
						network: beaconchaInNetworkByHost[beaconchaInResource[1].toLowerCase()],
						epoch: beaconchaInResource[3],
					}
				)
			:
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
					{
						network: beaconchaInNetworkByHost[beaconchaInResource[1].toLowerCase()],
						slot: beaconchaInResource[3],
					}
				)
		)

	const evmExplorerTransaction = query.match(/^https:\/\/([^/?#\s]+)\/tx\/(0x[a-f0-9]{64})\/?(?:[?#].*)?$/i)

	if (evmExplorerTransaction && evmExplorerNetworkByHost[evmExplorerTransaction[1].toLowerCase()] != null)
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
			{
				network: evmExplorerNetworkByHost[evmExplorerTransaction[1].toLowerCase()],
				transactionId: evmExplorerTransaction[2].toLowerCase(),
			}
		)

	const evmExplorerAddress = query.match(/^https:\/\/([^/?#\s]+)\/address\/(0x[a-f0-9]{40})\/?(?:[?#].*)?$/i)

	if (evmExplorerAddress && evmExplorerNetworkByHost[evmExplorerAddress[1].toLowerCase()] != null)
		return resolve(
			'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
			{
				namespace: 'eip155',
				reference: evmExplorerNetworkByHost[evmExplorerAddress[1].toLowerCase()].slice('eip155:'.length),
				accountAddress: evmExplorerAddress[2],
			}
		)

	const evmExplorerToken = query.match(/^https:\/\/([^/?#\s]+)\/token\/(0x[a-f0-9]{40})\/?(?:[?#].*)?$/i)

	if (evmExplorerToken && evmExplorerNetworkByHost[evmExplorerToken[1].toLowerCase()] != null)
		return resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
			{
				network: evmExplorerNetworkByHost[evmExplorerToken[1].toLowerCase()],
				address: evmExplorerToken[2],
			}
		)

	const evmExplorerBlock = query.match(/^https:\/\/([^/?#\s]+)\/block\/([0-9]+|0x[a-f0-9]{64})\/?(?:[?#].*)?$/i)

	if (evmExplorerBlock && evmExplorerNetworkByHost[evmExplorerBlock[1].toLowerCase()] != null)
		return resolve(
			evmExplorerBlock[2].startsWith('0x') ?
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]'
			:
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
			evmExplorerBlock[2].startsWith('0x') ?
				{
					network: evmExplorerNetworkByHost[evmExplorerBlock[1].toLowerCase()],
					blockHash: evmExplorerBlock[2].toLowerCase(),
				}
			:
				{
					network: evmExplorerNetworkByHost[evmExplorerBlock[1].toLowerCase()],
					blockNumber: evmExplorerBlock[2],
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

	try {
		if (
			base58.decode(query).length === 64
			&& solanaTransactionNetworkChoices.length === 1
		)
			return resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: solanaTransactionNetworkChoices[0].network,
					transactionId: query,
				}
			)
	} catch {}

	try {
		const nostrIdentifier = bech32.decode(
			query.replace(/^nostr:/i, ''),
			false
		)

		if (
			['npub', 'note'].some((prefix) => prefix === nostrIdentifier.prefix)
			&& bech32.fromWords(nostrIdentifier.words).length === 32
		)
			return resolve(
				nostrIdentifier.prefix === 'npub' ?
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]'
				:
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
				nostrIdentifier.prefix === 'npub' ?
					{
						pubkey: hex.encode(bech32.fromWords(nostrIdentifier.words)),
					}
				:
					{
						eventId: hex.encode(bech32.fromWords(nostrIdentifier.words)),
					}
			)
	} catch {}

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
