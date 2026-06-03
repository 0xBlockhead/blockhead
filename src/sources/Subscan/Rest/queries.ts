import { corsFetch, throwHttpError } from '$/lib/http.ts'
import Subscan from '$/sources/Subscan/index.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	SubscanBlock,
	SubscanExtrinsic,
	SubscanResponse,
} from '$/sources/Subscan/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const post = async <_Result>({
	restBaseUrl,
	path,
	body,
	publicEnv,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
	publicEnv: SourcePublicEnvFor<Source.Subscan_Rest>
}) => {
	const response = await corsFetch(`${restBaseUrl.replace(/\/$/, '')}${path}`, {
		origins: Subscan.origins,
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
	publicEnv: SourcePublicEnvFor<Source.Subscan_Rest>
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
	publicEnv: SourcePublicEnvFor<Source.Subscan_Rest>
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
