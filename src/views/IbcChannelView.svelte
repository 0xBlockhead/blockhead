<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.IbcChannel>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.IbcChannel>
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
	const ibcChannel = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			state: true,
			counterpartyChainId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			state: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || 'IBC channel')
	const viewDomId = $derived('ibc-channel-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'state') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{[String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcChannel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'state') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{[String((pendingEntity.state) ?? ''), String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcChannel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.state) ?? ''), String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.channelId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'state') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{@const portId0 = pendingEntity.portId}
			{#if portId0 !== undefined && portId0 !== null}
				<span data-text="muted">
					{String((portId0) ?? '')}
				</span>
			{/if}
			{@const counterpartyChainId1 = pendingEntity.counterpartyChainId}
			{#if counterpartyChainId1 !== undefined && counterpartyChainId1 !== null}
				<span data-text="muted">
					{String((counterpartyChainId1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ibcChannel}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Port ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									portId: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									channelId: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							state: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							ordering: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							counterpartyChainId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							counterpartyPortId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							counterpartyChannelId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							nextSequenceSend: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							nextSequenceReceive: true,
						},
					})
				}
			>
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
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
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
					id='IbcPacketsView-packets'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
