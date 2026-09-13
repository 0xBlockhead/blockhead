<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPool_Amm_EvmBlock>, 'prefetched'> = $props()

	const liquidityPoolAmmEvmBlockLatestResource1 = $derived(
		selection
			.$block({
				sources: [
					Source.TheGraph_Graphql,
				],
				fields: {
					blockNumber: true,
					timestamp: true,
				},
			})
	)

	const pool = $derived(selection.entitySelector.$pool)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPool_Amm_EvmBlock_InputAssetsView from '$/views/LiquidityPool_Amm_EvmBlock_InputAssetsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Amm_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.sourceRevision || 'AMM pool observation')}
	href={
		href === undefined ?
			(
				pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
						{
							chainId: pool.$network.caip2.reference,
							poolId: pool.id,
							blockSelector: String(stringify(selection.entitySelector.$block)),
							sourceRevision: selection.entitySelector.sourceRevision,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmBlockView
			selection={
				select(EntityType.EvmBlock, selection.entitySelector.$block, {
					sources: [
						Source.TheGraph_Graphql,
					],
				})
			}
			href={null}
			layout={EntityLayout.Title}
		/>
		{selection.entitySelector.sourceRevision}
	{/snippet}

	{#snippet Value()}
		<LiquidityPoolView
			selection={select(EntityType.LiquidityPool, selection.entitySelector.$pool)}
			href={null}
			layout={EntityLayout.Value}
		/>

		<EvmBlockView
			selection={
				select(EntityType.EvmBlock, selection.entitySelector.$block, {
					sources: [
						Source.TheGraph_Graphql,
					],
				})
			}
			href={null}
			layout={EntityLayout.Value}
		/>
		{selection.entitySelector.sourceRevision}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={liquidityPoolAmmEvmBlockLatestResource1}
					>
						{#snippet children(evmBlock)}
							{#if evmBlock != null}
								{@const evmBlockSelector = evmBlock[EntityMetaKey.Selector]}
								<EvmBlockView
									selection={
										select(EntityType.EvmBlock, evmBlockSelector, {
											sources: [
												Source.TheGraph_Graphql,
											],
										})
									}
									prefetched={{ ...evmBlockSelector, ...evmBlock }}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Total value locked (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalValueLockedUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalValueLockedUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative volume (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeVolumeUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeVolumeUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative supply-side revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeSupplySideRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeSupplySideRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative protocol-side revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeProtocolSideRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeProtocolSideRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative total revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeTotalRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeTotalRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const inputAssetsResource = selection
			.$$inputAssets({
				sources: [
					Source.TheGraph_Graphql,
				],
			})}
		<ResourceBoundary
			resource={inputAssetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LiquidityPool_Amm_EvmBlock_InputAssetsView
						selection={inputAssetsResource}
						countResource={inputAssetsResource.count}
						title='Input Assets'
						id='input-assets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
