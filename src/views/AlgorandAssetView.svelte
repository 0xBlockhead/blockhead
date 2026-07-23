<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.AlgorandAsset>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AlgorandAsset>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const algorandAsset = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			creator: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			creator: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || 'algorand asset')
	const viewDomId = $derived('algorand-asset-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandAssetHolding_RoundsView from '$/views/AlgorandAssetHolding_RoundsView.svelte'
	import AlgorandAsset_TimestampsView from '$/views/AlgorandAsset_TimestampsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched, 'creator')}
			{[String((pendingEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={algorandAsset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched, 'creator')}
			{@const algorandNetwork0 = pendingEntity.$network}
			{#if algorandNetwork0 != null && selection.entitySelector.$network != null}
				<AlgorandNetworkView
					selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network, { sources: selection.sources })}
					prefetched={algorandNetwork0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={algorandAsset}>
				{#snippet children(entity)}
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched, 'creator')}
			{@const creator0 = pendingEntity.creator}
			{#if creator0 !== undefined && creator0 !== null}
				<span data-text="muted">
					{String((creator0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={algorandAsset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creator0 = resolvedEntity.creator}
					{#if creator0 !== undefined && creator0 !== null}
						<span data-text="muted">
							{String((creator0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									assetId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetId = resolvedEntity.assetId}
							{#if assetId !== undefined && assetId !== null}
								{String((assetId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							creator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creator = resolvedEntity.creator}
					{#if creator !== undefined && creator !== null}
						<div>
							<dt>creator</dt>
							<dd>
								{String((creator) ?? '')}
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
					id='AlgorandAssetHolding_RoundsView-holding-rounds'
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
					id='AlgorandAsset_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
