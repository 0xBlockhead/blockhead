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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiProviderApiOperation>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.AiProviderApiOperation}
			entitySelector={aiProviderApiOperation[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiProviderApiOperationFields.label) ?? '')].filter(Boolean).join(' ') || [String((aiProviderApiOperationFields.operationId) ?? '')].filter(Boolean).join(' ') || 'AI provider API operation'}
			{/snippet}

			{#snippet Value()}
				{[String((aiProviderApiOperationFields.operationKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiProviderApiOperationFields.pathTemplate) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
