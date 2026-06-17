<script lang="ts">
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Governance proposals',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.CosmosGovernanceProposal>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosGovernanceProposal}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos governance proposals are SDK governance cosmosGovernanceProposals, separate from ADR design documents.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.CosmosSdk_Rest,
					],
					limit: 32,
				})} placeholderText="Loading proposals…">
				{#snippet children(proposals)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CosmosGovernanceProposal}
				id={`${id}-items`}
				href={href}
				getKey={(proposal) => stringify(proposal.entitySelector)}
				getSortValue={(proposal) => -Number(proposal.entitySelector.proposalId)}
				open={true}
				items={proposals.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No governance proposals listed yet.</p>
				{/snippet}

				{#snippet Item({ item })}
					<CosmosGovernanceProposalView selector={item.entitySelector} layout={EntityLayout.Summary} />
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
