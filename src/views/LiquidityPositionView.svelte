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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LiquidityPosition>>
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

	const liquidityPosition = $derived(selection({
		fields: {
			$pool: true,
			...(open && {
				tickLower: true,
				tickUpper: true,
				tokenId: true,
				origin: true,
				createdAtTimestamp: true,
				$$blocks: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'liquidity position')
	const viewDomId = $derived('liquidity-position-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LiquidityPosition_BlocksView from '$/views/LiquidityPosition_BlocksView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/position/[positionId]', {
			positionId: String(({ ...selection.entitySelector, ...prefetched }).id),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
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
				<dt>Pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LiquidityPool, false>('$pool')}
					>
						{#snippet children(liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, liquidityPool.entitySelector)}
								prefetched={liquidityPool}
								href={
									resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
										chainId: String(liquidityPool.entitySelector.$network.caip2.reference),
										poolId: String(liquidityPool.entitySelector.id),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const tickLower = prefetched.tickLower ?? selection.entitySelector.tickLower}
					{#if tickLower !== undefined && tickLower !== null}
						<div>
							<dt>Tick lower</dt>
							<dd>
								<NumberValue value={Number(tickLower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tickLower = entity.tickLower ?? selection.entitySelector.tickLower ?? prefetched.tickLower}
					{#if tickLower !== undefined && tickLower !== null}
						<div>
							<dt>Tick lower</dt>
							<dd>
								<NumberValue value={Number(tickLower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const tickUpper = prefetched.tickUpper ?? selection.entitySelector.tickUpper}
					{#if tickUpper !== undefined && tickUpper !== null}
						<div>
							<dt>Tick upper</dt>
							<dd>
								<NumberValue value={Number(tickUpper)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tickUpper = entity.tickUpper ?? selection.entitySelector.tickUpper ?? prefetched.tickUpper}
					{#if tickUpper !== undefined && tickUpper !== null}
						<div>
							<dt>Tick upper</dt>
							<dd>
								<NumberValue value={Number(tickUpper)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const tokenId = prefetched.tokenId ?? selection.entitySelector.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								<NumberValue value={Number(tokenId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tokenId = entity.tokenId ?? selection.entitySelector.tokenId ?? prefetched.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								<NumberValue value={Number(tokenId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const origin = prefetched.origin ?? selection.entitySelector.origin}
					{#if origin !== undefined && origin !== null}
						<div>
							<dt>Origin</dt>
							<dd>
								{String((origin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const origin = entity.origin ?? selection.entitySelector.origin ?? prefetched.origin}
					{#if origin !== undefined && origin !== null}
						<div>
							<dt>Origin</dt>
							<dd>
								{String((origin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPosition}>
				{#snippet Pending()}
					{@const createdAtTimestamp = prefetched.createdAtTimestamp ?? selection.entitySelector.createdAtTimestamp}
					{#if createdAtTimestamp !== undefined && createdAtTimestamp !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtTimestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAtTimestamp = entity.createdAtTimestamp ?? selection.entitySelector.createdAtTimestamp ?? prefetched.createdAtTimestamp}
					{#if createdAtTimestamp !== undefined && createdAtTimestamp !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtTimestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<LiquidityPosition_BlocksView
				selection={selection[EntityProxyField]<EntityType.LiquidityPosition_Block>('$$blocks')}
				title='Blocks'
				emptyText='No liquidity position blocks yet.'
				id='LiquidityPosition_BlocksView-$$blocks'
			/>
		{/if}
	{/snippet}
</EntityView>
