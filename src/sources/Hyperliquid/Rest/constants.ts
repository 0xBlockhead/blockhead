export const hyperliquidCandleIntervals = [
	'1m',
	'3m',
	'5m',
	'15m',
	'30m',
	'1h',
	'2h',
	'4h',
	'8h',
	'12h',
	'1d',
	'3d',
	'1w',
	'1M',
] as const


export const hyperliquidVaults = [{
	address: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
	role: 'liquidityProvider',
}] as const


export const hyperliquidVaultByRole = Object.fromEntries(
	hyperliquidVaults.map((vault) => [
		vault.role,
		vault,
	])
)
