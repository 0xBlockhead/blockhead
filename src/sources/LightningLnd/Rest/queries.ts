import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import LightningLnd from '$/sources/LightningLnd/index.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type {
	LndGetInfoResponse,
	LndListChannelsResponse,
	LndListInvoicesResponse,
	LndListPaymentsResponse,
} from '$/sources/LightningLnd/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

const lndHeaders = (macaroonHex: string) => ({
	'Grpc-Metadata-macaroon': macaroonHex,
})

export const getInfo = (
	publicEnv: SourcePublicEnvFor<Source.LightningLnd_Rest>
) => (
	getJson<LndGetInfoResponse>(
		`${base(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_REST_BASE_URL'))}/v1/getinfo`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listChannels = (
	publicEnv: SourcePublicEnvFor<Source.LightningLnd_Rest>
) => (
	getJson<LndListChannelsResponse>(
		`${base(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_REST_BASE_URL'))}/v1/channels`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listInvoices = ({
	publicEnv,
	numMaxInvoices,
}: {
	publicEnv: SourcePublicEnvFor<Source.LightningLnd_Rest>
	numMaxInvoices?: number
}) => (
	getJson<LndListInvoicesResponse>(
		`${base(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_REST_BASE_URL'))}/v1/invoices${numMaxInvoices == null ? '' : `?num_max_invoices=${numMaxInvoices}`}`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listPayments = ({
	publicEnv,
	maxPayments,
}: {
	publicEnv: SourcePublicEnvFor<Source.LightningLnd_Rest>
	maxPayments?: number
}) => (
	getJson<LndListPaymentsResponse>(
		`${base(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_REST_BASE_URL'))}/v1/payments${maxPayments == null ? '' : `?max_payments=${maxPayments}`}`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)
