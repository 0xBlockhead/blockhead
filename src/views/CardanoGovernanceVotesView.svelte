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
		title = 'Cardano governance votes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoGovernanceVotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoGovernanceVote>
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
	entityType={EntityType.CardanoGovernanceVote}
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
				vote: true,
				voterKind: true,
				voterCredential: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoGovernanceVotes) => [...new Map(cardanoGovernanceVotes.values.map((cardanoGovernanceVote) => [cardanoGovernanceVote[EntityMetaKey.SelectorKey], cardanoGovernanceVote])).values()]}
	getKey={(cardanoGovernanceVote) => cardanoGovernanceVote[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano governance votes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoGovernanceVote })}
		{@const cardanoGovernanceVoteFields = { ...cardanoGovernanceVote[EntityMetaKey.Selector], ...cardanoGovernanceVote }}
		<EntityView
			entityType={EntityType.CardanoGovernanceVote}
			entitySelector={cardanoGovernanceVote[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoGovernanceVoteFields.vote) ?? '')].filter(Boolean).join(' ') || 'Cardano governance vote'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoGovernanceVoteFields.voterKind) ?? ''), String((cardanoGovernanceVoteFields.voterCredential) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
