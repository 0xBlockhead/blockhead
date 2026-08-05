import type { WalletDriver } from '../harness.ts'


export const metamaskDriver: WalletDriver = {
	kind: 'metamask',
	open: (context, extension) => (
		context.newPage().then(async (page) => {
			await page.goto(`chrome-extension://${extension.id}/home.html`)
			return page
		})
	),
}
