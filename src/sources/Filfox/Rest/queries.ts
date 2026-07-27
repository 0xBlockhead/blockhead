import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	FilfoxAddress,
	FilfoxBlock,
	FilfoxMessage,
	FilfoxMessagesPage,
	FilfoxOverview,
	FilfoxTipset,
} from '$/sources/Filfox/Rest/types.ts'
import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Filfox_Rest]
const baseUrl = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/api/v1`

export const getTipset = ({
	height,
}: {
	height: bigint
}) => (
	sourceGetJson<FilfoxTipset>(
		binding,
		`${baseUrl}/tipset/${height.toString()}`
	)
)

export const getMessage = ({
	messageCid,
}: {
	messageCid: string
}) => (
	sourceGetJson<FilfoxMessage>(
		binding,
		`${baseUrl}/message/${messageCid}`
	)
)

export const getBlock = ({
	blockCid,
}: {
	blockCid: string
}) => (
	sourceGetJson<FilfoxBlock>(
		binding,
		`${baseUrl}/block/${blockCid}`
	)
)

export const getBlockMessages = ({
	blockCid,
	pageSize,
}: {
	blockCid: string
	pageSize: number
}) => (
	sourceGetJson<FilfoxMessagesPage>(
		binding,
		`${baseUrl}/block/${blockCid}/messages?pageSize=${pageSize.toString()}`
	)
)

export const getAddress = ({
	address,
}: {
	address: string
}) => (
	sourceGetJson<FilfoxAddress>(
		binding,
		`${baseUrl}/address/${address}`
	)
)

export const getOverview = () => (
	sourceGetJson<FilfoxOverview>(
		binding,
		`${baseUrl}/overview`
	)
)
