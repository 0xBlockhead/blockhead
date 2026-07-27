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
	}: EntitySelectionViewProps<EntityType.IbcChannel> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const ibcChannel = $derived(selection({
		fields: {
			state: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.channelId ?? '') || 'IBC channel')


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
	{#snippet Title()}
		{(pendingEntity.channelId ?? '') || 'IBC channel'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), pendingEntity.channelId].filter(Boolean).join(' ') || pendingEntity.channelId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet children(entity)}
				<span data-text="muted">
					{pendingEntity.portId}
				</span>
				{@const counterpartyChainId1 = entity.counterpartyChainId}
				{#if counterpartyChainId1 != null}
					<span data-text="muted">
						{counterpartyChainId1}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Port ID</dt>
				<dd>
					{pendingEntity.portId}
				</dd>
			</div>

			<div>
				<dt>Channel ID</dt>
				<dd>
					{pendingEntity.channelId}
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
								{String(nextSequenceSend)}
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
								{String(nextSequenceReceive)}
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
		{@const ibcChannelIbcPacketsViewPacketsResource = selection.$$packets}
		<ResourceBoundary
			resource={ibcChannelIbcPacketsViewPacketsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcPacketsView
						selection={ibcChannelIbcPacketsViewPacketsResource}
						countResource={ibcChannelIbcPacketsViewPacketsResource.count}
						title='Packets'
						id='packets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
