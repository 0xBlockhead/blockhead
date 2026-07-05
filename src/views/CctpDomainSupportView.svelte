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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CctpDomainSupport>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CctpDomainSupport>>
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
	const cctpDomainSupport = $derived(selection({
		sources: [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctp_IrisApi,
		],
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || 'CCTP domain support')
	const viewDomId = $derived('cctp-domain-support-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={cctpDomainSupport}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || 'CCTP domain support'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpDomainSupport}>
			{#snippet Pending()}
				{[String((selection.entitySelector.domainId ?? prefetched.domainId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || 'CCTP domain support'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.domainId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cctpDomainSupport}>
			{#snippet Pending()}
				{@const cctpVersion0 = selection.entitySelector.cctpVersion ?? prefetched.cctpVersion}
				{#if cctpVersion0 !== undefined && cctpVersion0 !== null}
					<span data-text="muted">
						{String((cctpVersion0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CCTP version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cctpVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cctpVersion = selection.entitySelector.cctpVersion ?? prefetched.cctpVersion}
							{#if cctpVersion !== undefined && cctpVersion !== null}
								{String((cctpVersion) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									domainId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const domainId = selection.entitySelector.domainId ?? prefetched.domainId}
							{#if domainId !== undefined && domainId !== null}
								{String((domainId) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const name = prefetched.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
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
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
						fields: {
							standardTransferSource: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const standardTransferSource = prefetched.standardTransferSource}
					{#if standardTransferSource !== undefined && standardTransferSource !== null}
						<div>
							<dt>Standard transfer source</dt>
							<dd>
								{standardTransferSource ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							fastTransferSource: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fastTransferSource = prefetched.fastTransferSource}
					{#if fastTransferSource !== undefined && fastTransferSource !== null}
						<div>
							<dt>Fast transfer source</dt>
							<dd>
								{fastTransferSource ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							forwardingDestination: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const forwardingDestination = prefetched.forwardingDestination}
					{#if forwardingDestination !== undefined && forwardingDestination !== null}
						<div>
							<dt>Forwarding destination</dt>
							<dd>
								{forwardingDestination ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									supportedTokens: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const supportedTokens = prefetched.supportedTokens}
							{#if supportedTokens !== undefined && supportedTokens !== null}
								{(supportedTokens?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const supportedTokens = resolvedEntity.supportedTokens}
							{#if supportedTokens !== undefined && supportedTokens !== null}
								{(supportedTokens?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
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
						fields: {
							tokenMessengerAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenMessengerAddress = prefetched.tokenMessengerAddress}
					{#if tokenMessengerAddress !== undefined && tokenMessengerAddress !== null}
						<div>
							<dt>Token messenger address</dt>
							<dd>
								<TruncatedValue value={String((tokenMessengerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							messageTransmitterAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const messageTransmitterAddress = prefetched.messageTransmitterAddress}
					{#if messageTransmitterAddress !== undefined && messageTransmitterAddress !== null}
						<div>
							<dt>Message transmitter address</dt>
							<dd>
								<TruncatedValue value={String((messageTransmitterAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							tokenMinterAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenMinterAddress = prefetched.tokenMinterAddress}
					{#if tokenMinterAddress !== undefined && tokenMinterAddress !== null}
						<div>
							<dt>Token minter address</dt>
							<dd>
								<TruncatedValue value={String((tokenMinterAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<CctpMessagesView
				selection={selection[EntityProxyField]<EntityType.CctpMessage>('$$messages')}
				title='Messages'
				emptyText='No CCTP messages.'
				id='CctpMessagesView-$$messages'
			/>

			<CctpBurnFee_TimestampsView
				selection={selection[EntityProxyField]<EntityType.CctpBurnFee_Timestamp>('$$burnFeeTimestamps')}
				title='Burn fee timestamps'
				emptyText='No CCTP burn fee observations.'
				id='CctpBurnFee_TimestampsView-$$burnFeeTimestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
