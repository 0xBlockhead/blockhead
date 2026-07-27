<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CosmosGovernanceProposal> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cosmosGovernanceProposal = $derived(selection({
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived(([(pendingEntity.title ?? ''), ((pendingEntity.proposalId ?? '') ? 'Proposal ' + (pendingEntity.proposalId ?? '') : '')].filter(Boolean).join(' ')) || 'Cosmos governance proposal')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosGovernanceProposal_TimestampsView from '$/views/CosmosGovernanceProposal_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosGovernanceProposal}>
			{#snippet children(entity)}
				{([(entity.title ?? ''), (pendingEntity.proposalId ? 'Proposal ' + pendingEntity.proposalId : '')].filter(Boolean).join(' ')) || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{((pendingEntity.proposalId ?? '') ? 'Proposal ' + (pendingEntity.proposalId ?? '') : '') || ([(pendingEntity.title ?? ''), ((pendingEntity.proposalId ?? '') ? 'Proposal ' + (pendingEntity.proposalId ?? '') : '')].filter(Boolean).join(' ')) || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Proposal ID</dt>
				<dd>
					{pendingEntity.proposalId}
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosGovernanceProposal}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>Title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadata = entity.metadata}
					{#if metadata != null}
						<div>
							<dt>Metadata</dt>
							<dd>
								{metadata}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						summary: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const summary = entity.summary}
				{#if summary != null && summary !== ''}
					{summary}
				{:else}
					<p data-text="muted">No proposal summary available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cosmosGovernanceProposalCosmosGovernanceProposalTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={cosmosGovernanceProposalCosmosGovernanceProposalTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosGovernanceProposal_TimestampsView
						selection={cosmosGovernanceProposalCosmosGovernanceProposalTimestampsViewTimestampsResource}
						countResource={cosmosGovernanceProposalCosmosGovernanceProposalTimestampsViewTimestampsResource.count}
						title='Lifecycle snapshots'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
