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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.assetId ?? '') || 'Polkadot asset')


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
	{#snippet Title()}
		{(pendingEntity.assetId ?? '') || 'Polkadot asset'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.assetKind ?? '') || (pendingEntity.assetId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
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
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset kind</dt>
				<dd>
					{pendingEntity.assetKind}
				</dd>
			</div>

			<div>
				<dt>Asset ID</dt>
				<dd>
					{pendingEntity.assetId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const polkadotAssetPolkadotAssetTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={polkadotAssetPolkadotAssetTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotAsset_TimestampsView
						selection={polkadotAssetPolkadotAssetTimestampsViewTimestampsResource}
						countResource={polkadotAssetPolkadotAssetTimestampsViewTimestampsResource.count}
						title='Asset observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const polkadotAssetPolkadotAssetBalanceTimestampsViewBalanceTimestampsResource = selection.$$balanceTimestamps}
		<ResourceBoundary
			resource={polkadotAssetPolkadotAssetBalanceTimestampsViewBalanceTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotAssetBalance_TimestampsView
						selection={polkadotAssetPolkadotAssetBalanceTimestampsViewBalanceTimestampsResource}
						countResource={polkadotAssetPolkadotAssetBalanceTimestampsViewBalanceTimestampsResource.count}
						title='Balances'
						id='balance-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
