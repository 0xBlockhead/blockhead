import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import { lightningLndOrigins } from '$/sources/LightningLnd/index.ts'
import { lightningLndBindings } from '$/sources/LightningLnd/bindings.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	LndGetInfoResponse,
	LndListChannelsResponse,
	LndListInvoicesResponse,
	LndListPaymentsResponse,
} from '$/sources/LightningLnd/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')
const restBaseUrl = lightningLndBindings[1].endpoints[0].locator

const lndHeaders = (macaroonHex: string) => ({
	'Grpc-Metadata-macaroon': macaroonHex,
})

export const getInfo = (
	publicEnv: SourcePublicEnv
) => (
	getJson<LndGetInfoResponse>(
		`${base(restBaseUrl)}/v1/getinfo`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listChannels = (
	publicEnv: SourcePublicEnv
) => (
	getJson<LndListChannelsResponse>(
		`${base(restBaseUrl)}/v1/channels`,
		{
			origins: lightningLndOrigins,
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
	publicEnv: SourcePublicEnv
	numMaxInvoices?: number
}) => (
	getJson<LndListInvoicesResponse>(
		`${base(restBaseUrl)}/v1/invoices${numMaxInvoices == null ? '' : `?num_max_invoices=${numMaxInvoices}`}`,
		{
			origins: lightningLndOrigins,
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
	publicEnv: SourcePublicEnv
	maxPayments?: number
}) => (
	getJson<LndListPaymentsResponse>(
		`${base(restBaseUrl)}/v1/payments${maxPayments == null ? '' : `?max_payments=${maxPayments}`}`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)
