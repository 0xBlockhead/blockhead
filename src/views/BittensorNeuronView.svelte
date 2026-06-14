<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.BittensorNeuron>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const neuron = subscribe(EntityType.BittensorNeuron,
		selector,
		({ sources: [
				Source.Bittensor_JsonRpc,
			], fields: { uid: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	entitySelector={selector}
	title={`Neuron #${selector.uid}`}
	idDragPlainText={String(selector.uid)}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selector.uid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Neuron </span>
			{#if Value}
			{@render Value()}
			{/if}
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
						<dd><NumberValue value={selector.$subnet.netuid} /></dd>
					</div>

					<div>
						<dt>UID</dt>
						<dd><NumberValue value={neuron.fields.uid} /></dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
