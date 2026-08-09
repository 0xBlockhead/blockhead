<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandAsset>, 'prefetched'> = $props()

	const algorandAsset = $derived(selection({
		fields: {
			creator: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandAssetHolding_RoundsView from '$/views/AlgorandAssetHolding_RoundsView.svelte'
	import AlgorandAsset_TimestampsView from '$/views/AlgorandAsset_TimestampsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.assetId)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/asset/[assetId=nonNegativeBigInt]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					assetId: String(selection.entitySelector.assetId),
				}
			)
		:
			href ?? undefined
	}
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

	{#snippet Content()}
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

	{#snippet Details()}
		{@const holdingRoundsResource = selection.$$holdingRounds}
		<ResourceBoundary
			resource={holdingRoundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandAssetHolding_RoundsView
						selection={holdingRoundsResource}
						countResource={holdingRoundsResource.count}
						title='holding rounds'
						id='holding-rounds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandAsset_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
