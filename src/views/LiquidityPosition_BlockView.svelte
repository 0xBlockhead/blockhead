<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const liquidityPositionBlock = $derived(selection({
		fields: {
			liquidity: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity position block')
	const viewDomId = $derived('liquidity-position-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition_Block}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$position !== undefined && pendingEntity.$position.id !== undefined && pendingEntity.blockNumber !== undefined && pendingEntity.source !== undefined ? resolve('/(assets)/position/[positionId]/block/[blockNumber=nonNegativeInteger]/[source]', {
			positionId: String(pendingEntity.$position.id ?? ''),
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={liquidityPositionBlock}>
			{#snippet Pending()}
				{@const blockNumber0 = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockNumber0 = resolvedEntity.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPositionBlock}>
			{#snippet Pending()}
				{@const liquidity0 = prefetched.liquidity}
				{#if liquidity0 !== undefined && liquidity0 !== null}
					<NumberValue value={Number(liquidity0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const liquidity0 = resolvedEntity.liquidity}
				{#if liquidity0 !== undefined && liquidity0 !== null}
					<NumberValue value={Number(liquidity0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={liquidityPositionBlock}>
			{#snippet Pending()}
				<span data-text="muted">
					<LiquidityPositionView
						selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
						href={
							(selection.entitySelector.$position.id !== undefined ? resolve('/(assets)/position/[positionId]', {
								positionId: String(selection.entitySelector.$position.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<LiquidityPositionView
						selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
						href={
							(selection.entitySelector.$position.id !== undefined ? resolve('/(assets)/position/[positionId]', {
								positionId: String(selection.entitySelector.$position.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Position</dt>
				<dd>
					<LiquidityPositionView
						selection={select(EntityType.LiquidityPosition, selection.entitySelector.$position)}
						href={
							(selection.entitySelector.$position.id !== undefined ? resolve('/(assets)/position/[positionId]', {
								positionId: String(selection.entitySelector.$position.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
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
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(({ ...evmAccount[EntityMetaKey.Selector], ...evmAccount }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
							liquidity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const liquidity = prefetched.liquidity}
					{#if liquidity !== undefined && liquidity !== null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={Number(liquidity)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liquidity = resolvedEntity.liquidity}
					{#if liquidity !== undefined && liquidity !== null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={Number(liquidity)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							token0Owed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const token0Owed = prefetched.token0Owed}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const token0Owed = resolvedEntity.token0Owed}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							token1Owed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const token1Owed = prefetched.token1Owed}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const token1Owed = resolvedEntity.token1Owed}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeGrowthInside0LastX128: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeGrowthInside0LastX128 = prefetched.feeGrowthInside0LastX128}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeGrowthInside0LastX128 = resolvedEntity.feeGrowthInside0LastX128}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeGrowthInside1LastX128: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeGrowthInside1LastX128 = prefetched.feeGrowthInside1LastX128}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeGrowthInside1LastX128 = resolvedEntity.feeGrowthInside1LastX128}
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
