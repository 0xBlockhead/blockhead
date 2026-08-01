<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandAsset> = $props()

	const algorandAsset = $derived(selection({
		fields: {
			creator: true,
		},
	}))


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.assetId)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<AlgorandNetworkView
			selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandAsset}>
			{#snippet children(entity)}
				{@const creator = entity.creator}
				{#if creator != null}
					<span data-text="muted">
						{creator}
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
					/>
				</dd>
			</div>

			<div>
				<dt>asset ID</dt>
				<dd>
					{selection.entitySelector.assetId}
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
		{@const holdingRoundsResource = selection.$$holdingRounds}
		<ResourceBoundary
			resource={holdingRoundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.AlgorandAssetHolding_Round}
						countResource={holdingRoundsResource.count}
						title='holding rounds'
						open={true}
						id='holding-rounds'
						resource={holdingRoundsResource()}
					>
						{#snippet Item({ item: algorandAssetHoldingRound })}
							<EntityView
								entityType={EntityType.AlgorandAssetHolding_Round}
								entitySelector={algorandAssetHoldingRound[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.AlgorandAsset_Timestamp}
						countResource={timestampsResource.count}
						title='timestamps'
						open={true}
						id='timestamps'
						resource={timestampsResource()}
					>
						{#snippet Item({ item: algorandAssetTimestamp })}
							<EntityView
								entityType={EntityType.AlgorandAsset_Timestamp}
								entitySelector={algorandAssetTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
