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
		title = 'AI provider API operations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderApiOperations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AiProviderApiOperation>
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
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderApiOperation}
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
				label: true,
				operationKind: true,
				operationId: true,
				pathTemplate: true,
			},
		})
	}
	getResourceItems={(aiProviderApiOperations) => [...new Map(aiProviderApiOperations.values.map((aiProviderApiOperation) => [aiProviderApiOperation[EntityMetaKey.SelectorKey], aiProviderApiOperation])).values()]}
	getKey={(aiProviderApiOperation) => aiProviderApiOperation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI provider API operations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiProviderApiOperation })}
		{@const aiProviderApiOperationFields = { ...aiProviderApiOperation[EntityMetaKey.Selector], ...aiProviderApiOperation }}
		{@const selection = select(EntityType.AiProviderApiOperation, aiProviderApiOperation[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AiProviderApiOperationView
			selection={selection}
			prefetched={aiProviderApiOperationFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
