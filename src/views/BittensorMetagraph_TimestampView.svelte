<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.BittensorMetagraph_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const metagraph = $derived(selection(
		({ sources: [
				Source.Bittensor_JsonRpc,
			], fields: { metagraphByteLength: true, neuronCount: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorMetagraph_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={metagraph}
			placeholderText="Loading Bittensor metagraph…"
		>
			{#snippet children(metagraph)}
				{#if metagraph.fields.neuronCount !== undefined}
					<NumberValue value={metagraph.fields.neuronCount} />
					neurons
				{:else if metagraph.fields.metagraphByteLength !== undefined}
					<NumberValue value={metagraph.fields.metagraphByteLength} />
					bytes
				{:else}
					Subnet {selection.entitySelector.$subnet.netuid}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={metagraph}
			placeholderText="Loading Bittensor metagraph…"
		>
			{#snippet children(metagraph)}
				<dl>
					<div>
						<dt>Snapshot</dt>
						<dd><Timestamp timestamp={selection.entitySelector.timestampMs} /></dd>
					</div>

					{#if metagraph.fields.metagraphByteLength !== undefined}
						<div>
							<dt>Metagraph bytes</dt>
							<dd><NumberValue value={metagraph.fields.metagraphByteLength} /></dd>
						</div>
					{/if}

					{#if open && metagraph.fields.neuronCount !== undefined}
						<div>
							<dt>Neurons</dt>
							<dd><NumberValue value={metagraph.fields.neuronCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
