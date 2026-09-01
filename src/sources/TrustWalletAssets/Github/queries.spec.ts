import {
	expect,
	it,
} from 'vitest'

import {
	getChainLogoUrl,
	getTokenLogoUrl,
} from '$/sources/TrustWalletAssets/Github/queries.ts'

it('encodes chain and token coordinates as individual GitHub path segments', () => {
	expect(getChainLogoUrl('smart chain/test')).toBe(
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smart%20chain%2Ftest/info/logo.png'
	)
	expect(getTokenLogoUrl(
		'smart chain/test',
		'0xabc/def?version=1'
	)).toBe(
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smart%20chain%2Ftest/assets/0xabc%2Fdef%3Fversion%3D1/logo.png'
	)
})
