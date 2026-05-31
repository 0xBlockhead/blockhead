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
		entityId: EntityId<typeof schema, EntityType.BittensorNeuron>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const neuron = useEntity(
		EntityType.BittensorNeuron,
		entityId,
		{
			$: [
				Source.Bittensor_JsonRpc,
			],
			uid: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	{entityId}
	title={`Neuron #${entityId.uid}`}
	idDragPlainText={String(entityId.uid)}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(entityId.uid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Neuron </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={neuron}
			placeholderText="Loading Bittensor neuron…"
		>
			{#snippet children(neuron)}
				<dl>
					<div>
						<dt>Subnet</dt>
						<dd><NumberValue value={entityId.$subnet.netuid} /></dd>
					</div>

					<div>
						<dt>UID</dt>
						<dd><NumberValue value={neuron.uid} /></dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
