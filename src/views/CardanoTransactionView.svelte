<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoTransaction>>
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
	const cardanoTransaction = $derived(selection({}))
	const titleFallback = $derived('Cardano transaction')
	const viewDomId = $derived('cardano-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoTransaction}>
			{#snippet Pending()}
				{title || 'Cardano transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network, {})}
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
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = pendingEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							blockSlot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockSlot = pendingEntity.blockSlot}
					{#if blockSlot !== undefined && blockSlot !== null}
						<div>
							<dt>block slot</dt>
							<dd>
								{String((blockSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fee = pendingEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							deposit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deposit = pendingEntity.deposit}
					{#if deposit !== undefined && deposit !== null}
						<div>
							<dt>deposit</dt>
							<dd>
								{String((deposit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sizeBytes = pendingEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								{String((sizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							validityStartSlot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validityStartSlot = pendingEntity.validityStartSlot}
					{#if validityStartSlot !== undefined && validityStartSlot !== null}
						<div>
							<dt>validity start slot</dt>
							<dd>
								{String((validityStartSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							ttlSlot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ttlSlot = pendingEntity.ttlSlot}
					{#if ttlSlot !== undefined && ttlSlot !== null}
						<div>
							<dt>ttl slot</dt>
							<dd>
								{String((ttlSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-cardano-transaction-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cardano-transaction-inputs',
							label: 'Inputs',
						},
						{
							id: 'cardano-transaction-outputs',
							label: 'Outputs',
						},
						{
							id: 'cardano-transaction-certificates',
							label: 'Certificates',
						},
						{
							id: 'cardano-transaction-scripts',
							label: 'Scripts',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoTransactionInputs({ id, label, open })}
					<CardanoTxInputsView
						selection={selection.$$inputs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No inputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoTransactionOutputs({ id, label, open })}
					<CardanoTxOutputsView
						selection={selection.$$outputs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No outputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoTransactionCertificates({ id, label, open })}
					<CardanoCertificatesView
						selection={selection.$$certificates}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No certificates.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoTransactionScripts({ id, label, open })}
					<CardanoScriptWitnessesView
						selection={selection.$$scripts}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No scripts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
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
						},
						{
							id: 'cardano-transaction-governance-votes',
							label: 'Governance Votes',
						},
						{
							id: 'cardano-transaction-assets',
							label: 'Assets',
						},
					]
				}
				data-card
				class='network-view-collapsible-related'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCardanoTransactionGovernanceProposals({ id, label, open })}
					<CardanoGovernanceProposalsView
						selection={selection.$$governanceProposals}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No governance proposals.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoTransactionGovernanceVotes({ id, label, open })}
					<CardanoGovernanceVotesView
						selection={selection.$$governanceVotes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No governance votes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCardanoTransactionAssets({ id, label, open })}
					<CardanoNativeAssetsView
						selection={selection.$$assets}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No assets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
