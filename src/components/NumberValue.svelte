<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'


	// State
	let {
		value,
		options = {},
		formatValueOptions,
		decimalPlaces,
		class: className,
		...outputProps
	}: WithRest<
		{
			value?: number | bigint
			options?: Intl.NumberFormatOptions
			formatValueOptions?: NonNullable<Parameters<typeof formatValue>[1]>
			decimalPlaces?: number
		},
		SvelteHTMLElements['output']
	> = $props()


	// Functions
	const indexParts = (parts: Intl.NumberFormatPart[]) => {
		const decimalIndex = parts.findIndex(
			(part) => (part.type === 'decimal' || part.type === 'exponentSeparator'),
		)

		let k = 0
		return [
			...(
				(
					decimalIndex === -1 ?
						parts
					:
						parts.slice(0, decimalIndex)
				)
					.toReversed()
					.map((part) => (
						{
							key: `L${(k++).toString(36)}`,
							part,
						}
					))
					.toReversed()
			),

			...(
				(
					decimalIndex === -1 ?
						[]
					:
						parts.slice(decimalIndex)
				)
					.map((part) => (
						{
							key: `R${(k++).toString(36)}`,
							part,
						}
					))
			),
		]
	}

	const scaledIntegerParts = (
		value: number | bigint,
		decimalPlaces: number
	): Intl.NumberFormatPart[] => {
		const normalizedDecimalPlaces = Math.max(0, Math.trunc(decimalPlaces))
		const divisor = 10n ** BigInt(normalizedDecimalPlaces)
		const scaledValue = BigInt(value)
		const absoluteValue = scaledValue < 0n ? -scaledValue : scaledValue
		const fraction = String(absoluteValue % divisor)
			.padStart(normalizedDecimalPlaces, '0')
			.replace(/0+$/, '')

		return [
			...(scaledValue < 0n ? [{
				type: 'minusSign' as const,
				value: '-',
			}] : []),
			...new Intl.NumberFormat(undefined, {
				...options,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).formatToParts(absoluteValue / divisor),
			...(fraction === '' ? [] : [
				{
					type: 'decimal' as const,
					value: (
						new Intl.NumberFormat()
							.formatToParts(1.1)
							.find((part) => part.type === 'decimal')
							?.value
						?? '.'
					),
				},
				{
					type: 'fraction' as const,
					value: fraction,
				},
			]),
		]
	}


	import { formatValue } from '$/lib/number.ts'
</script>


{#if value !== undefined}
	<output
		class={[
			'number-value',
			className,
		]}
		{...outputProps}
	>
		{#each indexParts(
			decimalPlaces !== undefined ?
				scaledIntegerParts(value, decimalPlaces)
			: formatValueOptions ?
				(formatValue(
					Number(value) || 0,
					{ ...formatValueOptions, toParts: true },
				))
			:
				(new Intl.NumberFormat(
					undefined,
					options,
				)
					.formatToParts(value)
			)
		) as indexed (indexed.key)}
			<span
				data-part={indexed.part.type}
			>
				{indexed.part.value}
			</span>
		{/each}
	</output>
{/if}


<style>
	.number-value {
		font-variant-numeric: tabular-nums;
	}

	span[data-part='fraction'] {
		opacity: 0.6;
	}

	span[data-part='currency'] {
		font-weight: 600;
	}

	span[data-part='group'] {
		opacity: 0.4;
	}
</style>
