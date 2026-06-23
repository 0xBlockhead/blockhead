import { getJson } from '$/lib/http.ts'
import { filfoxOrigins } from '$/sources/Filfox/index.ts'
import type {
	FilfoxAddress,
	FilfoxBlock,
	FilfoxMessage,
	FilfoxMessagesPage,
	FilfoxOverview,
	FilfoxTipset,
} from '$/sources/Filfox/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getTipset = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<FilfoxTipset>(
		`${base(restBaseUrl)}/tipset/${height.toString()}`,
		{ origins: filfoxOrigins }
	)
)

export const getMessage = ({
	restBaseUrl,
	messageCid,
}: {
	restBaseUrl: string
	messageCid: string
}) => (
	getJson<FilfoxMessage>(
		`${base(restBaseUrl)}/message/${messageCid}`,
		{ origins: filfoxOrigins }
	)
)

export const getBlock = ({
	restBaseUrl,
	blockCid,
}: {
	restBaseUrl: string
	blockCid: string
}) => (
	getJson<FilfoxBlock>(
		`${base(restBaseUrl)}/block/${blockCid}`,
		{ origins: filfoxOrigins }
	)
)

export const getBlockMessages = ({
	restBaseUrl,
	blockCid,
	pageSize,
}: {
	restBaseUrl: string
	blockCid: string
	pageSize: number
}) => (
	getJson<FilfoxMessagesPage>(
		`${base(restBaseUrl)}/block/${blockCid}/messages?pageSize=${pageSize.toString()}`,
		{ origins: filfoxOrigins }
	)
)

export const getAddress = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<FilfoxAddress>(
		`${base(restBaseUrl)}/address/${address}`,
		{ origins: filfoxOrigins }
	)
)

export const getOverview = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<FilfoxOverview>(
		`${base(restBaseUrl)}/overview`,
		{ origins: filfoxOrigins }
	)
)
