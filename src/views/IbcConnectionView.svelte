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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IbcConnection>, 'prefetched'> = $props()

	const ibcConnection = $derived(selection({
		fields: {
			state: true,
			clientId: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.connectionId || 'IBC connection')


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
	{#snippet Value()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), selection.entitySelector.connectionId].filter(Boolean).join(' ') || selection.entitySelector.connectionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet children(entity)}
				{@const clientId = entity.clientId}
				{#if clientId != null}
					<span data-text="muted">
						{clientId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
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
								{delayPeriodNs}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
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
