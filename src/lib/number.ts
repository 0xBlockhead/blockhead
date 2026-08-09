type FormatValueOptions<ToParts extends boolean = false> = {
	currency?: string
	showDecimalPlaces?: number
	useGrouping?: boolean
	compactLargeValues?: boolean
	locale?: string | string[]
	toParts?: ToParts
}

export function formatValue(
	value: number | bigint,
	options: FormatValueOptions<true> & { toParts: true }
): Intl.NumberFormatPart[]
export function formatValue(
	value: number | bigint,
	options?: FormatValueOptions<false>
): string
export function formatValue(
	value: number | bigint,
	{
		currency,
		showDecimalPlaces,
		useGrouping = true,
		compactLargeValues = false,
		locale,
		toParts,
	}: FormatValueOptions<boolean> = {}
): string | Intl.NumberFormatPart[] {
	try {
		const formatter = new Intl.NumberFormat(
			locale
				?? (typeof globalThis.navigator !== 'undefined' ?
					globalThis.navigator.languages
				:
					['en-US']),
			{
				...(currency && {
					currency,
					style: 'currency',
				}),

				...(showDecimalPlaces !== undefined && {
					minimumFractionDigits: showDecimalPlaces,
					maximumFractionDigits: showDecimalPlaces,
				}),

				useGrouping,

				...(compactLargeValues
					&& (
						value >= 1e4 ?
							{
								notation: 'compact',
								compactDisplay: 'short',
								...(showDecimalPlaces !== undefined && {
									minimumSignificantDigits: 1,
									maximumSignificantDigits: (
										(
											typeof value === 'bigint' ?
												value.toString().length - 1
											:
												Math.log10(value)
										) % 3
										+ 1
										+ showDecimalPlaces
									),
								}),
							}
						:
							undefined
					)
				),
			} satisfies Intl.NumberFormatOptions
		)

		return (
			toParts === true ?
				formatter.formatToParts(value)
			:
				formatter.format(value)
		)
	} catch {
		return (
			toParts === true ?
				[
					{
						type: 'integer',
						value: value.toString(),
					},
				] satisfies Intl.NumberFormatPart[]
			:
				value.toString()
		)
	}
}
