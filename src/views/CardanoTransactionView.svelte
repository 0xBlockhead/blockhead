<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	}))
	const cardanoTransaction = $derived(viewSelection({
		fields: {
			blockSlot: true,
			fee: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.hash || 'Cardano transaction')
	const viewDomId = $derived('cardano-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.hash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={cardanoTransaction}>
			{#snippet children(entity)}
				{String(entity.blockSlot ?? '') || selection.entitySelector.hash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cardanoTransaction}>
			{#snippet children(entity)}
				{@const fee = entity.fee}
				{#if fee != null}
					<span data-text="muted">
						{fee}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoTransaction}
			>
				{#snippet children(entity)}
					{@const blockSlot = entity.blockSlot}
					{#if blockSlot != null}
						<div>
							<dt>block slot</dt>
							<dd>
								{blockSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={cardanoTransaction}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>fee</dt>
							<dd>
								{fee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deposit = entity.deposit}
					{#if deposit != null}
						<div>
							<dt>deposit</dt>
							<dd>
								{deposit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								{sizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							validityStartSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validityStartSlot = entity.validityStartSlot}
					{#if validityStartSlot != null}
						<div>
							<dt>validity start slot</dt>
							<dd>
								{validityStartSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ttlSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ttlSlot = entity.ttlSlot}
					{#if ttlSlot != null}
						<div>
							<dt>ttl slot</dt>
							<dd>
								{ttlSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCardanoTransactionInputs({ id, label })}
				<CardanoTxInputsView
					selection={selection.$$inputs}
					collapsible={false}
					title={label}
					emptyText='No inputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoTransactionOutputs({ id, label })}
				<CardanoTxOutputsView
					selection={selection.$$outputs}
					collapsible={false}
					title={label}
					emptyText='No outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoTransactionCertificates({ id, label })}
				<CardanoCertificatesView
					selection={selection.$$certificates}
					collapsible={false}
					title={label}
					emptyText='No certificates.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoTransactionScripts({ id, label })}
				<CardanoScriptWitnessesView
					selection={selection.$$scripts}
					collapsible={false}
					title={label}
					emptyText='No scripts.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCardanoTransactionGovernanceProposals({ id, label })}
				<CardanoGovernanceProposalsView
					selection={selection.$$governanceProposals}
					collapsible={false}
					title={label}
					emptyText='No governance proposals.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoTransactionGovernanceVotes({ id, label })}
				<CardanoGovernanceVotesView
					selection={selection.$$governanceVotes}
					collapsible={false}
					title={label}
					emptyText='No governance votes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoTransactionAssets({ id, label })}
				<CardanoNativeAssetsView
					selection={selection.$$assets}
					collapsible={false}
					title={label}
					emptyText='No assets.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
