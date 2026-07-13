<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarLiquidityPool>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarLiquidityPool>>
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
	const stellarLiquidityPool = $derived(selection({}))
	const titleFallback = $derived('stellar liquidity pool')
	const viewDomId = $derived('stellar-liquidity-pool-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarLiquidityPool}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarLiquidityPool}>
			{#snippet Pending()}
				{title || 'stellar liquidity pool'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>liquidity pool ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									liquidityPoolId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const liquidityPoolId = pendingEntity.liquidityPoolId}
							{#if liquidityPoolId !== undefined && liquidityPoolId !== null}
								{String((liquidityPoolId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const liquidityPoolId = resolvedEntity.liquidityPoolId}
							{#if liquidityPoolId !== undefined && liquidityPoolId !== null}
								{String((liquidityPoolId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const poolType = pendingEntity.poolType}
					{#if poolType !== undefined && poolType !== null}
						<div>
							<dt>pool type</dt>
							<dd>
								{String((poolType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolType = resolvedEntity.poolType}
					{#if poolType !== undefined && poolType !== null}
						<div>
							<dt>pool type</dt>
							<dd>
								{String((poolType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetA}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAsset)}
					{#if stellarAsset != null && stellarAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset a</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetB}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAsset)}
					{#if stellarAsset != null && stellarAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset b</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeBps: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeBps = pendingEntity.feeBps}
					{#if feeBps !== undefined && feeBps !== null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{String((feeBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeBps = resolvedEntity.feeBps}
					{#if feeBps !== undefined && feeBps !== null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{String((feeBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
