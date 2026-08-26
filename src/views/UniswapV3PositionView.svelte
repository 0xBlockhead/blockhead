<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.UniswapV3Position>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))
	const viewDomId = $derived('uniswap-v3position-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
	import UniswapV3Position_BlocksView from '$/views/UniswapV3Position_BlocksView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapV3Position}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? String(selection.entitySelector.tokenId)}
	href={
		href === undefined ?
			resolve(
				'/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]',
				{
					positionManager: selection.entitySelector.positionManager,
					tokenId: String(selection.entitySelector.tokenId),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.tokenId}
		/>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.positionManager} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Position manager</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.positionManager} />
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.tokenId}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$pool}
			>
				{#snippet children(uniswapV3Pool)}
					{#if uniswapV3Pool != null}
						{@const uniswapV3PoolInitial = untrack(() => uniswapV3Pool)}
						<div>
							<dt>Pool</dt>
							<dd>
								<UniswapV3PoolView
									selection={select(EntityType.UniswapV3Pool, (uniswapV3Pool ?? uniswapV3PoolInitial)[EntityMetaKey.Selector])}
									prefetched={uniswapV3Pool ?? uniswapV3PoolInitial}
									layout={EntityLayout.Value}
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
							tickLower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tickLower = entity.tickLower}
					{#if tickLower != null}
						<div>
							<dt>Tick lower</dt>
							<dd>
								<NumberValue
									value={tickLower}
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
							tickUpper: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tickUpper = entity.tickUpper}
					{#if tickUpper != null}
						<div>
							<dt>Tick upper</dt>
							<dd>
								<NumberValue
									value={tickUpper}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-uniswap-v3-position-state'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'uniswap-v3-position-blocks',
						label: 'Blocks',
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

			{#snippet SectionUniswapV3PositionBlocks({ id, label })}
				<UniswapV3Position_BlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Uniswap V3 position blocks yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
