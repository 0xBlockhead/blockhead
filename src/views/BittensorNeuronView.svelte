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
		selection: EntityProxyResource<typeof schema, EntityType.BittensorNeuron>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	entitySelector={selection.entitySelector}
	title={`Neuron #${selection.entitySelector.uid}`}
	idDragPlainText={String(selection.entitySelector.uid)}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selection.entitySelector.uid)}
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
			resource={selection( { sources: [
					Source.Bittensor_JsonRpc,
				], fields: { uid: true } })}
			placeholderText="Loading Bittensor neuron…"
		>
			{#snippet children(neuron)}
				<dl>
					<div>
						<dt>Subnet</dt>
						<dd><NumberValue value={selection.entitySelector.$subnet.netuid} /></dd>
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
