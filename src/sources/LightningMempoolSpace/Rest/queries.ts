import { getJson } from '$/lib/http.ts'
import LightningMempoolSpace from '$/sources/LightningMempoolSpace/index.ts'
import type {
	MempoolSpaceLightningChannel,
	MempoolSpaceLightningChannelSummary,
	MempoolSpaceLightningNode,
	MempoolSpaceLightningRankedNode,
	MempoolSpaceLightningSearchResult,
	MempoolSpaceLightningStatisticsResponse,
} from '$/sources/LightningMempoolSpace/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getLightningStatistics = ({
	restBaseUrl,
	interval = 'latest',
}: {
	restBaseUrl: string
	interval?: string
}) => (
	getJson<MempoolSpaceLightningStatisticsResponse>(
		`${base(restBaseUrl)}/statistics/${encodeURIComponent(interval)}`,
		{ origins: LightningMempoolSpace.origins  },
	)
)

export const getLightningNode = ({
	restBaseUrl,
	publicKey,
}: {
	restBaseUrl: string
	publicKey: string
}) => (
	getJson<MempoolSpaceLightningNode>(
		`${base(restBaseUrl)}/nodes/${encodeURIComponent(publicKey)}`,
		{ origins: LightningMempoolSpace.origins  },
	)
)

export const getLightningNodeChannels = ({
	restBaseUrl,
	publicKey,
	status = 'open',
	index = 0,
}: {
	restBaseUrl: string
	publicKey: string
	status?: 'open' | 'active' | 'closed'
	index?: number
}) => (
	getJson<MempoolSpaceLightningChannelSummary[]>(
		`${base(restBaseUrl)}/channels?public_key=${encodeURIComponent(publicKey)}&status=${status}&index=${index}`,
		{ origins: LightningMempoolSpace.origins  },
	)
)

export const getLightningChannel = ({
	restBaseUrl,
	channelId,
}: {
	restBaseUrl: string
	channelId: string
}) => (
	getJson<MempoolSpaceLightningChannel>(
		`${base(restBaseUrl)}/channels/${encodeURIComponent(channelId)}`,
		{ origins: LightningMempoolSpace.origins  },
	)
)

export const getTopLightningNodesByConnectivity = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<MempoolSpaceLightningRankedNode[]>(
		`${base(restBaseUrl)}/nodes/rankings/connectivity`,
		{ origins: LightningMempoolSpace.origins  },
	)
)

export const searchLightning = ({
	restBaseUrl,
	searchText,
}: {
	restBaseUrl: string
	searchText: string
}) => (
	getJson<MempoolSpaceLightningSearchResult>(
		`${base(restBaseUrl)}/search?searchText=${encodeURIComponent(searchText)}`,
		{ origins: LightningMempoolSpace.origins  },
	)
)
