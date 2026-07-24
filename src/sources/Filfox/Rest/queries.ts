import type { SourceBinding } from '$/sources/SourceBinding.ts'
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

const base = (binding: SourceBinding) => `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/api/v1`

export const getTipset = ({
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	sourceGetJson<FilfoxTipset>(
		binding,
		`${base(binding)}/tipset/${height.toString()}`
	)
)

export const getMessage = ({
	binding,
	messageCid,
}: {
	binding: SourceBinding
	messageCid: string
}) => (
	sourceGetJson<FilfoxMessage>(
		binding,
		`${base(binding)}/message/${messageCid}`
	)
)

export const getBlock = ({
	binding,
	blockCid,
}: {
	binding: SourceBinding
	blockCid: string
}) => (
	sourceGetJson<FilfoxBlock>(
		binding,
		`${base(binding)}/block/${blockCid}`
	)
)

export const getBlockMessages = ({
	binding,
	blockCid,
	pageSize,
}: {
	binding: SourceBinding
	blockCid: string
	pageSize: number
}) => (
	sourceGetJson<FilfoxMessagesPage>(
		binding,
		`${base(binding)}/block/${blockCid}/messages?pageSize=${pageSize.toString()}`
	)
)

export const getAddress = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	sourceGetJson<FilfoxAddress>(
		binding,
		`${base(binding)}/address/${address}`
	)
)

export const getOverview = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	sourceGetJson<FilfoxOverview>(
		binding,
		`${base(binding)}/overview`
	)
)
