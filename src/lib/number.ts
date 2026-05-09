type FormatValueOptions<ToParts extends boolean = false> = {
	currency?: string
	showDecimalPlaces?: number
	useGrouping?: boolean
	compactLargeValues?: boolean
	locale?: string | string[]
	toParts?: ToParts
}

export function formatValue(
	value: number,
	options: FormatValueOptions<true> & { toParts: true },
): Intl.NumberFormatPart[]
export function formatValue(
	value: number,
	options?: FormatValueOptions<false>,
): string
export function formatValue(
	value: number,
	{
		currency,
		showDecimalPlaces,
		useGrouping = true,
		compactLargeValues = false,
		locale,
		toParts,
	}: FormatValueOptions = {},
): string | Intl.NumberFormatPart[] {
	try {
		const formatter = new Intl.NumberFormat(
			locale
				?? (typeof globalThis.navigator !== 'undefined' ?
					globalThis.navigator.languages
				: ['en-US']),
			{
				...(currency && {
					currency,
					style: 'currency' as const,
				}),

				...(showDecimalPlaces !== undefined && {
					minimumFractionDigits: showDecimalPlaces,
					maximumFractionDigits: showDecimalPlaces,
				}),

				useGrouping,

				...(compactLargeValues
					&& (
						value >= 1e7 ?
							{
								notation: 'compact' as const,
								compactDisplay: 'short' as const,
								...(showDecimalPlaces !== undefined && {
									minimumSignificantDigits: 1,
									maximumSignificantDigits:
										((Math.log10(value) % 3) + 1) + showDecimalPlaces,
								}),
							}
						: value >= 1e4 ?
							{
								notation: 'compact' as const,
								compactDisplay: 'short' as const,
								...(showDecimalPlaces !== undefined && {
									minimumSignificantDigits: 1,
									maximumSignificantDigits:
										((Math.log10(value) % 3) + 1) + showDecimalPlaces,
								}),
							}
						:
							undefined
					)
				),
			},
		)

		return toParts === true ?
				formatter.formatToParts(value)
			: formatter.format(value)
	} catch {
		return toParts === true ?
				[{ type: 'integer' as const, value: value?.toString() ?? '0' }]
			: value?.toString() ?? '0'
	}
}
