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
			selection: RegisteredEntityProxyResource<EntityType.CctpDomainSupport>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CctpDomainSupport>
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
	const cctpDomainSupport = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'CCTP domain support')
	const viewDomId = $derived('cctp-domain-support-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpMessagesView from '$/views/CctpMessagesView.svelte'
	import CctpBurnFee_TimestampsView from '$/views/CctpBurnFee_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpDomainSupport}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cctpDomainSupport}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.domainId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cctpDomainSupport}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.domainId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name')}
			{@const cctpVersion0 = pendingEntity.cctpVersion}
			{#if cctpVersion0 !== undefined && cctpVersion0 !== null}
				<span data-text="muted">
					{String((cctpVersion0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cctpDomainSupport}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cctpVersion0 = resolvedEntity.cctpVersion}
					{#if cctpVersion0 !== undefined && cctpVersion0 !== null}
						<span data-text="muted">
							{String((cctpVersion0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CCTP version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									cctpVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cctpVersion = resolvedEntity.cctpVersion}
							{#if cctpVersion !== undefined && cctpVersion !== null}
								{String((cctpVersion) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Domain ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									domainId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const domainId = resolvedEntity.domainId}
							{#if domainId !== undefined && domainId !== null}
								{String((domainId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
							standardTransferSource: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const standardTransferSource = resolvedEntity.standardTransferSource}
					{#if standardTransferSource !== undefined && standardTransferSource !== null}
						<div>
							<dt>Standard transfer source</dt>
							<dd>
								{standardTransferSource ? 'Yes' : 'No'}
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
							fastTransferSource: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fastTransferSource = resolvedEntity.fastTransferSource}
					{#if fastTransferSource !== undefined && fastTransferSource !== null}
						<div>
							<dt>Fast transfer source</dt>
							<dd>
								{fastTransferSource ? 'Yes' : 'No'}
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
							forwardingDestination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const forwardingDestination = resolvedEntity.forwardingDestination}
					{#if forwardingDestination !== undefined && forwardingDestination !== null}
						<div>
							<dt>Forwarding destination</dt>
							<dd>
								{forwardingDestination ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Supported tokens</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									supportedTokens: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const supportedTokens = resolvedEntity.supportedTokens}
							{#if supportedTokens !== undefined && supportedTokens !== null}
								{supportedTokens.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenMessengerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenMessengerAddress = resolvedEntity.tokenMessengerAddress}
					{#if tokenMessengerAddress !== undefined && tokenMessengerAddress !== null}
						<div>
							<dt>Token messenger address</dt>
							<dd>
								<TruncatedValue value={String((tokenMessengerAddress) ?? '')} />
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
							messageTransmitterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageTransmitterAddress = resolvedEntity.messageTransmitterAddress}
					{#if messageTransmitterAddress !== undefined && messageTransmitterAddress !== null}
						<div>
							<dt>Message transmitter address</dt>
							<dd>
								<TruncatedValue value={String((messageTransmitterAddress) ?? '')} />
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
							tokenMinterAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenMinterAddress = resolvedEntity.tokenMinterAddress}
					{#if tokenMinterAddress !== undefined && tokenMinterAddress !== null}
						<div>
							<dt>Token minter address</dt>
							<dd>
								<TruncatedValue value={String((tokenMinterAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cctpDomainSupportCctpMessagesViewMessagesResource = selection.$$messages}
		<ResourceBoundary
			resource={cctpDomainSupportCctpMessagesViewMessagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<CctpMessagesView
					selection={cctpDomainSupportCctpMessagesViewMessagesResource}
					countResource={cctpDomainSupportCctpMessagesViewMessagesResource.count}
					title='Messages'
					id='CctpMessagesView-messages'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource = selection.$$burnFeeTimestamps}
		<ResourceBoundary
			resource={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<CctpBurnFee_TimestampsView
					selection={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource}
					countResource={cctpDomainSupportCctpBurnFeeTimestampsViewBurnFeeTimestampsResource.count}
					title='Burn fee timestamps'
					id='CctpBurnFee_TimestampsView-burn-fee-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
