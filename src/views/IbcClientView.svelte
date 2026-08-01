<!-- Generated from APP.ts. -->

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

	const ibcClient = $derived(selection({
		fields: {
			clientType: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.clientId || 'IBC client')


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
	{#snippet Value()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet children(entity)}
				{[(entity.clientType ?? ''), selection.entitySelector.clientId].filter(Boolean).join(' ') || selection.entitySelector.clientId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet children(entity)}
				{@const counterpartyChainId = entity.counterpartyChainId}
				{#if counterpartyChainId != null}
					<span data-text="muted">
						{counterpartyChainId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Client ID</dt>
				<dd>
					{selection.entitySelector.clientId}
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
								{trustingPeriodNs}
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
								{unbondingPeriodNs}
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
								{maxClockDriftNs}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const connectionsResource = selection.$$connections}
		<ResourceBoundary
			resource={connectionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcConnectionsView
						selection={connectionsResource}
						countResource={connectionsResource.count}
						title='Connections'
						id='connections'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const channelsResource = selection.$$channels}
		<ResourceBoundary
			resource={channelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcChannelsView
						selection={channelsResource}
						countResource={channelsResource.count}
						title='Channels'
						id='channels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
