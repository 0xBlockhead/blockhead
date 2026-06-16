import { getJson } from '$/lib/http.ts'
import LightningLnd from '$/sources/LightningLnd/index.ts'
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

export const getInfo = ({
	restBaseUrl,
	macaroonHex,
}: {
	restBaseUrl: string
	macaroonHex: string
}) => (
	getJson<LndGetInfoResponse>(
		`${base(restBaseUrl)}/v1/getinfo`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(macaroonHex),
			},
		}
	)
)

export const listChannels = ({
	restBaseUrl,
	macaroonHex,
}: {
	restBaseUrl: string
	macaroonHex: string
}) => (
	getJson<LndListChannelsResponse>(
		`${base(restBaseUrl)}/v1/channels`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(macaroonHex),
			},
		}
	)
)

export const listInvoices = ({
	restBaseUrl,
	macaroonHex,
	numMaxInvoices,
}: {
	restBaseUrl: string
	macaroonHex: string
	numMaxInvoices?: number
}) => (
	getJson<LndListInvoicesResponse>(
		`${base(restBaseUrl)}/v1/invoices${numMaxInvoices == null ? '' : `?num_max_invoices=${numMaxInvoices}`}`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(macaroonHex),
			},
		}
	)
)

export const listPayments = ({
	restBaseUrl,
	macaroonHex,
	maxPayments,
}: {
	restBaseUrl: string
	macaroonHex: string
	maxPayments?: number
}) => (
	getJson<LndListPaymentsResponse>(
		`${base(restBaseUrl)}/v1/payments${maxPayments == null ? '' : `?max_payments=${maxPayments}`}`,
		{
			origins: LightningLnd.origins,
			init: {
				headers: lndHeaders(macaroonHex),
			},
		}
	)
)
