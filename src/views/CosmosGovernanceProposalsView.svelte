<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Governance proposals',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosGovernanceProposals-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CosmosGovernanceProposal>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosGovernanceProposal}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				title: true,
				proposalId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cosmosGovernanceProposals) => [...new Map(cosmosGovernanceProposals.values.map((cosmosGovernanceProposal) => [cosmosGovernanceProposal[EntityMetaKey.SelectorKey], cosmosGovernanceProposal])).values()]}
	getKey={(cosmosGovernanceProposal) => cosmosGovernanceProposal[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos governance proposals yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosGovernanceProposal })}
		{@const cosmosGovernanceProposalFields = { ...cosmosGovernanceProposal[EntityMetaKey.Selector], ...cosmosGovernanceProposal }}
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal}
			entitySelector={cosmosGovernanceProposal[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cosmosGovernanceProposalFields.title) ?? ''), (String((cosmosGovernanceProposalFields.proposalId) ?? '') ? 'Proposal ' + String((cosmosGovernanceProposalFields.proposalId) ?? '') : '')].filter(Boolean).join(' ') || 'Cosmos governance proposal'}
			{/snippet}

			{#snippet Value()}
				{[(String((cosmosGovernanceProposalFields.proposalId) ?? '') ? 'Proposal ' + String((cosmosGovernanceProposalFields.proposalId) ?? '') : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((cosmosGovernanceProposalFields.$network.name) ?? '')].filter(Boolean).join(' ') || [cosmosGovernanceProposalFields.$network.caip2 == null ? '' : String(`${(cosmosGovernanceProposalFields.$network.caip2).namespace}:${(cosmosGovernanceProposalFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
