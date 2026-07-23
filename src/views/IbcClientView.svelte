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
			selection: RegisteredEntityProxyResource<EntityType.IbcClient>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.IbcClient>
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
	const ibcClient = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			clientType: true,
			counterpartyChainId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			clientType: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || 'IBC client')
	const viewDomId = $derived('ibc-client-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcConnectionsView from '$/views/IbcConnectionsView.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcClient}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'clientType') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{[String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcClient}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'clientType') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{[String((pendingEntity.clientType) ?? ''), String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcClient}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.clientType) ?? ''), String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'clientType') && Object.hasOwn(prefetched, 'counterpartyChainId')}
			{@const counterpartyChainId0 = pendingEntity.counterpartyChainId}
			{#if counterpartyChainId0 !== undefined && counterpartyChainId0 !== null}
				<span data-text="muted">
					{String((counterpartyChainId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ibcClient}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyChainId0 = resolvedEntity.counterpartyChainId}
					{#if counterpartyChainId0 !== undefined && counterpartyChainId0 !== null}
						<span data-text="muted">
							{String((counterpartyChainId0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Client ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									clientId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const clientId = resolvedEntity.clientId}
							{#if clientId !== undefined && clientId !== null}
								{String((clientId) ?? '')}
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
							clientType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientType = resolvedEntity.clientType}
					{#if clientType !== undefined && clientType !== null}
						<div>
							<dt>Client type</dt>
							<dd>
								{String((clientType) ?? '')}
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
							trustLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const trustLevel = resolvedEntity.trustLevel}
					{#if trustLevel !== undefined && trustLevel !== null}
						<div>
							<dt>Trust level</dt>
							<dd>
								{String((trustLevel) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							trustingPeriodNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const trustingPeriodNs = resolvedEntity.trustingPeriodNs}
					{#if trustingPeriodNs !== undefined && trustingPeriodNs !== null}
						<div>
							<dt>Trusting period ns</dt>
							<dd>
								{String((trustingPeriodNs) ?? '')}
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
							unbondingPeriodNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unbondingPeriodNs = resolvedEntity.unbondingPeriodNs}
					{#if unbondingPeriodNs !== undefined && unbondingPeriodNs !== null}
						<div>
							<dt>Unbonding period ns</dt>
							<dd>
								{String((unbondingPeriodNs) ?? '')}
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
							maxClockDriftNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxClockDriftNs = resolvedEntity.maxClockDriftNs}
					{#if maxClockDriftNs !== undefined && maxClockDriftNs !== null}
						<div>
							<dt>Max clock drift ns</dt>
							<dd>
								{String((maxClockDriftNs) ?? '')}
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
					id='IbcConnectionsView-connections'
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
					id='IbcChannelsView-channels'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
