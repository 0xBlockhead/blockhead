import {
	expect,
	it,
} from 'vitest'

import {
	getChainLogoUrl,
	getTokenLogoUrl,
} from '$/sources/TrustWalletAssets/Github/queries.ts'

it('derives raw asset URLs from the repository binding target', () => {
	expect(getChainLogoUrl('ethereum')).toBe(
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
	)
	expect(getTokenLogoUrl('ethereum', '0x1234')).toBe(
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1234/logo.png'
	)
})
