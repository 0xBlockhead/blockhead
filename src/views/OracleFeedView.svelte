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
	}: EntitySelectionViewProps<EntityType.OracleFeed> = $props()

	const oracleFeed = $derived(selection({
		fields: {
			label: true,
			feedKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.address || 'oracle feed')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OracleFeed_TimestampsView from '$/views/OracleFeed_TimestampsView.svelte'
	import OracleFeed_RoundsView from '$/views/OracleFeed_RoundsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.OracleFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={oracleFeed}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeed}>
			{#snippet children(entity)}
				{@const feedKind = entity.feedKind}
				{#if feedKind != null}
					{feedKind}
				{/if}

				<ResourceBoundary
					resource={selection.$market}
				>
					{#snippet children(market)}
						{#if market != null}
							<MarketView
								selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
								prefetched={market}
								href={null}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet children(market)}
					{#if market != null}
						<div>
							<dt>market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={oracleFeed}
			>
				{#snippet children(entity)}
					{@const feedKind = entity.feedKind}
					{#if feedKind != null}
						<div>
							<dt>feed kind</dt>
							<dd>
								{feedKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<OracleFeed_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const roundsResource = selection.$$rounds}
		<ResourceBoundary
			resource={roundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<OracleFeed_RoundsView
						selection={roundsResource}
						countResource={roundsResource.count}
						title='rounds'
						id='rounds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
