<script lang="ts">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import { Tween, prefersReducedMotion } from 'svelte/motion'


	// State
	let {
		value,
		resource,
		locales,
		options = {},
		tween = false,
		tweenDuration = 1000,
		formatValueOptions,
		decimalPlaces,
	}: {
		value?: number | bigint
		resource?: SvelteKitResource<number | bigint | undefined>
		locales?: string | string[]
		options?: Intl.NumberFormatOptions
		tween?: boolean
		tweenDuration?: number
		formatValueOptions?: NonNullable<Parameters<typeof formatValue>[1]>
		decimalPlaces?: number
	} = $props()


	// Functions
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			...new Intl.NumberFormat(locales, {
				...options,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).formatToParts(absoluteValue / divisor),
			...(fraction === '' ? [] : [
				{
					type: 'decimal' as const,
					value: (
						new Intl.NumberFormat(locales)
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

	let isFirstTweenSet = $state(
		true,
	)

	const tweenedNumber = new Tween(0, {
		duration: 0,
		easing: quintOut,
		interpolate: (from, to) => (step) => {
			const dec = (
				formatValueOptions?.showDecimalPlaces
				?? options.maximumFractionDigits
				?? options.minimumFractionDigits
				?? 0
			)
			const logFrom = (
				from != 0 ?
					Math.log10(from)
				:
					-dec - 1
			)
			const interpolated = (
				10
				** (
					logFrom
					+ step * (
						(to != 0 ?
							Math.log10(to)
						:
							-dec - 1)
						- logFrom
					)
				)
			)
			return (
				to >= 100 && step < 0.9994 ?
					from < to ?
						Math.floor(interpolated)
					:
						Math.ceil(interpolated)
				:
					interpolated
			)
		},
	})


	const dPad = $derived(
		formatValueOptions?.showDecimalPlaces
			?? options.maximumFractionDigits
			?? options.minimumFractionDigits
			?? 0
	)

	const displayNumber = $derived(
		tween ?
			tweenedNumber.current
		:
			(Number(value ?? 0) || 0)
	)

	$effect(() => {
		if (!tween) {
			return
		}
		const instant = (
			prefersReducedMotion.current
			|| isFirstTweenSet
		)
		void tweenedNumber.set(
			Number(value ?? 0) || 0,
			{
				duration: (instant ?
					0
				:
					tweenDuration),
				delay: (instant ?
					0
				:
					1),
			},
		)
		isFirstTweenSet = false
	})


	// Transitions/animations
	import { quintOut } from 'svelte/easing'
</script>


{#snippet RenderValue(renderedValue: number | bigint)}
	<output class="number-value">
		{#each indexParts(
			decimalPlaces !== undefined ?
				scaledIntegerParts(renderedValue, decimalPlaces)
			: formatValueOptions ?
				(formatValue(
					tween && resource === undefined ?
						displayNumber
					:
						Number(renderedValue) || 0,
					{ ...formatValueOptions, toParts: true },
				))
			:
				(new Intl.NumberFormat(
					locales,
					options,
				)
					.formatToParts(
						tween && resource === undefined ?
							displayNumber
						:
							renderedValue
					)
			)
		) as indexed (indexed.key)}
			<span
				data-part={indexed.part.type}
			>
				{indexed.part.value}
			</span>
		{/each}
	</output>
{/snippet}

{#if resource !== undefined}
	<ResourceBoundary
		{resource}
		placeholderText="Loading number…"
	>
		{#snippet children(value)}
			{#if value !== undefined}
				{@render RenderValue(value)}
			{/if}
		{/snippet}
	</ResourceBoundary>
{:else if value !== undefined}
	{@render RenderValue(value)}
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
