<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Leverage> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const leverage = $derived(selection({
		fields: {
			liquidity: true,
			origin: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.id ?? '') || 'leverage')


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
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.id ?? '') || 'leverage'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={leverage}>
			{#snippet children(entity)}
				{String(entity.liquidity) || pendingEntity.id || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={leverage}>
			{#snippet children(entity)}
				{@const origin0 = entity.origin}
				{#if origin0 != null}
					<span data-text="muted">
						{origin0}
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
					{pendingEntity.id}
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
						{#snippet children(entity)}
							{String(entity.tickLower)}
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
							{String(entity.tickUpper)}
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
							{String(entity.liquidity)}
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
							{String(entity.token0Owed)}
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
							{String(entity.token1Owed)}
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
								{String(tokenId)}
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
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
								prefetched={liquidityPool}
								layout={EntityLayout.Value}
								open={false}
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
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								prefetched={evmAccount}
								layout={EntityLayout.Value}
								open={false}
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
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
