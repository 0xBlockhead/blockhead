<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.BittensorMetagraph_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const metagraph = useEntity(
		EntityType.BittensorMetagraph_Timestamp,
		entityId,
		{
			$: [
				Source.Bittensor_JsonRpc,
			],
			metagraphByteLength: {},
			neuronCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorMetagraph_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Title()}
		Subnet {entityId.$subnet.netuid} metagraph
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
						<dd><Timestamp timestamp={entityId.timestampMs} /></dd>
					</div>

					{#if metagraph.metagraphByteLength !== undefined}
						<div>
							<dt>Metagraph bytes</dt>
							<dd><NumberValue value={metagraph.metagraphByteLength} /></dd>
						</div>
					{/if}

					{#if open && metagraph.neuronCount !== undefined}
						<div>
							<dt>Neurons</dt>
							<dd><NumberValue value={metagraph.neuronCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
