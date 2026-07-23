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
		title = 'AI provider API operation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderApiOperation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiProviderApiOperation_Timestamp>
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
	entityType={EntityType.AiProviderApiOperation_Timestamp}
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
				$operation: {
					fields: {
						label: true,
						operationKind: true,
						pathTemplate: true,
					},
				},
				availabilityStatus: true,
				error: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiProviderApiOperationTimestamps) => [...new Map(aiProviderApiOperationTimestamps.values.map((aiProviderApiOperationTimestamp) => [aiProviderApiOperationTimestamp[EntityMetaKey.SelectorKey], aiProviderApiOperationTimestamp])).values()]}
	getKey={(aiProviderApiOperationTimestamp) => aiProviderApiOperationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI provider API operation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiProviderApiOperationTimestamp })}
		{@const aiProviderApiOperationTimestampFields = { ...aiProviderApiOperationTimestamp[EntityMetaKey.Selector], ...aiProviderApiOperationTimestamp }}
		<EntityView
			entityType={EntityType.AiProviderApiOperation_Timestamp}
			entitySelector={aiProviderApiOperationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((aiProviderApiOperationTimestampFields.$operation.label) ?? '')].filter(Boolean).join(' ') || [String((aiProviderApiOperationTimestampFields.$operation.operationId) ?? '')].filter(Boolean).join(' ') || 'AI provider API operation'].filter(Boolean).join(' ') || 'AI provider API operation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((aiProviderApiOperationTimestampFields.availabilityStatus) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiProviderApiOperationTimestampFields.error) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
