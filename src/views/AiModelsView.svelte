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
		title = 'AI models',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiModels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiModel>
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
	entityType={EntityType.AiModel}
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
				$provider: {
					fields: {
						label: true,
						organizationKind: true,
						providerId: true,
						domain: true,
					},
				},
				providerModelId: true,
				modelFamily: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiModels) => [...new Map(aiModels.values.map((aiModel) => [aiModel[EntityMetaKey.SelectorKey], aiModel])).values()]}
	getKey={(aiModel) => aiModel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI models yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiModel })}
		{@const aiModelFields = { ...aiModel[EntityMetaKey.Selector], ...aiModel }}
		<EntityView
			entityType={EntityType.AiModel}
			entitySelector={aiModel[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiModelFields.label) ?? '')].filter(Boolean).join(' ') || [String((aiModelFields.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model'}
			{/snippet}

			{#snippet Value()}
				{[[String((aiModelFields.$provider.label) ?? '')].filter(Boolean).join(' ') || [String((aiModelFields.$provider.providerId) ?? ''), String((aiModelFields.$provider.domain) ?? '')].filter(Boolean).join(' ') || 'AI model provider'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiModelFields.modelFamily) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
