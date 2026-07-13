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
			selection: EntityProxyResource<typeof schema, EntityType.IbcConnection>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IbcConnection>>
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
	const ibcConnection = $derived(selection({
		fields: {
			state: true,
			clientId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || 'IBC connection')
	const viewDomId = $derived('ibc-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet Pending()}
				{[String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || title || 'IBC connection'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet Pending()}
				{[String((pendingEntity.state) ?? ''), String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || title || 'IBC connection'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.state) ?? ''), String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcConnection}>
			{#snippet Pending()}
				{@const clientId0 = pendingEntity.clientId}
				{#if clientId0 !== undefined && clientId0 !== null}
					<span data-text="muted">
						{String((clientId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const clientId0 = resolvedEntity.clientId}
				{#if clientId0 !== undefined && clientId0 !== null}
					<span data-text="muted">
						{String((clientId0) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionId = pendingEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
						<div>
							<dt>Client ID</dt>
							<dd>
								{String((clientId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientId = resolvedEntity.clientId}
					{#if clientId !== undefined && clientId !== null}
						<div>
							<dt>Client ID</dt>
							<dd>
								{String((clientId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const state = pendingEntity.state}
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
							delayPeriodNs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delayPeriodNs = pendingEntity.delayPeriodNs}
					{#if delayPeriodNs !== undefined && delayPeriodNs !== null}
						<div>
							<dt>Delay period ns</dt>
							<dd>
								{String((delayPeriodNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delayPeriodNs = resolvedEntity.delayPeriodNs}
					{#if delayPeriodNs !== undefined && delayPeriodNs !== null}
						<div>
							<dt>Delay period ns</dt>
							<dd>
								{String((delayPeriodNs) ?? '')}
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
				{#snippet Pending()}
					{@const counterpartyClientId = pendingEntity.counterpartyClientId}
					{#if counterpartyClientId !== undefined && counterpartyClientId !== null}
						<div>
							<dt>Counterparty client ID</dt>
							<dd>
								{String((counterpartyClientId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyClientId = resolvedEntity.counterpartyClientId}
					{#if counterpartyClientId !== undefined && counterpartyClientId !== null}
						<div>
							<dt>Counterparty client ID</dt>
							<dd>
								{String((counterpartyClientId) ?? '')}
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
				{#snippet Pending()}
					{@const counterpartyConnectionId = pendingEntity.counterpartyConnectionId}
					{#if counterpartyConnectionId !== undefined && counterpartyConnectionId !== null}
						<div>
							<dt>Counterparty connection ID</dt>
							<dd>
								{String((counterpartyConnectionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counterpartyConnectionId = resolvedEntity.counterpartyConnectionId}
					{#if counterpartyConnectionId !== undefined && counterpartyConnectionId !== null}
						<div>
							<dt>Counterparty connection ID</dt>
							<dd>
								{String((counterpartyConnectionId) ?? '')}
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
			<IbcChannelsView
				selection={selection.$$channels}
				title='Channels'
				emptyText='No IBC channels.'
				id='IbcChannelsView-channels'
			/>
		{/if}
	{/snippet}
</EntityView>
