<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.Leverage>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const leverage = $derived(selection({
		fields: {
			liquidity: true,
			origin: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.id || 'leverage')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/leverage/[id=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					id: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={leverage}>
			{#snippet children(entity)}
				{String(entity.liquidity)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={leverage}>
			{#snippet children(entity)}
				{@const origin = entity.origin}
				{#if origin != null}
					<span data-text="muted">
						{origin}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<ResourceBoundary
				resource={leverage}
			>
				{#snippet children(entity)}
					{@const origin = entity.origin}
					{#if origin != null}
						<div>
							<dt>Origin</dt>
							<dd>
								{origin}
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
				{#snippet children(entity)}
					{@const createdAtTimestamp = entity.createdAtTimestamp}
					{#if createdAtTimestamp != null}
						<div>
							<dt>Created at timestamp</dt>
							<dd>
								<Timestamp timestamp={createdAtTimestamp} />
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
						{#snippet children(entity)}
							{entity.tickLower}
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
						{#snippet children(entity)}
							{entity.tickUpper}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Liquidity</dt>
				<dd>
					<ResourceBoundary
						resource={leverage}
					>
						{#snippet children(entity)}
							{entity.liquidity}
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
						{#snippet children(entity)}
							{entity.token0Owed}
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
						{#snippet children(entity)}
							{entity.token1Owed}
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
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{tokenId}
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
						resource={selection.$pool}
					>
						{#snippet children(liquidityPool)}
							{@const liquidityPoolInitial = untrack(() => liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, (liquidityPool ?? liquidityPoolInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Owner</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$owner}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
