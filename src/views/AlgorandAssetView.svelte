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
	}: EntitySelectionViewProps<EntityType.AlgorandAsset> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const algorandAsset = $derived(selection({
		fields: {
			creator: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.assetId ?? '') || 'algorand asset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandAssetHolding_RoundsView from '$/views/AlgorandAssetHolding_RoundsView.svelte'
	import AlgorandAsset_TimestampsView from '$/views/AlgorandAsset_TimestampsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.assetId ?? '') || 'algorand asset'}
	{/snippet}

	{#snippet Value()}
		<AlgorandNetworkView
			selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandAsset}>
			{#snippet children(entity)}
				{@const creator0 = entity.creator}
				{#if creator0 != null}
					<span data-text="muted">
						{creator0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>asset ID</dt>
				<dd>
					{String(pendingEntity.assetId)}
				</dd>
			</div>

			<ResourceBoundary
				resource={algorandAsset}
			>
				{#snippet children(entity)}
					{@const creator = entity.creator}
					{#if creator != null}
						<div>
							<dt>creator</dt>
							<dd>
								{creator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const algorandAssetAlgorandAssetHoldingRoundsViewHoldingRoundsResource = selection.$$holdingRounds}
		<ResourceBoundary
			resource={algorandAssetAlgorandAssetHoldingRoundsViewHoldingRoundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandAssetHolding_RoundsView
						selection={algorandAssetAlgorandAssetHoldingRoundsViewHoldingRoundsResource}
						countResource={algorandAssetAlgorandAssetHoldingRoundsViewHoldingRoundsResource.count}
						title='holding rounds'
						id='holding-rounds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const algorandAssetAlgorandAssetTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={algorandAssetAlgorandAssetTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandAsset_TimestampsView
						selection={algorandAssetAlgorandAssetTimestampsViewTimestampsResource}
						countResource={algorandAssetAlgorandAssetTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
