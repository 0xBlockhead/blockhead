<script lang="ts">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'


	// State
	let {
		metrics,
	}: {
		metrics: {
			label: string
			value?: number
			resource?: SvelteKitResource<number | undefined>
		}[]
	} = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#each metrics as metric (metric.label)}
	{#if metric.resource !== undefined}
		<ResourceBoundary
			resource={metric.resource}
			placeholderText={`Loading ${metric.label.toLowerCase()}…`}
		>
			{#snippet children(value)}
				{#if value != null}
					<div>
						<dt>{metric.label}</dt>
						<dd>
							<NumberValue
								value={value}
							/>
						</dd>
					</div>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{:else if metric.value != null}
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
