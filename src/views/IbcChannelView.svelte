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
	}: Omit<EntitySelectionViewProps<EntityType.IbcChannel>, 'prefetched'> = $props()

	const ibcChannel = $derived(selection({
		fields: {
			state: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.channelId || 'IBC channel')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcPacketsView from '$/views/IbcPacketsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcChannel}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), selection.entitySelector.channelId].filter(Boolean).join(' ') || selection.entitySelector.channelId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet children(entity)}
				<span data-text="muted">
					{selection.entitySelector.portId}
				</span>
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
				<dt>Port ID</dt>
				<dd>
					{selection.entitySelector.portId}
				</dd>
			</div>

			<div>
				<dt>Channel ID</dt>
				<dd>
					{selection.entitySelector.channelId}
				</dd>
			</div>

			<ResourceBoundary
				resource={ibcChannel}
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
							ordering: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ordering = entity.ordering}
					{#if ordering != null}
						<div>
							<dt>Ordering</dt>
							<dd>
								{ordering}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={ibcChannel}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counterpartyPortId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counterpartyPortId = entity.counterpartyPortId}
					{#if counterpartyPortId != null}
						<div>
							<dt>Counterparty port ID</dt>
							<dd>
								{counterpartyPortId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counterpartyChannelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counterpartyChannelId = entity.counterpartyChannelId}
					{#if counterpartyChannelId != null}
						<div>
							<dt>Counterparty channel ID</dt>
							<dd>
								{counterpartyChannelId}
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
							nextSequenceSend: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextSequenceSend = entity.nextSequenceSend}
					{#if nextSequenceSend != null}
						<div>
							<dt>Next sequence send</dt>
							<dd>
								{nextSequenceSend}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextSequenceReceive: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextSequenceReceive = entity.nextSequenceReceive}
					{#if nextSequenceReceive != null}
						<div>
							<dt>Next sequence receive</dt>
							<dd>
								{nextSequenceReceive}
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
		{@const packetsResource = selection.$$packets}
		<ResourceBoundary
			resource={packetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcPacketsView
						selection={packetsResource}
						countResource={packetsResource.count}
						title='Packets'
						id='packets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
