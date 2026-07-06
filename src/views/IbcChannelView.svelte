<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IbcChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IbcChannel>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const ibcChannel = $derived(selection({
		fields: {
			state: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || 'IBC channel')
	const viewDomId = $derived('ibc-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcPacketsView from '$/views/IbcPacketsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcChannel}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet Pending()}
				{[String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || title || 'IBC channel'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet Pending()}
				{[String((prefetched.state) ?? ''), String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.channelId ?? prefetched.channelId) ?? '')].filter(Boolean).join(' ') || title || 'IBC channel'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.state) ?? ''), String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcChannel}>
			{#snippet Pending()}
				{@const portId0 = selection.entitySelector.portId ?? prefetched.portId}
				{#if portId0 !== undefined && portId0 !== null}
					<span data-text="muted">
						{String((portId0) ?? '')}
					</span>
				{/if}
				{@const counterpartyChainId1 = prefetched.counterpartyChainId}
				{#if counterpartyChainId1 !== undefined && counterpartyChainId1 !== null}
					<span data-text="muted">
						{String((counterpartyChainId1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const portId0 = resolvedEntity.portId}
				{#if portId0 !== undefined && portId0 !== null}
					<span data-text="muted">
						{String((portId0) ?? '')}
					</span>
				{/if}
				{@const counterpartyChainId1 = resolvedEntity.counterpartyChainId}
				{#if counterpartyChainId1 !== undefined && counterpartyChainId1 !== null}
					<span data-text="muted">
						{String((counterpartyChainId1) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									portId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const portId = selection.entitySelector.portId ?? prefetched.portId}
							{#if portId !== undefined && portId !== null}
								{String((portId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const portId = resolvedEntity.portId}
							{#if portId !== undefined && portId !== null}
								{String((portId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Channel ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									channelId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const channelId = selection.entitySelector.channelId ?? prefetched.channelId}
							{#if channelId !== undefined && channelId !== null}
								{String((channelId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const channelId = resolvedEntity.channelId}
							{#if channelId !== undefined && channelId !== null}
								{String((channelId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const state = prefetched.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>State</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const state = resolvedEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>State</dt>
							<dd>
								{String((state) ?? '')}
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
				{#snippet Pending()}
					{@const ordering = prefetched.ordering}
					{#if ordering !== undefined && ordering !== null}
						<div>
							<dt>Ordering</dt>
							<dd>
								{String((ordering) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ordering = resolvedEntity.ordering}
					{#if ordering !== undefined && ordering !== null}
						<div>
							<dt>Ordering</dt>
							<dd>
								{String((ordering) ?? '')}
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
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
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
							counterpartyChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const counterpartyChainId = prefetched.counterpartyChainId}
					{#if counterpartyChainId !== undefined && counterpartyChainId !== null}
						<div>
							<dt>Counterparty chain ID</dt>
							<dd>
								{String((counterpartyChainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyChainId = resolvedEntity.counterpartyChainId}
					{#if counterpartyChainId !== undefined && counterpartyChainId !== null}
						<div>
							<dt>Counterparty chain ID</dt>
							<dd>
								{String((counterpartyChainId) ?? '')}
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
				{#snippet Pending()}
					{@const counterpartyPortId = prefetched.counterpartyPortId}
					{#if counterpartyPortId !== undefined && counterpartyPortId !== null}
						<div>
							<dt>Counterparty port ID</dt>
							<dd>
								{String((counterpartyPortId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyPortId = resolvedEntity.counterpartyPortId}
					{#if counterpartyPortId !== undefined && counterpartyPortId !== null}
						<div>
							<dt>Counterparty port ID</dt>
							<dd>
								{String((counterpartyPortId) ?? '')}
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
				{#snippet Pending()}
					{@const counterpartyChannelId = prefetched.counterpartyChannelId}
					{#if counterpartyChannelId !== undefined && counterpartyChannelId !== null}
						<div>
							<dt>Counterparty channel ID</dt>
							<dd>
								{String((counterpartyChannelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyChannelId = resolvedEntity.counterpartyChannelId}
					{#if counterpartyChannelId !== undefined && counterpartyChannelId !== null}
						<div>
							<dt>Counterparty channel ID</dt>
							<dd>
								{String((counterpartyChannelId) ?? '')}
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
				{#snippet Pending()}
					{@const nextSequenceSend = prefetched.nextSequenceSend}
					{#if nextSequenceSend !== undefined && nextSequenceSend !== null}
						<div>
							<dt>Next sequence send</dt>
							<dd>
								{String((nextSequenceSend) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextSequenceSend = resolvedEntity.nextSequenceSend}
					{#if nextSequenceSend !== undefined && nextSequenceSend !== null}
						<div>
							<dt>Next sequence send</dt>
							<dd>
								{String((nextSequenceSend) ?? '')}
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
				{#snippet Pending()}
					{@const nextSequenceReceive = prefetched.nextSequenceReceive}
					{#if nextSequenceReceive !== undefined && nextSequenceReceive !== null}
						<div>
							<dt>Next sequence receive</dt>
							<dd>
								{String((nextSequenceReceive) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextSequenceReceive = resolvedEntity.nextSequenceReceive}
					{#if nextSequenceReceive !== undefined && nextSequenceReceive !== null}
						<div>
							<dt>Next sequence receive</dt>
							<dd>
								{String((nextSequenceReceive) ?? '')}
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
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<IbcPacketsView
				selection={selection[EntityProxyField]<EntityType.IbcPacket>('$$packets')}
				title='Packets'
				emptyText='No IBC packets.'
				id='IbcPacketsView-$$packets'
			/>
		{/if}
	{/snippet}
</EntityView>
