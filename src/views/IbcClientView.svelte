<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.IbcClient> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const ibcClient = $derived(selection({
		fields: {
			clientType: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.clientId ?? '') || 'IBC client')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcConnectionsView from '$/views/IbcConnectionsView.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcClient}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.clientId ?? '') || 'IBC client'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet children(entity)}
				{[(entity.clientType ?? ''), pendingEntity.clientId].filter(Boolean).join(' ') || pendingEntity.clientId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet children(entity)}
				{@const counterpartyChainId0 = entity.counterpartyChainId}
				{#if counterpartyChainId0 != null}
					<span data-text="muted">
						{counterpartyChainId0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Client ID</dt>
				<dd>
					{pendingEntity.clientId}
				</dd>
			</div>

			<ResourceBoundary
				resource={ibcClient}
			>
				{#snippet children(entity)}
					{@const clientType = entity.clientType}
					{#if clientType != null}
						<div>
							<dt>Client type</dt>
							<dd>
								{clientType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							trustLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const trustLevel = entity.trustLevel}
					{#if trustLevel != null}
						<div>
							<dt>Trust level</dt>
							<dd>
								{trustLevel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ibcClient}
			>
				{#snippet children(entity)}
					{@const counterpartyChainId = entity.counterpartyChainId}
					{#if counterpartyChainId != null}
						<div>
							<dt>Counterparty chain ID</dt>
							<dd>
								{counterpartyChainId}
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
							trustingPeriodNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const trustingPeriodNs = entity.trustingPeriodNs}
					{#if trustingPeriodNs != null}
						<div>
							<dt>Trusting period ns</dt>
							<dd>
								{String(trustingPeriodNs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unbondingPeriodNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unbondingPeriodNs = entity.unbondingPeriodNs}
					{#if unbondingPeriodNs != null}
						<div>
							<dt>Unbonding period ns</dt>
							<dd>
								{String(unbondingPeriodNs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxClockDriftNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxClockDriftNs = entity.maxClockDriftNs}
					{#if maxClockDriftNs != null}
						<div>
							<dt>Max clock drift ns</dt>
							<dd>
								{String(maxClockDriftNs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

	{#snippet Details({ open: detailsOpen })}
		{@const ibcClientIbcConnectionsViewConnectionsResource = selection.$$connections}
		<ResourceBoundary
			resource={ibcClientIbcConnectionsViewConnectionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcConnectionsView
						selection={ibcClientIbcConnectionsViewConnectionsResource}
						countResource={ibcClientIbcConnectionsViewConnectionsResource.count}
						title='Connections'
						id='connections'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const ibcClientIbcChannelsViewChannelsResource = selection.$$channels}
		<ResourceBoundary
			resource={ibcClientIbcChannelsViewChannelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcChannelsView
						selection={ibcClientIbcChannelsViewChannelsResource}
						countResource={ibcClientIbcChannelsViewChannelsResource.count}
						title='Channels'
						id='channels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
