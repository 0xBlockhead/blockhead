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
			selection: RegisteredEntityProxyResource<EntityType.EigenLayerAvs>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EigenLayerAvs>
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
	const eigenLayerAvs = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
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
	const titleFallback = $derived([String((pendingEntity.avsAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer avs')
	const viewDomId = $derived('eigen-layer-avs-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EigenLayerOperatorsView from '$/views/EigenLayerOperatorsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
	import EigenLayerAvs_TimestampsView from '$/views/EigenLayerAvs_TimestampsView.svelte'
	import EigenLayerSlashingEventsView from '$/views/EigenLayerSlashingEventsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAvs}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eigenLayerAvs}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.avsAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerAvs}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.avsAddress) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerAvs}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
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
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AVS address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									avsAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const avsAddress = resolvedEntity.avsAddress}
							{#if avsAddress !== undefined && avsAddress !== null}
								<TruncatedValue value={String((avsAddress) ?? '')} />
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
			<div>
				<dt>network</dt>
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

			<ResourceBoundary
				resource={selection.$avsAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>AVS account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									href={
										(
											evmNetworkAccount[EntityMetaKey.Selector] != null && '$actor' in evmNetworkAccount[EntityMetaKey.Selector]
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkAccount[EntityMetaKey.Selector].$actor
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor.address != null
											&& evmNetworkAccount[EntityMetaKey.Selector] != null && '$network' in evmNetworkAccount[EntityMetaKey.Selector] ?
												evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkAccount[EntityMetaKey.Selector].$network
												&& evmNetworkAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
												network: String(caip2StringFromValue(evmNetworkAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkAccount[EntityMetaKey.Selector].$network
													&& evmNetworkAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
													network: String(evmNetworkAccount[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-avs-operators'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-avs-operator-list',
						label: 'Operators',
						ownsSection: true,
					},
					{
						id: 'eigenlayer-avs-allocations',
						label: 'Allocations',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-operators'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Operators and allocations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerEigenlayerAvsOperatorList(_context, Content)}
				{@const eigenlayerAvsOperatorsEigenlayerAvsOperatorListResource = selection.$$operators}
				<ResourceBoundary
					resource={eigenlayerAvsOperatorsEigenlayerAvsOperatorListResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEigenlayerAvsOperatorList({ id, label, open, active })}
				{@const eigenlayerAvsOperatorsEigenlayerAvsOperatorListResource = selection.$$operators}
				<ResourceBoundary
					resource={eigenlayerAvsOperatorsEigenlayerAvsOperatorListResource}
				>
					{#snippet children(eigenLayerOperator)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EigenLayerOperatorsView
								selection={eigenlayerAvsOperatorsEigenlayerAvsOperatorListResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No EigenLayer operators.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerEigenlayerAvsAllocations(_context, Content)}
				{@const eigenlayerAvsOperatorsEigenlayerAvsAllocationsResource = selection.$$allocations}
				<ResourceBoundary
					resource={eigenlayerAvsOperatorsEigenlayerAvsAllocationsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEigenlayerAvsAllocations({ id, label, open, active })}
				{@const eigenlayerAvsOperatorsEigenlayerAvsAllocationsResource = selection.$$allocations}
				<ResourceBoundary
					resource={eigenlayerAvsOperatorsEigenlayerAvsAllocationsResource}
				>
					{#snippet children(eigenLayerAllocationTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EigenLayerAllocation_TimestampsView
								selection={eigenlayerAvsOperatorsEigenlayerAvsAllocationsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No EigenLayer allocation observations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-eigenlayer-avs-security'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'eigenlayer-avs-observations',
						label: 'Observations',
						ownsSection: true,
					},
					{
						id: 'eigenlayer-avs-slashing',
						label: 'Slashing events',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-security'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations and slashing</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerEigenlayerAvsObservations(_context, Content)}
				{@const eigenlayerAvsSecurityEigenlayerAvsObservationsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={eigenlayerAvsSecurityEigenlayerAvsObservationsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEigenlayerAvsObservations({ id, label, open, active })}
				{@const eigenlayerAvsSecurityEigenlayerAvsObservationsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={eigenlayerAvsSecurityEigenlayerAvsObservationsResource}
				>
					{#snippet children(eigenLayerAvsTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EigenLayerAvs_TimestampsView
								selection={eigenlayerAvsSecurityEigenlayerAvsObservationsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No EigenLayer AVS observations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerEigenlayerAvsSlashing(_context, Content)}
				{@const eigenlayerAvsSecurityEigenlayerAvsSlashingResource = selection.$$slashingEvents}
				<ResourceBoundary
					resource={eigenlayerAvsSecurityEigenlayerAvsSlashingResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEigenlayerAvsSlashing({ id, label, open, active })}
				{@const eigenlayerAvsSecurityEigenlayerAvsSlashingResource = selection.$$slashingEvents}
				<ResourceBoundary
					resource={eigenlayerAvsSecurityEigenlayerAvsSlashingResource}
				>
					{#snippet children(eigenLayerSlashingEvent)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<EigenLayerSlashingEventsView
								selection={eigenlayerAvsSecurityEigenlayerAvsSlashingResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No EigenLayer slashing events.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
