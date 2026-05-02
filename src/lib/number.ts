export const formatValue = <
	ToParts extends boolean = false,
>(
	value: number,
	{
		currency,
		showDecimalPlaces,
		useGrouping = true,
		compactLargeValues = false,
		locale,
		toParts,
	}: {
		currency?: string
		showDecimalPlaces?: number
		useGrouping?: boolean
		compactLargeValues?: boolean
		locale?: string | string[]
		toParts?: ToParts
	} = {},
) => {
	try {
		const formatter = new Intl.NumberFormat(
			locale
				?? (typeof globalThis.navigator !== 'undefined' ?
					(globalThis.navigator.languages as string[])
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

		return (
			toParts
				? formatter.formatToParts(value)
				: formatter.format(value)
		) as (
			ToParts extends true
				? Intl.NumberFormatPart[]
				: string
		)
	} catch {
		return (
			toParts
				? [{ type: 'integer' as const, value: value?.toString() ?? '0' }]
				: value?.toString() ?? '0'
		) as (
			ToParts extends true
				? Intl.NumberFormatPart[]
				: string
		)
	}
}
