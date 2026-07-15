import { type as arktype, type Type } from 'arktype'

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TonApiAccount } from '$/sources/TonApi/Rest/types.ts'

const tonApiAccount = arktype({
	address: 'string',
	balance: 'string',
	last_activity: 'number.integer >= 0',
	status: "'uninit' | 'active' | 'frozen'",
	interfaces: 'string[]',
	get_methods: 'string[]',
	is_wallet: 'boolean',
}) satisfies Type<TonApiAccount>

export const getAccount = (
	binding: SourceBinding,
	accountId: string
) => (
	getJson<unknown>(
		binding,
		`/v2/accounts/${encodeURIComponent(accountId)}`
	).then((wire) => {
		const account = tonApiAccount.assert(wire)
		if (!/^(?:0|[1-9]\d*)$/.test(account.balance))
			throw new Error('TonApi_Rest: account balance is not a non-negative decimal integer')

		return account
	})
)
