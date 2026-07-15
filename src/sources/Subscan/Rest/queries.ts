import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	SubscanBlock,
	SubscanExtrinsic,
	SubscanResponse,
} from '$/sources/Subscan/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const subscanPolkadotRestEndpoints = [
	{
		url: 'https://polkadot.api.subscan.io',
		transportType: TransportType.Http,
		providerName: 'Subscan',
	},
] as const

export const subscanOrigins = [
	{
		origin: 'https://polkadot.api.subscan.io',
		corsEnabled: false,
	},
] as const

const post = async <_Result>({
	restBaseUrl,
	path,
	body,
	publicEnv,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
	publicEnv: SourcePublicEnv
}) => {
	const response = await corsFetch(`${restBaseUrl.replace(/\/$/, '')}${path}`, {
		origins: subscanOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-API-Key': publicEnv.PUBLIC_SUBSCAN_API_KEY,
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError(`Subscan ${path}`, response)
	return response.json<SubscanResponse<_Result>>()
}

export const getBlock = ({
	restBaseUrl,
	height,
	publicEnv,
}: {
	restBaseUrl: string
	height: bigint
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanBlock>({
		restBaseUrl,
		path: '/api/scan/block',
		body: {
			block_num: Number(height),
		},
		publicEnv,
	})
)

export const getExtrinsic = ({
	restBaseUrl,
	extrinsicIndex,
	publicEnv,
}: {
	restBaseUrl: string
	extrinsicIndex: string
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanExtrinsic>({
		restBaseUrl,
		path: '/api/scan/extrinsic',
		body: {
			extrinsic_index: extrinsicIndex,
		},
		publicEnv,
	})
)
