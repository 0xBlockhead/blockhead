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
			selection: EntityProxyResource<typeof schema, EntityType.Leverage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Leverage>>
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
	const leverage = $derived(selection({
		fields: {
			liquidity: true,
			origin: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'leverage')
	const viewDomId = $derived('leverage-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={leverage}>
			{#snippet Pending()}
				{[String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'leverage'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={leverage}>
			{#snippet Pending()}
				{[String((prefetched.liquidity) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'leverage'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.liquidity) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={leverage}>
			{#snippet Pending()}
				{@const origin0 = prefetched.origin}
				{#if origin0 !== undefined && origin0 !== null}
					<span data-text="muted">
						{String((origin0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const origin0 = resolvedEntity.origin}
				{#if origin0 !== undefined && origin0 !== null}
					<span data-text="muted">
						{String((origin0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							origin: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const origin = prefetched.origin}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const origin = resolvedEntity.origin}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAtTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAtTimestamp = prefetched.createdAtTimestamp}
					{#if createdAtTimestamp !== undefined && createdAtTimestamp !== null}
						<div>
							<dt>Created at timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtTimestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAtTimestamp = resolvedEntity.createdAtTimestamp}
					{#if createdAtTimestamp !== undefined && createdAtTimestamp !== null}
						<div>
							<dt>Created at timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtTimestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Tick lower</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tickLower: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tickLower = prefetched.tickLower}
							{#if tickLower !== undefined && tickLower !== null}
								{String((tickLower) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tickLower = resolvedEntity.tickLower}
							{#if tickLower !== undefined && tickLower !== null}
								{String((tickLower) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tick upper</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tickUpper: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tickUpper = prefetched.tickUpper}
							{#if tickUpper !== undefined && tickUpper !== null}
								{String((tickUpper) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tickUpper = resolvedEntity.tickUpper}
							{#if tickUpper !== undefined && tickUpper !== null}
								{String((tickUpper) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Liquidity</dt>
				<dd>
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
								{String((liquidity) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const liquidity = resolvedEntity.liquidity}
							{#if liquidity !== undefined && liquidity !== null}
								{String((liquidity) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Token0 owed</dt>
				<dd>
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
								{String((token0Owed) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const token0Owed = resolvedEntity.token0Owed}
							{#if token0Owed !== undefined && token0Owed !== null}
								{String((token0Owed) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Token1 owed</dt>
				<dd>
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
								{String((token1Owed) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const token1Owed = resolvedEntity.token1Owed}
							{#if token1Owed !== undefined && token1Owed !== null}
								{String((token1Owed) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenId = prefetched.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenId = resolvedEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LiquidityPool, false>('$pool')}
					>
						{#snippet children(liquidityPool)}
							{#if liquidityPool[EntityMetaKey.Selector] != null}
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									prefetched={liquidityPool}
									href={
										(({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).$network !== undefined && ({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).$network.caip2 !== undefined && ({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).$network.caip2.reference !== undefined && ({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).id !== undefined ? resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
											chainId: String(({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).$network.caip2.reference ?? ''),
											poolId: String(({ ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }).id ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Owner</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$owner')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
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
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
