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
		title = 'Lifecycle snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosGovernanceProposal_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CosmosGovernanceProposal_Timestamp>
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
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
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
				status: true,
				source: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cosmosGovernanceProposalTimestamps) => [...new Map(cosmosGovernanceProposalTimestamps.values.map((cosmosGovernanceProposalTimestamp) => [cosmosGovernanceProposalTimestamp[EntityMetaKey.SelectorKey], cosmosGovernanceProposalTimestamp])).values()]}
	getKey={(cosmosGovernanceProposalTimestamp) => cosmosGovernanceProposalTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos governance proposal observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosGovernanceProposalTimestamp })}
		{@const cosmosGovernanceProposalTimestampFields = { ...cosmosGovernanceProposalTimestamp[EntityMetaKey.Selector], ...cosmosGovernanceProposalTimestamp }}
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal_Timestamp}
			entitySelector={cosmosGovernanceProposalTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cosmosGovernanceProposalTimestampFields.status) ?? ''), String((cosmosGovernanceProposalTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((cosmosGovernanceProposalTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cosmosGovernanceProposalTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
