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
				<dt>Total liquidity (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalLiquidityUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalLiquidityUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Active liquidity (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									activeLiquidityUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.activeLiquidityUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Uncollected protocol-side values (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.uncollectedProtocolSideValuesUSD}
					>
						{#snippet children(uncollectedProtocolSideValuesUSD)}
							{uncollectedProtocolSideValuesUSD.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Uncollected supply-side values (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.uncollectedSupplySideValuesUSD}
					>
						{#snippet children(uncollectedSupplySideValuesUSD)}
							{uncollectedSupplySideValuesUSD.values.join(', ')}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stakedOutputTokenAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakedOutputTokenAmount = entity.stakedOutputTokenAmount}
					{#if stakedOutputTokenAmount != null}
						<div>
							<dt>Staked output-token amount</dt>
							<dd>
								{stakedOutputTokenAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Reward-token emissions</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.rewardTokenEmissionsAmount}
					>
						{#snippet children(rewardTokenEmissionsAmount)}
							{rewardTokenEmissionsAmount.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Reward-token emissions (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.rewardTokenEmissionsUSD}
					>
						{#snippet children(rewardTokenEmissionsUSD)}
							{rewardTokenEmissionsUSD.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative deposits</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeDepositCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeDepositCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative withdrawals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeWithdrawCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeWithdrawCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative swaps</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeSwapCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeSwapCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Positions</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									positionCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.positionCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Open positions</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									openPositionCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.openPositionCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Closed positions</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									closedPositionCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.closedPositionCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Last snapshot day</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									lastSnapshotDayID: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.lastSnapshotDayID}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Last snapshot hour</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									lastSnapshotHourID: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.lastSnapshotHourID}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Last update timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									lastUpdateTimestamp: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.lastUpdateTimestamp}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Last update block</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									lastUpdateBlockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.lastUpdateBlockNumber}
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
