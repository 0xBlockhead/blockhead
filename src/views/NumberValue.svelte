<script lang="ts">
	// Types/constants
	import { quintOut } from 'svelte/easing'
	import { Tween, prefersReducedMotion } from 'svelte/motion'

	import { formatValue } from '$/lib/number.ts'


	// Functions
	const indexParts = (parts: Intl.NumberFormatPart[]) => {
		const decimalIndex = parts.findIndex(
			(part) => (part.type === 'decimal' || part.type === 'exponentSeparator'),
		)
		const partsLeft = (
			decimalIndex === -1
				? parts
			: parts.slice(0, decimalIndex)
		)
		const partsRight = (
			decimalIndex === -1
				? []
			: parts.slice(decimalIndex)
		)

		let k = 0
		return [
			...partsLeft
				.toReversed()
				.map((part) => (
					{
						key: `L${(k++).toString(36)}`,
						part,
					}
				))
				.toReversed(),

			...partsRight
				.map((part) => (
					{
						key: `R${(k++).toString(36)}`,
						part,
					}
				)),
		]
	}


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
	const numberTarget = $derived(
		Number(value) || 0
	)

	const decimalPlaces = $derived(
		formatValueOptions?.showDecimalPlaces
			?? options.maximumFractionDigits
			?? options.minimumFractionDigits
			?? 0
	)

	let dPad = $state(0)

	$effect(() => {
		dPad = decimalPlaces
	})


	// Tween: log-scale interpolation; duration 0 when `tween` is false or reduced motion
	const tweenedNumber = (new Tween(0, {
		duration: 0,
		easing: quintOut,
		interpolate: (from, to) => (step) => {
			const dec = dPad
			const logFrom = (from != 0 ? Math.log10(from) : -dec - 1)
			const logTo = (to != 0 ? Math.log10(to) : -dec - 1)
			const result = (
				10
				** (logFrom + step * (logTo - logFrom))
			)
			return (
				to >= 100 && step < 0.9994
					? (from < to ? Math.floor(result) : Math.ceil(result))
				: result
			)
		},
	}))

	let isFirstTweenSet = $state(
		true
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
			numberTarget,
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


	// (Derived)
	const displayNumber = $derived(
		tween
			? tweenedNumber.current
		: numberTarget
	)

	const indexedParts = $derived((
		indexParts(
			formatValueOptions
				? (formatValue(
					displayNumber,
					{ ...formatValueOptions, toParts: true },
				))
			: (new Intl.NumberFormat(
					locales,
					options,
				)
					.formatToParts(displayNumber)),
		)
	))
</script>


<output>
	{#each indexedParts as { key, part } (key)}
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
