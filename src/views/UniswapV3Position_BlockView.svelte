<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
			tokensOwed0: true,
			tokensOwed1: true,
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
		Block
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
				showTypeAnnotation={false}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary resource={selection.$owner}>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={uniswapV3PositionBlock}>
				{#snippet children(entity)}
					{#if entity.liquidity != null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={entity.liquidity} />
							</dd>
						</div>
					{/if}

					{#if entity.tokensOwed0 != null}
						<div>
							<dt>Tokens owed 0</dt>
							<dd>
								<NumberValue value={entity.tokensOwed0} />
							</dd>
						</div>
					{/if}

					{#if entity.tokensOwed1 != null}
						<div>
							<dt>Tokens owed 1</dt>
							<dd>
								<NumberValue value={entity.tokensOwed1} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
