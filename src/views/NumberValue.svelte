<script lang="ts">
	// Types/constants
	import { quintOut } from 'svelte/easing'
	import { Tween, prefersReducedMotion } from 'svelte/motion'

	import { formatValue } from '$/lib/number.ts'


	// Props
	let {
		value,
		locales,
		options = {},
		tween = false,
		tweenDuration = 1000,
		formatValueOptions,
	}: {
		value: number | bigint
		locales?: string | string[]
		options?: Intl.NumberFormatOptions
		tween?: boolean
		tweenDuration?: number
		formatValueOptions?: NonNullable<Parameters<typeof formatValue>[1]>
	} = $props()


	// (Derived)
	const dPad = $derived(
		formatValueOptions?.showDecimalPlaces
			?? options.maximumFractionDigits
			?? options.minimumFractionDigits
			?? 0
	)


	// Functions
	const indexParts = (parts: Intl.NumberFormatPart[]) => {
		const decimalIndex = parts.findIndex(
			(part) => (part.type === 'decimal' || part.type === 'exponentSeparator'),
		)

		let k = 0
		return [
			...(decimalIndex === -1
				? parts
			: parts.slice(0, decimalIndex))
				.toReversed()
				.map((part) => (
					{
						key: `L${(k++).toString(36)}`,
						part,
					}
				))
				.toReversed(),

			...(decimalIndex === -1
				? []
			: parts.slice(decimalIndex))
				.map((part) => (
					{
						key: `R${(k++).toString(36)}`,
						part,
					}
				)),
		]
	}


	// State
	let isFirstTweenSet = $state(
		true,
	)

	const tweenedNumber = new Tween(0, {
		duration: 0,
		easing: quintOut,
		interpolate: (from, to) => (step) => {
			const dec = dPad
			const logFrom = (from != 0 ? Math.log10(from) : -dec - 1)
			const interpolated = (
				10
				** (
					logFrom
					+ step * (
						(to != 0 ? Math.log10(to) : -dec - 1)
						- logFrom
					)
				)
			)
			return (
				to >= 100 && step < 0.9994
					? (from < to ? Math.floor(interpolated) : Math.ceil(interpolated))
				: interpolated
			)
		},
	})

	const displayNumber = $derived(
		tween ?
			tweenedNumber.current
		:
			(Number(value) || 0)
	)


	// (Derived)
	$effect(() => {
		if (!tween) {
			return
		}
		const instant = (
			prefersReducedMotion.current
			|| isFirstTweenSet
		)
		void tweenedNumber.set(
			Number(value) || 0,
			{
				duration: (instant
					? 0
					: tweenDuration),
				delay: (instant
					? 0
					: 1),
			},
		)
		isFirstTweenSet = false
	})
</script>


<output>
	{#each indexParts(
		formatValueOptions
			? (formatValue(
				displayNumber,
				{ ...formatValueOptions, toParts: true },
			))
		: (new Intl.NumberFormat(
				locales,
				options,
			)
				.formatToParts(displayNumber)
		)
	) as { key, part } (key)}
		<span
			data-part={part.type}
		>
			{part.value}
		</span>
	{/each}
</output>


<style>
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
