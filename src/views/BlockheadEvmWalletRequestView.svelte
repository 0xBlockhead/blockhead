<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
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
	href={
		href === undefined ?
			resolve(
				'/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request',
				{
					id: selection.entitySelector.$walletRequest.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{@const networkInitial = untrack(() => network)}
				<NetworkView
					selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
					prefetched={network ?? networkInitial}
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
					{@const blockheadSessionSimulationInitial = untrack(() => blockheadSessionSimulation)}
					<BlockheadSessionSimulationView
						selection={select(EntityType.BlockheadSessionSimulation, (blockheadSessionSimulation ?? blockheadSessionSimulationInitial)[EntityMetaKey.Selector])}
						prefetched={blockheadSessionSimulation ?? blockheadSessionSimulationInitial}
						href={null}
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
