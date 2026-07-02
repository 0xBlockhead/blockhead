<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition_Block>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LiquidityPosition_Block>>
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

	const liquidityPositionBlock = $derived(selection({
		fields: {
			liquidity: true,
			$owner: true,
			token0Owed: true,
			token1Owed: true,
			feeGrowthInside0LastX128: true,
			feeGrowthInside1LastX128: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity position block')
	const viewDomId = $derived('liquidity-position-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition_Block}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/position/[positionId]/block/[blockNumber=nonNegativeInteger]/[source]', {
			positionId: String(({ ...selection.entitySelector, ...prefetched }).$position.id),
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).blockNumber),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
			{#if blockNumber0 !== undefined && blockNumber0 !== null}
				<NumberValue value={Number(blockNumber0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue value={Number(blockNumber0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue value={Number(blockNumber0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const liquidity0 = ({ ...selection.entitySelector, ...prefetched }).liquidity}
			{#if liquidity0 !== undefined && liquidity0 !== null}
				<NumberValue value={Number(liquidity0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const liquidity0 = ({ ...selection.entitySelector, ...prefetched }).liquidity}
					{#if liquidity0 !== undefined && liquidity0 !== null}
						<NumberValue value={Number(liquidity0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const liquidity0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).liquidity}
					{#if liquidity0 !== undefined && liquidity0 !== null}
						<NumberValue value={Number(liquidity0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<LiquidityPositionView
					selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
					href={
						resolve('/(assets)/position/[positionId]', {
							positionId: String(selection.entitySelector.$position.id),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					<span data-text="muted">
						<LiquidityPositionView
							selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
							href={
								resolve('/(assets)/position/[positionId]', {
									positionId: String(selection.entitySelector.$position.id),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<LiquidityPositionView
							selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
							href={
								resolve('/(assets)/position/[positionId]', {
									positionId: String(selection.entitySelector.$position.id),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={liquidityPositionBlock}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$owner')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const token0Owed = prefetched.token0Owed ?? selection.entitySelector.token0Owed}
					{#if token0Owed !== undefined && token0Owed !== null}
						<div>
							<dt>Token0 owed</dt>
							<dd>
								<NumberValue value={Number(token0Owed)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const token0Owed = entity.token0Owed ?? selection.entitySelector.token0Owed ?? prefetched.token0Owed}
					{#if token0Owed !== undefined && token0Owed !== null}
						<div>
							<dt>Token0 owed</dt>
							<dd>
								<NumberValue value={Number(token0Owed)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const token1Owed = prefetched.token1Owed ?? selection.entitySelector.token1Owed}
					{#if token1Owed !== undefined && token1Owed !== null}
						<div>
							<dt>Token1 owed</dt>
							<dd>
								<NumberValue value={Number(token1Owed)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const token1Owed = entity.token1Owed ?? selection.entitySelector.token1Owed ?? prefetched.token1Owed}
					{#if token1Owed !== undefined && token1Owed !== null}
						<div>
							<dt>Token1 owed</dt>
							<dd>
								<NumberValue value={Number(token1Owed)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const feeGrowthInside0LastX128 = prefetched.feeGrowthInside0LastX128 ?? selection.entitySelector.feeGrowthInside0LastX128}
					{#if feeGrowthInside0LastX128 !== undefined && feeGrowthInside0LastX128 !== null}
						<div>
							<dt>Fee growth inside0 last X128</dt>
							<dd>
								<NumberValue value={Number(feeGrowthInside0LastX128)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feeGrowthInside0LastX128 = entity.feeGrowthInside0LastX128 ?? selection.entitySelector.feeGrowthInside0LastX128 ?? prefetched.feeGrowthInside0LastX128}
					{#if feeGrowthInside0LastX128 !== undefined && feeGrowthInside0LastX128 !== null}
						<div>
							<dt>Fee growth inside0 last X128</dt>
							<dd>
								<NumberValue value={Number(feeGrowthInside0LastX128)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPositionBlock}>
				{#snippet Pending()}
					{@const feeGrowthInside1LastX128 = prefetched.feeGrowthInside1LastX128 ?? selection.entitySelector.feeGrowthInside1LastX128}
					{#if feeGrowthInside1LastX128 !== undefined && feeGrowthInside1LastX128 !== null}
						<div>
							<dt>Fee growth inside1 last X128</dt>
							<dd>
								<NumberValue value={Number(feeGrowthInside1LastX128)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feeGrowthInside1LastX128 = entity.feeGrowthInside1LastX128 ?? selection.entitySelector.feeGrowthInside1LastX128 ?? prefetched.feeGrowthInside1LastX128}
					{#if feeGrowthInside1LastX128 !== undefined && feeGrowthInside1LastX128 !== null}
						<div>
							<dt>Fee growth inside1 last X128</dt>
							<dd>
								<NumberValue value={Number(feeGrowthInside1LastX128)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
