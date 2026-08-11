<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.UniswapV3Position_Block>, 'prefetched'> = $props()

	const position = $derived(selection.entitySelector.$position)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
		],
	}))
	const uniswapV3PositionBlock = $derived(viewSelection({
		fields: {
			liquidity: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UniswapV3PositionView from '$/views/UniswapV3PositionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapV3Position_Block}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.blockNumber)}
	href={
		href === undefined ?
			resolve(
				'/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]/(uniswapV3Position)/block/[blockNumber=nonNegativeBigInt]',
				{
					positionManager: position.positionManager,
					tokenId: String(position.tokenId),
					blockNumber: String(selection.entitySelector.blockNumber),
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
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={uniswapV3PositionBlock}>
			{#snippet children(entity)}
				{@const liquidity = entity.liquidity}
				{#if liquidity != null}
					<NumberValue
						value={liquidity}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<UniswapV3PositionView
				selection={select(EntityType.UniswapV3Position, selection.entitySelector.$position)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Position</dt>
				<dd>
					<UniswapV3PositionView
						selection={select(EntityType.UniswapV3Position, selection.entitySelector.$position)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
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
				resource={uniswapV3PositionBlock}
			>
				{#snippet children(entity)}
					{@const liquidity = entity.liquidity}
					{#if liquidity != null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue
									value={liquidity}
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
							tokensOwed0: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokensOwed0 = entity.tokensOwed0}
					{#if tokensOwed0 != null}
						<div>
							<dt>Tokens owed 0</dt>
							<dd>
								<NumberValue
									value={tokensOwed0}
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
							tokensOwed1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokensOwed1 = entity.tokensOwed1}
					{#if tokensOwed1 != null}
						<div>
							<dt>Tokens owed 1</dt>
							<dd>
								<NumberValue
									value={tokensOwed1}
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
							feeGrowthInside0LastX128: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeGrowthInside0LastX128 = entity.feeGrowthInside0LastX128}
					{#if feeGrowthInside0LastX128 != null}
						<div>
							<dt>Fee growth inside 0 last</dt>
							<dd>
								<NumberValue
									value={feeGrowthInside0LastX128}
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
							feeGrowthInside1LastX128: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeGrowthInside1LastX128 = entity.feeGrowthInside1LastX128}
					{#if feeGrowthInside1LastX128 != null}
						<div>
							<dt>Fee growth inside 1 last</dt>
							<dd>
								<NumberValue
									value={feeGrowthInside1LastX128}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
