<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AiRelationshipClaim>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AiRelationshipClaimView from '$/views/AiRelationshipClaimView.svelte'
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
		{@const selection = select(EntityType.AiRelationshipClaim, aiRelationshipClaim[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AiRelationshipClaimView
			selection={selection}
			prefetched={aiRelationshipClaimFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
