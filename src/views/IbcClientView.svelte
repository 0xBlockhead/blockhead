<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.IbcClient>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IbcClient>>
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
	const ibcClient = $derived(selection({
		fields: {
			clientType: true,
			counterpartyChainId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || 'IBC client')
	const viewDomId = $derived('ibc-client-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={ibcClient}>
			{#snippet Pending()}
				{[String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || title || 'IBC client'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet Pending()}
				{[String((pendingEntity.clientType) ?? ''), String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || title || 'IBC client'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.clientType) ?? ''), String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.clientId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcClient}>
			{#snippet Pending()}
				{@const counterpartyChainId0 = pendingEntity.counterpartyChainId}
				{#if counterpartyChainId0 !== undefined && counterpartyChainId0 !== null}
					<span data-text="muted">
						{String((counterpartyChainId0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Client ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									clientId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const clientId = pendingEntity.clientId}
							{#if clientId !== undefined && clientId !== null}
								{String((clientId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							clientType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientType = pendingEntity.clientType}
					{#if clientType !== undefined && clientType !== null}
						<div>
							<dt>Client type</dt>
							<dd>
								{String((clientType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							trustLevel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const trustLevel = pendingEntity.trustLevel}
					{#if trustLevel !== undefined && trustLevel !== null}
						<div>
							<dt>Trust level</dt>
							<dd>
								{String((trustLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							counterpartyChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const counterpartyChainId = pendingEntity.counterpartyChainId}
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
				{#snippet Pending()}
					{@const trustingPeriodNs = pendingEntity.trustingPeriodNs}
					{#if trustingPeriodNs !== undefined && trustingPeriodNs !== null}
						<div>
							<dt>Trusting period ns</dt>
							<dd>
								{String((trustingPeriodNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							unbondingPeriodNs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unbondingPeriodNs = pendingEntity.unbondingPeriodNs}
					{#if unbondingPeriodNs !== undefined && unbondingPeriodNs !== null}
						<div>
							<dt>Unbonding period ns</dt>
							<dd>
								{String((unbondingPeriodNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							maxClockDriftNs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxClockDriftNs = pendingEntity.maxClockDriftNs}
					{#if maxClockDriftNs !== undefined && maxClockDriftNs !== null}
						<div>
							<dt>Max clock drift ns</dt>
							<dd>
								{String((maxClockDriftNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
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
			<IbcConnectionsView
				selection={
						selection.$$connections({
							count: true,
						})
					}
				title='Connections'
				emptyText='No IBC connections.'
				id='IbcConnectionsView-connections'
			/>

			<IbcChannelsView
				selection={
						selection.$$channels({
							count: true,
						})
					}
				title='Channels'
				emptyText='No IBC channels.'
				id='IbcChannelsView-channels'
			/>
		{/if}
	{/snippet}
</EntityView>
