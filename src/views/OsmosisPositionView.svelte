<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.OsmosisPosition>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Osmosis_LCD_Rest,
		],
	}))
	const osmosisPosition = $derived(viewSelection({
		fields: {
			liquidity: true,
			tickLower: true,
			tickUpper: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.positionId || 'Osmosis position')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import OsmosisPoolView from '$/views/OsmosisPoolView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.OsmosisPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-position/[positionId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					positionId: selection.entitySelector.positionId,
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
		<ResourceBoundary resource={osmosisPosition}>
			{#snippet children(entity)}
				{[(entity.liquidity ?? ''), (entity.tickLower ?? ''), (entity.tickUpper ?? '')].filter(Boolean).join(' ') || selection.entitySelector.positionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$pool}
		>
			{#snippet children(osmosisPool)}
				{@const osmosisPoolInitial = untrack(() => osmosisPool)}
				<span data-text="muted">
					<OsmosisPoolView
						selection={select(EntityType.OsmosisPool, (osmosisPool ?? osmosisPoolInitial)[EntityMetaKey.Selector])}
						prefetched={osmosisPool ?? osmosisPoolInitial}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Position ID</dt>
				<dd>
					{selection.entitySelector.positionId}
				</dd>
			</div>

			<div>
				<dt>Pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$pool}
					>
						{#snippet children(osmosisPool)}
							{@const osmosisPoolInitial = untrack(() => osmosisPool)}
							<OsmosisPoolView
								selection={select(EntityType.OsmosisPool, (osmosisPool ?? osmosisPoolInitial)[EntityMetaKey.Selector])}
								prefetched={osmosisPool ?? osmosisPoolInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						{@const cosmosAccountInitial = untrack(() => cosmosAccount)}
						<div>
							<dt>Account</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, (cosmosAccount ?? cosmosAccountInitial)[EntityMetaKey.Selector])}
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
				resource={osmosisPosition}
			>
				{#snippet children(entity)}
					{@const tickLower = entity.tickLower}
					{#if tickLower != null}
						<div>
							<dt>Tick lower</dt>
							<dd>
								{tickLower}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={osmosisPosition}
			>
				{#snippet children(entity)}
					{@const tickUpper = entity.tickUpper}
					{#if tickUpper != null}
						<div>
							<dt>Tick upper</dt>
							<dd>
								{tickUpper}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={osmosisPosition}
			>
				{#snippet children(entity)}
					{@const liquidity = entity.liquidity}
					{#if liquidity != null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								{liquidity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							joinTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const joinTime = entity.joinTime}
					{#if joinTime != null}
						<div>
							<dt>Join time</dt>
							<dd>
								{joinTime}
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
							asset0Denom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset0Denom = entity.asset0Denom}
					{#if asset0Denom != null}
						<div>
							<dt>Asset 0 denom</dt>
							<dd>
								{asset0Denom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							asset0Amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset0Amount = entity.asset0Amount}
					{#if asset0Amount != null}
						<div>
							<dt>Asset 0 amount</dt>
							<dd>
								{asset0Amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							asset1Denom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset1Denom = entity.asset1Denom}
					{#if asset1Denom != null}
						<div>
							<dt>Asset 1 denom</dt>
							<dd>
								{asset1Denom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							asset1Amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset1Amount = entity.asset1Amount}
					{#if asset1Amount != null}
						<div>
							<dt>Asset 1 amount</dt>
							<dd>
								{asset1Amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							claimableSpreadRewards: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const claimableSpreadRewards = entity.claimableSpreadRewards}
					{#if claimableSpreadRewards != null}
						<div>
							<dt>Claimable spread rewards</dt>
							<dd>
								{claimableSpreadRewards}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
