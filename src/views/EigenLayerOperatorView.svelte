<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EigenLayerOperator>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EigenLayerOperator>>
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
	const eigenLayerOperator = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer operator')
	const viewDomId = $derived('eigen-layer-operator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EigenLayerDelegation_TimestampsView from '$/views/EigenLayerDelegation_TimestampsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
	import EigenLayerReward_TimestampsView from '$/views/EigenLayerReward_TimestampsView.svelte'
	import EigenLayerSlashingEventsView from '$/views/EigenLayerSlashingEventsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerOperator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={eigenLayerOperator}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={eigenLayerOperator}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={eigenLayerOperator}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
								}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operator address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									operatorAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operatorAddress = resolvedEntity.operatorAddress}
							{#if operatorAddress !== undefined && operatorAddress !== null}
								<TruncatedValue value={String((operatorAddress) ?? '')} />
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
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
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
							website: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const website = resolvedEntity.website}
					{#if website !== undefined && website !== null}
						<div>
							<dt>website</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(website)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(website)} />
								</svelte:element>
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
							metadataUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataUri = resolvedEntity.metadataUri}
					{#if metadataUri !== undefined && metadataUri !== null}
						<div>
							<dt>metadata URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUri)} />
								</svelte:element>
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
							earningsReceiver: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const earningsReceiver = resolvedEntity.earningsReceiver}
					{#if earningsReceiver !== undefined && earningsReceiver !== null}
						<div>
							<dt>earnings receiver</dt>
							<dd>
								{String((earningsReceiver) ?? '')}
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
							delegationApprover: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegationApprover = resolvedEntity.delegationApprover}
					{#if delegationApprover !== undefined && delegationApprover !== null}
						<div>
							<dt>delegation approver</dt>
							<dd>
								{String((delegationApprover) ?? '')}
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
							stakerOptOutWindowBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakerOptOutWindowBlocks = resolvedEntity.stakerOptOutWindowBlocks}
					{#if stakerOptOutWindowBlocks !== undefined && stakerOptOutWindowBlocks !== null}
						<div>
							<dt>staker opt out window blocks</dt>
							<dd>
								<NumberValue
									value={stakerOptOutWindowBlocks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operatorAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>operator account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									href={
										(evmNetworkAccount[EntityMetaKey.Selector].$actor !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$actor.address !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$network !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
											network: String(caip2StringFromValue(evmNetworkAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : evmNetworkAccount[EntityMetaKey.Selector].$actor !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$actor.address !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$network !== undefined && evmNetworkAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
											network: String(evmNetworkAccount[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-eigenlayer-operator-stake'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'eigenlayer-operator-delegations',
							label: 'Delegations',
						},
						{
							id: 'eigenlayer-operator-allocations',
							label: 'Allocations',
						},
					]
				}
				data-card
				class='network-view-collapsible-stake'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Stake</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEigenlayerOperatorDelegations({ id, label, open })}
					<EigenLayerDelegation_TimestampsView
						selection={selection.$$delegations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EigenLayer delegation observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEigenlayerOperatorAllocations({ id, label, open })}
					<EigenLayerAllocation_TimestampsView
						selection={selection.$$allocations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EigenLayer allocation observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-eigenlayer-operator-economics'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'eigenlayer-operator-rewards',
							label: 'Rewards',
						},
						{
							id: 'eigenlayer-operator-slashing',
							label: 'Slashing events',
						},
					]
				}
				data-card
				class='network-view-collapsible-economics'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Rewards and slashing</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEigenlayerOperatorRewards({ id, label, open })}
					<EigenLayerReward_TimestampsView
						selection={selection.$$rewards}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EigenLayer reward observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEigenlayerOperatorSlashing({ id, label, open })}
					<EigenLayerSlashingEventsView
						selection={selection.$$slashingEvents}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EigenLayer slashing events.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
