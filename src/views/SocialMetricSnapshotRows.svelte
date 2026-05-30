<script lang="ts">
	// State
	let {
		metrics,
	}: {
		metrics: {
			label: string
			value: number | undefined
		}[]
	} = $props()


	// Components
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#each metrics as metric (metric.label)}
	{#if metric.value != null}
		<div>
			<dt>{metric.label}</dt>
			<dd>
				<NumberValue
					value={metric.value}
				/>
			</dd>
		</div>
	{/if}
{/each}
