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
		title = 'AI provider API operations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderApiOperations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AiProviderApiOperation>
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
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
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
					label: true,
					operationKind: true,
					operationId: true,
					pathTemplate: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(aiProviderApiOperations)}
			{@const uniqueAiProviderApiOperations = [...new Map(aiProviderApiOperations.values.map((aiProviderApiOperation) => [aiProviderApiOperation[EntityMetaKey.SelectorKey], aiProviderApiOperation])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiProviderApiOperation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={aiProviderApiOperations.totalCount}
				getKey={(aiProviderApiOperation) => aiProviderApiOperation[EntityMetaKey.SelectorKey]}
				items={uniqueAiProviderApiOperations}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AI provider API operations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: aiProviderApiOperation }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AiProviderApiOperation> })}
					{@const aiProviderApiOperationFields = { ...aiProviderApiOperation[EntityMetaKey.Selector], ...aiProviderApiOperation }}
					<AiProviderApiOperationView
						selection={select(EntityType.AiProviderApiOperation, aiProviderApiOperation[EntityMetaKey.Selector])}
						prefetched={aiProviderApiOperationFields}
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
		entityType={EntityType.AiProviderApiOperation}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
