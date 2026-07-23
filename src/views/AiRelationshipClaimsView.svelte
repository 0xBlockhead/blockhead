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
		title = 'AI relationship claims',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiRelationshipClaims-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiRelationshipClaim>
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
	entityType={EntityType.AiRelationshipClaim}
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
				relationshipKind: true,
				subjectKind: true,
				objectKind: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiRelationshipClaims) => [...new Map(aiRelationshipClaims.values.map((aiRelationshipClaim) => [aiRelationshipClaim[EntityMetaKey.SelectorKey], aiRelationshipClaim])).values()]}
	getKey={(aiRelationshipClaim) => aiRelationshipClaim[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI relationship claims yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiRelationshipClaim })}
		{@const aiRelationshipClaimFields = { ...aiRelationshipClaim[EntityMetaKey.Selector], ...aiRelationshipClaim }}
		<EntityView
			entityType={EntityType.AiRelationshipClaim}
			entitySelector={aiRelationshipClaim[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiRelationshipClaimFields.relationshipKind) ?? '')].filter(Boolean).join(' ') || 'AI relationship claim'}
			{/snippet}

			{#snippet Value()}
				{[String((aiRelationshipClaimFields.subjectKind) ?? ''), String((aiRelationshipClaimFields.objectKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiRelationshipClaimFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
