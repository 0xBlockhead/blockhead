<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'AI relationship claims',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiRelationshipClaims-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AiRelationshipClaim>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AiRelationshipClaimView from '$/views/AiRelationshipClaimView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					relationshipKind: true,
					subjectKind: true,
					objectKind: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(aiRelationshipClaims)}
			{@const uniqueAiRelationshipClaims = [...new Map(aiRelationshipClaims.values.map((aiRelationshipClaim) => [aiRelationshipClaim[EntityMetaKey.SelectorKey], aiRelationshipClaim])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiRelationshipClaim}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={aiRelationshipClaims.totalCount}
				getKey={(aiRelationshipClaim) => aiRelationshipClaim[EntityMetaKey.SelectorKey]}
				items={uniqueAiRelationshipClaims}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AI relationship claims yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: aiRelationshipClaim }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AiRelationshipClaim> })}
					{@const aiRelationshipClaimFields = { ...aiRelationshipClaim[EntityMetaKey.Selector], ...aiRelationshipClaim }}
					<AiRelationshipClaimView
						selection={select(EntityType.AiRelationshipClaim, aiRelationshipClaim[EntityMetaKey.Selector])}
						prefetched={aiRelationshipClaimFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.AiRelationshipClaim}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
