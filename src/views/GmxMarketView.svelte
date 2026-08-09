<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.GmxMarket> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gmx_Rest,
		],
	}))
	const gmxMarket = $derived(viewSelection({
		fields: {
			name: true,
			longInterestUsd: true,
			shortInterestUsd: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'GMX market')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.GmxMarket}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gmx/market/[marketTokenAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					marketTokenAddress: selection.entitySelector.marketTokenAddress,
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
		<ResourceBoundary resource={gmxMarket}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gmxMarket}>
			{#snippet children(entity)}
				{[(entity.longInterestUsd ?? ''), (entity.shortInterestUsd ?? '')].filter(Boolean).join(' ') || entity.name || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
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
				<dt>Market token address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.marketTokenAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={gmxMarket}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Spot only</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isSpotOnly: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isSpotOnly ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Disabled</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isDisabled: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isDisabled ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Index token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									indexTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.indexTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Long token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									longTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.longTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Short token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									shortTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.shortTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={gmxMarket}
			>
				{#snippet children(entity)}
					{@const longInterestUsd = entity.longInterestUsd}
					{#if longInterestUsd != null}
						<div>
							<dt>Long open interest (USD)</dt>
							<dd>
								{longInterestUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={gmxMarket}
			>
				{#snippet children(entity)}
					{@const shortInterestUsd = entity.shortInterestUsd}
					{#if shortInterestUsd != null}
						<div>
							<dt>Short open interest (USD)</dt>
							<dd>
								{shortInterestUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							longPoolAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const longPoolAmount = entity.longPoolAmount}
					{#if longPoolAmount != null}
						<div>
							<dt>Long pool amount</dt>
							<dd>
								{longPoolAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							shortPoolAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shortPoolAmount = entity.shortPoolAmount}
					{#if shortPoolAmount != null}
						<div>
							<dt>Short pool amount</dt>
							<dd>
								{shortPoolAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fundingFactorPerSecond: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fundingFactorPerSecond = entity.fundingFactorPerSecond}
					{#if fundingFactorPerSecond != null}
						<div>
							<dt>Funding factor per second</dt>
							<dd>
								{fundingFactorPerSecond}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
