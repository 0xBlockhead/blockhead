import type { WalletDriver } from '../harness.ts'


export const rabbyDriver: WalletDriver = {
	kind: 'rabby',
	open: (context, extension) => (
		context.newPage().then(async (page) => {
			await page.goto(`chrome-extension://${extension.id}/index.html`)
			return page
		})
	),
}
