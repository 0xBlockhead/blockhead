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
			selection: RegisteredEntityProxyResource<EntityType.BeaconSlot>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BeaconSlot>
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
	const beaconSlot = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived((String((pendingEntity.slot) ?? '') ? 'Slot #' + String((pendingEntity.slot) ?? '') : '') || 'beacon slot')
	const viewDomId = $derived('beacon-slot-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.slot ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'slot' in selection.entitySelector
			&& selection.entitySelector.slot != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
				slot: String(selection.entitySelector.slot ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
					slot: String(selection.entitySelector.slot ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Slot </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$epoch') && prefetched.$epoch != null && prefetched.$epoch[EntityMetaKey.Selector] != null}
			{@const beaconEpoch0 = pendingEntity.$epoch}
			{#if beaconEpoch0 != null && beaconEpoch0[EntityMetaKey.Selector] != null}
				<span data-text="muted">
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, beaconEpoch0[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconEpoch0}
						href={
							(
								beaconEpoch0[EntityMetaKey.Selector] != null && 'epoch' in beaconEpoch0[EntityMetaKey.Selector]
								&& beaconEpoch0[EntityMetaKey.Selector].epoch != null
								&& beaconEpoch0[EntityMetaKey.Selector] != null && '$network' in beaconEpoch0[EntityMetaKey.Selector] ?
									beaconEpoch0[EntityMetaKey.Selector].$network != null && 'caip2' in beaconEpoch0[EntityMetaKey.Selector].$network
									&& beaconEpoch0[EntityMetaKey.Selector].$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
									epoch: String(beaconEpoch0[EntityMetaKey.Selector].epoch ?? ''),
									network: String(caip2StringFromValue(beaconEpoch0[EntityMetaKey.Selector].$network.caip2) ?? ''),
								})
								:
										beaconEpoch0[EntityMetaKey.Selector].$network != null && 'slug' in beaconEpoch0[EntityMetaKey.Selector].$network
										&& beaconEpoch0[EntityMetaKey.Selector].$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
										epoch: String(beaconEpoch0[EntityMetaKey.Selector].epoch ?? ''),
										network: String(beaconEpoch0[EntityMetaKey.Selector].$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconSlot}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$epoch}
					>
						{#snippet children(beaconEpoch)}
							{#if beaconEpoch != null && beaconEpoch[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<BeaconEpochView
									selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
									prefetched={beaconEpoch}
									href={
										(
											beaconEpoch[EntityMetaKey.Selector] != null && 'epoch' in beaconEpoch[EntityMetaKey.Selector]
											&& beaconEpoch[EntityMetaKey.Selector].epoch != null
											&& beaconEpoch[EntityMetaKey.Selector] != null && '$network' in beaconEpoch[EntityMetaKey.Selector] ?
												beaconEpoch[EntityMetaKey.Selector].$network != null && 'caip2' in beaconEpoch[EntityMetaKey.Selector].$network
												&& beaconEpoch[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
												epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
												network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													beaconEpoch[EntityMetaKey.Selector].$network != null && 'slug' in beaconEpoch[EntityMetaKey.Selector].$network
													&& beaconEpoch[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
													epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
													network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							proposerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proposerIndex = resolvedEntity.proposerIndex}
					{#if proposerIndex !== undefined && proposerIndex !== null}
						<div>
							<dt>Proposer index</dt>
							<dd>
								<NumberValue
									value={proposerIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Epoch</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$epoch}
					>
						{#snippet children(beaconEpoch)}
							{#if beaconEpoch != null && beaconEpoch[EntityMetaKey.Selector] != null}
								<BeaconEpochView
									selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
									prefetched={beaconEpoch}
									href={
										(
											beaconEpoch[EntityMetaKey.Selector] != null && 'epoch' in beaconEpoch[EntityMetaKey.Selector]
											&& beaconEpoch[EntityMetaKey.Selector].epoch != null
											&& beaconEpoch[EntityMetaKey.Selector] != null && '$network' in beaconEpoch[EntityMetaKey.Selector] ?
												beaconEpoch[EntityMetaKey.Selector].$network != null && 'caip2' in beaconEpoch[EntityMetaKey.Selector].$network
												&& beaconEpoch[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
												epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
												network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													beaconEpoch[EntityMetaKey.Selector].$network != null && 'slug' in beaconEpoch[EntityMetaKey.Selector].$network
													&& beaconEpoch[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
													epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
													network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
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
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								root: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const root = resolvedEntity.root}
						{#if root !== undefined && root !== null}
							<div>
								<dt>Block root</dt>
								<dd>
									<TruncatedValue value={String((root) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								canonical: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const canonical = resolvedEntity.canonical}
						{#if canonical !== undefined && canonical !== null}
							<div>
								<dt>Canonical</dt>
								<dd>
									{canonical ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								parentRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const parentRoot = resolvedEntity.parentRoot}
						{#if parentRoot !== undefined && parentRoot !== null}
							<div>
								<dt>Parent root</dt>
								<dd>
									<TruncatedValue value={String((parentRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								stateRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const stateRoot = resolvedEntity.stateRoot}
						{#if stateRoot !== undefined && stateRoot !== null}
							<div>
								<dt>State root</dt>
								<dd>
									<TruncatedValue value={String((stateRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								bodyRoot: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const bodyRoot = resolvedEntity.bodyRoot}
						{#if bodyRoot !== undefined && bodyRoot !== null}
							<div>
								<dt>Body root</dt>
								<dd>
									<TruncatedValue value={String((bodyRoot) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								signature: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const signature = resolvedEntity.signature}
						{#if signature !== undefined && signature !== null}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue value={String((signature) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-beacon-slot-consensus'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'beacon-slot-committees',
						label: 'Committees',
						ownsSection: true,
					},
					{
						id: 'beacon-slot-attestations',
						label: 'Attestations',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-consensus'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerBeaconSlotCommittees(_context, Content)}
				{@const beaconSlotConsensusBeaconSlotCommitteesResource = selection.$$beaconCommittees}
				<ResourceBoundary
					resource={beaconSlotConsensusBeaconSlotCommitteesResource}
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

			{#snippet SectionBeaconSlotCommittees({ id, label, open, active })}
				{@const beaconSlotConsensusBeaconSlotCommitteesResource = selection.$$beaconCommittees}
				<ResourceBoundary
					resource={beaconSlotConsensusBeaconSlotCommitteesResource}
				>
					{#snippet children(beaconCommittee)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BeaconCommitteesView
								selection={beaconSlotConsensusBeaconSlotCommitteesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
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

			{#snippet MarkerBeaconSlotAttestations(_context, Content)}
				{@const beaconSlotConsensusBeaconSlotAttestationsResource = selection.$$beaconAttestations}
				<ResourceBoundary
					resource={beaconSlotConsensusBeaconSlotAttestationsResource}
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

			{#snippet SectionBeaconSlotAttestations({ id, label, open, active })}
				{@const beaconSlotConsensusBeaconSlotAttestationsResource = selection.$$beaconAttestations}
				<ResourceBoundary
					resource={beaconSlotConsensusBeaconSlotAttestationsResource}
				>
					{#snippet children(beaconAttestation)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BeaconAttestationsView
								selection={beaconSlotConsensusBeaconSlotAttestationsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
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
			id={viewDomId + '-carousel-beacon-slot-exits'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'beacon-slot-withdrawals',
						label: 'Withdrawals',
						ownsSection: true,
					},
					{
						id: 'beacon-slot-slashings',
						label: 'Slashings',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-exits'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Withdrawals and slashings</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerBeaconSlotWithdrawals(_context, Content)}
				{@const beaconSlotExitsBeaconSlotWithdrawalsResource = selection.$$beaconWithdrawals}
				<ResourceBoundary
					resource={beaconSlotExitsBeaconSlotWithdrawalsResource}
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

			{#snippet SectionBeaconSlotWithdrawals({ id, label, open, active })}
				{@const beaconSlotExitsBeaconSlotWithdrawalsResource = selection.$$beaconWithdrawals}
				<ResourceBoundary
					resource={beaconSlotExitsBeaconSlotWithdrawalsResource}
				>
					{#snippet children(beaconWithdrawal)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BeaconWithdrawalsView
								selection={beaconSlotExitsBeaconSlotWithdrawalsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
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

			{#snippet MarkerBeaconSlotSlashings(_context, Content)}
				{@const beaconSlotExitsBeaconSlotSlashingsResource = selection.$$beaconSlashings}
				<ResourceBoundary
					resource={beaconSlotExitsBeaconSlotSlashingsResource}
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

			{#snippet SectionBeaconSlotSlashings({ id, label, open, active })}
				{@const beaconSlotExitsBeaconSlotSlashingsResource = selection.$$beaconSlashings}
				<ResourceBoundary
					resource={beaconSlotExitsBeaconSlotSlashingsResource}
				>
					{#snippet children(beaconSlashing)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BeaconSlashingsView
								selection={beaconSlotExitsBeaconSlotSlashingsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
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
