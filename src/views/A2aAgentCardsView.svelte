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
		title = 'A2A agent cards',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentCards-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.A2aAgentCard>
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
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
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
					agentCardUrl: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(a2aAgentCards)}
			{@const uniqueA2aAgentCards = [...new Map(a2aAgentCards.values.map((a2aAgentCard) => [a2aAgentCard[EntityMetaKey.SelectorKey], a2aAgentCard])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aAgentCard}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={a2aAgentCards.totalCount}
				getKey={(a2aAgentCard) => a2aAgentCard[EntityMetaKey.SelectorKey]}
				items={uniqueA2aAgentCards}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No A2A agent cards yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: a2aAgentCard }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.A2aAgentCard> })}
					{@const a2aAgentCardFields = { ...a2aAgentCard[EntityMetaKey.Selector], ...a2aAgentCard }}
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, a2aAgentCard[EntityMetaKey.Selector])}
						prefetched={a2aAgentCardFields}
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
		entityType={EntityType.A2aAgentCard}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
