export const vitestClientInclude = ['src/**/*.svelte.{test,spec}.{js,ts}']
export const vitestClientExclude = [
	'src/lib/server/**',
	'src/routes/demo/**',
]

export const vitestServerInclude = ['src/**/*.{test,spec}.{js,ts}']
export const vitestServerExclude = [
	'src/**/*.svelte.{test,spec}.{js,ts}',
	'src/routes/demo/**',
]

export const mainPlaywrightTestMatch = '**/*.e2e.{ts,js}'
export const mainPlaywrightTestIgnore = [
	'**/.worktrees/**',
	'**/tests/e2e/wallet-extensions/*/*.e2e.ts',
	'**/tests/e2e/wallet-extensions/extension-loaded-smoke.e2e.ts',
	'**/tests/e2e/wallet-extensions/provider-discovery.e2e.ts',
	'**/tests/e2e/wallet-extensions/real-wallets-required.e2e.ts',
]

export const walletPlaywrightTestDir = './tests/e2e/wallet-extensions'
export const walletPlaywrightTestMatch = '**/*.e2e.ts'
export const walletPlaywrightTestIgnore = [
	'**/architectures.e2e.ts',
	'**/wallet-page-selectors.e2e.ts',
]
