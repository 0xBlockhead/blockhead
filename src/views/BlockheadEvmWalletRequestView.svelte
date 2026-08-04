<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadEvmWalletRequest>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadWalletRequestCallsView from '$/views/BlockheadWalletRequestCallsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadEvmWalletRequest}
	entitySelector={selection.entitySelector}
	title={title ?? 'Blockhead EVM wallet request'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				<NetworkView
					selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
					prefetched={network}
					href={null}
					layout={EntityLayout.Title}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$simulation}
		>
			{#snippet children(blockheadSessionSimulation)}
				{#if blockheadSessionSimulation != null}
					<BlockheadSessionSimulationView
						selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
						prefetched={blockheadSessionSimulation}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const callsResource = selection.$$calls}
		<ResourceBoundary
			resource={callsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWalletRequestCallsView
						selection={callsResource}
						countResource={callsResource.count}
						title='Calls'
						id='calls'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
