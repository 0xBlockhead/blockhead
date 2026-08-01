<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotAsset> = $props()

	const titleFallback = $derived(selection.entitySelector.assetId || 'Polkadot asset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotAsset_TimestampsView from '$/views/PolkadotAsset_TimestampsView.svelte'
	import PolkadotAssetBalance_TimestampsView from '$/views/PolkadotAssetBalance_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.assetKind || selection.entitySelector.assetId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset kind</dt>
				<dd>
					{selection.entitySelector.assetKind}
				</dd>
			</div>

			<div>
				<dt>Asset ID</dt>
				<dd>
					{selection.entitySelector.assetId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotAsset_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Asset observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const balanceTimestampsResource = selection.$$balanceTimestamps}
		<ResourceBoundary
			resource={balanceTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotAssetBalance_TimestampsView
						selection={balanceTimestampsResource}
						countResource={balanceTimestampsResource.count}
						title='Balances'
						id='balance-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
