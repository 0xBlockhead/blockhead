<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.LiquidityPool> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Dexscreener_OpenApi,
		],
	}))
	const titleFallback = $derived((pendingEntity.id ?? '') || 'liquidity pool')
	const viewDomId = $derived('liquidity-pool-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import LiquidityPool_BlocksView from '$/views/LiquidityPool_BlocksView.svelte'
	import LeveragesView from '$/views/LeveragesView.svelte'
	import LiquidityPool_TimestampsView from '$/views/LiquidityPool_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			'caip2' in selection.entitySelector.$network ?
				resolve(
					'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
					{
						chainId: String(selection.entitySelector.$network.caip2.reference),
						poolId: String(selection.entitySelector.id),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.id} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.id} />
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
				<dt>ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.id} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$baseToken}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Base token</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$quoteToken}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Quote token</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$hooks}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Hooks</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue
									value={fee}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tickSpacing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tickSpacing = entity.tickSpacing}
					{#if tickSpacing != null}
						<div>
							<dt>Tick spacing</dt>
							<dd>
								<NumberValue
									value={tickSpacing}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							v4PoolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const v4PoolId = entity.v4PoolId}
					{#if v4PoolId != null}
						<div>
							<dt>v4 pool ID</dt>
							<dd>
								<TruncatedValue value={v4PoolId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-liquidity-pool-state'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'liquidity-pool-blocks',
						label: 'Blocks',
					},
					{
						id: 'liquidity-pool-leverages',
						label: 'Leverage positions',
					},
				]
			}
			data-card
			class='network-view-collapsible-state'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>State</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLiquidityPoolBlocks({ id, label, open })}
				<LiquidityPool_BlocksView
					selection={selection.$$blocks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No liquidity pool blocks yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLiquidityPoolLeverages({ id, label, open })}
				<LeveragesView
					selection={selection.$$leverages}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No leverage positions yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-liquidity-pool-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'liquidity-pool-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLiquidityPoolTimestamps({ id, label, open })}
				<LiquidityPool_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No liquidity pool observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
