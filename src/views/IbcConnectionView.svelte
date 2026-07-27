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
	}: EntitySelectionViewProps<EntityType.IbcConnection> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const ibcConnection = $derived(selection({
		fields: {
			state: true,
			clientId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.connectionId ?? '') || 'IBC connection')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcConnection}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.connectionId ?? '') || 'IBC connection'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), pendingEntity.connectionId].filter(Boolean).join(' ') || pendingEntity.connectionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet children(entity)}
				{@const clientId0 = entity.clientId}
				{#if clientId0 != null}
					<span data-text="muted">
						{clientId0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Connection ID</dt>
				<dd>
					{pendingEntity.connectionId}
				</dd>
			</div>

			<ResourceBoundary
				resource={ibcConnection}
			>
				{#snippet children(entity)}
					{@const clientId = entity.clientId}
					{#if clientId != null}
						<div>
							<dt>Client ID</dt>
							<dd>
								{clientId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ibcConnection}
			>
				{#snippet children(entity)}
					{@const state = entity.state}
					{#if state != null}
						<div>
							<dt>State</dt>
							<dd>
								{state}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delayPeriodNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delayPeriodNs = entity.delayPeriodNs}
					{#if delayPeriodNs != null}
						<div>
							<dt>Delay period ns</dt>
							<dd>
								{String(delayPeriodNs)}
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
							counterpartyClientId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counterpartyClientId = entity.counterpartyClientId}
					{#if counterpartyClientId != null}
						<div>
							<dt>Counterparty client ID</dt>
							<dd>
								{counterpartyClientId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counterpartyConnectionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counterpartyConnectionId = entity.counterpartyConnectionId}
					{#if counterpartyConnectionId != null}
						<div>
							<dt>Counterparty connection ID</dt>
							<dd>
								{counterpartyConnectionId}
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
		{@const ibcConnectionIbcChannelsViewChannelsResource = selection.$$channels}
		<ResourceBoundary
			resource={ibcConnectionIbcChannelsViewChannelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcChannelsView
						selection={ibcConnectionIbcChannelsViewChannelsResource}
						countResource={ibcConnectionIbcChannelsViewChannelsResource.count}
						title='Channels'
						id='channels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
