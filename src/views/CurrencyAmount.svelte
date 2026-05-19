<script lang="ts">
	// Props
	let {
		value,
		currency = 'USD',
		scale = 1e8,
		showDecimalPlaces = 2,
		useGrouping = true,
		compactLargeValues = false,
		locale,
		tween = false,
		tweenDuration = 1000,
	}: {
		value: number | bigint
		currency?: string
		scale?: number
		showDecimalPlaces?: number
		useGrouping?: boolean
		compactLargeValues?: boolean
		locale?: string | string[]
		tween?: boolean
		tweenDuration?: number
	} = $props()


	// Components
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<NumberValue
	value={Number(value) / scale}
	formatValueOptions={{
		currency,
		showDecimalPlaces,
		useGrouping,
		compactLargeValues,
		locale,
	}}
	{tween}
	{tweenDuration}
/>
