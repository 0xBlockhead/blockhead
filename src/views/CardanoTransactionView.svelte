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
			selection: RegisteredEntityProxyResource<EntityType.CardanoTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoTransaction>
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
	const cardanoTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			blockSlot: true,
			fee: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			blockSlot: true,
			fee: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || 'Cardano transaction')
	const viewDomId = $derived('cardano-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoTxInputsView from '$/views/CardanoTxInputsView.svelte'
	import CardanoTxOutputsView from '$/views/CardanoTxOutputsView.svelte'
	import CardanoCertificatesView from '$/views/CardanoCertificatesView.svelte'
	import CardanoScriptWitnessesView from '$/views/CardanoScriptWitnessesView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import CardanoNativeAssetsView from '$/views/CardanoNativeAssetsView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'hash' in selection.entitySelector
			&& selection.entitySelector.hash != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				transactionId: String(selection.entitySelector.hash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(selection.entitySelector.hash ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'blockSlot') && Object.hasOwn(prefetched, 'fee')}
			{[String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'blockSlot') && Object.hasOwn(prefetched, 'fee')}
			{[String((pendingEntity.blockSlot) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.blockSlot) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'blockSlot') && Object.hasOwn(prefetched, 'fee')}
			{@const fee0 = pendingEntity.fee}
			{#if fee0 !== undefined && fee0 !== null}
				<span data-text="muted">
					{String((fee0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee0 = resolvedEntity.fee}
					{#if fee0 !== undefined && fee0 !== null}
						<span data-text="muted">
							{String((fee0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
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
							blockSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSlot = resolvedEntity.blockSlot}
					{#if blockSlot !== undefined && blockSlot !== null}
						<div>
							<dt>block slot</dt>
							<dd>
								{String((blockSlot) ?? '')}
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
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee = resolvedEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
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
							deposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deposit = resolvedEntity.deposit}
					{#if deposit !== undefined && deposit !== null}
						<div>
							<dt>deposit</dt>
							<dd>
								{String((deposit) ?? '')}
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
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								{String((sizeBytes) ?? '')}
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
							validityStartSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validityStartSlot = resolvedEntity.validityStartSlot}
					{#if validityStartSlot !== undefined && validityStartSlot !== null}
						<div>
							<dt>validity start slot</dt>
							<dd>
								{String((validityStartSlot) ?? '')}
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
							ttlSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ttlSlot = resolvedEntity.ttlSlot}
					{#if ttlSlot !== undefined && ttlSlot !== null}
						<div>
							<dt>ttl slot</dt>
							<dd>
								{String((ttlSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-cardano-transaction-activity'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'cardano-transaction-inputs',
								label: 'Inputs',
								ownsSection: true,
							},
							{
								id: 'cardano-transaction-outputs',
								label: 'Outputs',
								ownsSection: true,
							},
							{
								id: 'cardano-transaction-certificates',
								label: 'Certificates',
								ownsSection: true,
							},
							{
								id: 'cardano-transaction-scripts',
								label: 'Scripts',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-activity'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerCardanoTransactionInputs(_context, Content)}
						{@const cardanoTransactionActivityCardanoTransactionInputsResource = selection
		.$$inputs({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionInputsResource}
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

					{#snippet SectionCardanoTransactionInputs({ id, label, open, active })}
						{@const cardanoTransactionActivityCardanoTransactionInputsResource = selection
		.$$inputs({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionInputsResource}
						>
							{#snippet children(cardanoTxInput)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoTxInputsView
										selection={cardanoTransactionActivityCardanoTransactionInputsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No inputs.'
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

					{#snippet MarkerCardanoTransactionOutputs(_context, Content)}
						{@const cardanoTransactionActivityCardanoTransactionOutputsResource = selection
		.$$outputs({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionOutputsResource}
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

					{#snippet SectionCardanoTransactionOutputs({ id, label, open, active })}
						{@const cardanoTransactionActivityCardanoTransactionOutputsResource = selection
		.$$outputs({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionOutputsResource}
						>
							{#snippet children(cardanoTxOutput)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoTxOutputsView
										selection={cardanoTransactionActivityCardanoTransactionOutputsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No outputs.'
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

					{#snippet MarkerCardanoTransactionCertificates(_context, Content)}
						{@const cardanoTransactionActivityCardanoTransactionCertificatesResource = selection
		.$$certificates({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionCertificatesResource}
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

					{#snippet SectionCardanoTransactionCertificates({ id, label, open, active })}
						{@const cardanoTransactionActivityCardanoTransactionCertificatesResource = selection
		.$$certificates({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionCertificatesResource}
						>
							{#snippet children(cardanoCertificate)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoCertificatesView
										selection={cardanoTransactionActivityCardanoTransactionCertificatesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No certificates.'
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

					{#snippet MarkerCardanoTransactionScripts(_context, Content)}
						{@const cardanoTransactionActivityCardanoTransactionScriptsResource = selection
		.$$scripts({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionScriptsResource}
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

					{#snippet SectionCardanoTransactionScripts({ id, label, open, active })}
						{@const cardanoTransactionActivityCardanoTransactionScriptsResource = selection
		.$$scripts({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionActivityCardanoTransactionScriptsResource}
						>
							{#snippet children(cardanoScriptWitness)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoScriptWitnessesView
										selection={cardanoTransactionActivityCardanoTransactionScriptsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No scripts.'
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
					id={viewDomId + '-carousel-cardano-transaction-related'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'cardano-transaction-governance-proposals',
								label: 'Governance Proposals',
								ownsSection: true,
							},
							{
								id: 'cardano-transaction-governance-votes',
								label: 'Governance Votes',
								ownsSection: true,
							},
							{
								id: 'cardano-transaction-assets',
								label: 'Assets',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-related'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Related</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerCardanoTransactionGovernanceProposals(_context, Content)}
						{@const cardanoTransactionRelatedCardanoTransactionGovernanceProposalsResource = selection
		.$$governanceProposals({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionGovernanceProposalsResource}
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

					{#snippet SectionCardanoTransactionGovernanceProposals({ id, label, open, active })}
						{@const cardanoTransactionRelatedCardanoTransactionGovernanceProposalsResource = selection
		.$$governanceProposals({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionGovernanceProposalsResource}
						>
							{#snippet children(cardanoGovernanceProposal)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoGovernanceProposalsView
										selection={cardanoTransactionRelatedCardanoTransactionGovernanceProposalsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No governance proposals.'
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

					{#snippet MarkerCardanoTransactionGovernanceVotes(_context, Content)}
						{@const cardanoTransactionRelatedCardanoTransactionGovernanceVotesResource = selection
		.$$governanceVotes({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionGovernanceVotesResource}
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

					{#snippet SectionCardanoTransactionGovernanceVotes({ id, label, open, active })}
						{@const cardanoTransactionRelatedCardanoTransactionGovernanceVotesResource = selection
		.$$governanceVotes({
			sources: [
				Source.CardanoKoios_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionGovernanceVotesResource}
						>
							{#snippet children(cardanoGovernanceVote)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoGovernanceVotesView
										selection={cardanoTransactionRelatedCardanoTransactionGovernanceVotesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No governance votes.'
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

					{#snippet MarkerCardanoTransactionAssets(_context, Content)}
						{@const cardanoTransactionRelatedCardanoTransactionAssetsResource = selection
		.$$assets({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionAssetsResource}
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

					{#snippet SectionCardanoTransactionAssets({ id, label, open, active })}
						{@const cardanoTransactionRelatedCardanoTransactionAssetsResource = selection
		.$$assets({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
						<ResourceBoundary
							resource={cardanoTransactionRelatedCardanoTransactionAssetsResource}
						>
							{#snippet children(cardanoNativeAsset)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CardanoNativeAssetsView
										selection={cardanoTransactionRelatedCardanoTransactionAssetsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No assets.'
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
