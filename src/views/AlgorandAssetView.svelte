<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandAsset>>
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
	const algorandAsset = $derived(selection({
		fields: {
			creator: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.assetId ?? prefetched.assetId) ?? '')].filter(Boolean).join(' ') || 'algorand asset')
	const viewDomId = $derived('algorand-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={algorandAsset}>
			{#snippet Pending()}
				{[String((selection.entitySelector.assetId ?? prefetched.assetId) ?? '')].filter(Boolean).join(' ') || title || 'algorand asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.assetId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandAsset}>
			{#snippet Pending()}
				<AlgorandNetworkView
					selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AlgorandNetworkView
					selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandAsset}>
			{#snippet Pending()}
				{@const creator0 = prefetched.creator}
				{#if creator0 !== undefined && creator0 !== null}
					<span data-text="muted">
						{String((creator0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
								fields: {
									assetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetId = selection.entitySelector.assetId ?? prefetched.assetId}
							{#if assetId !== undefined && assetId !== null}
								{String((assetId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							creator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const creator = prefetched.creator}
					{#if creator !== undefined && creator !== null}
						<div>
							<dt>creator</dt>
							<dd>
								{String((creator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<AlgorandAssetHolding_RoundsView
				selection={selection[EntityProxyField]<EntityType.AlgorandAssetHolding_Round>('$$holdingRounds')}
				title='holding rounds'
				emptyText='No Algorand asset holding rounds.'
				id='AlgorandAssetHolding_RoundsView-$$holdingRounds'
			/>

			<AlgorandAsset_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AlgorandAsset_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Algorand asset observations.'
				id='AlgorandAsset_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
