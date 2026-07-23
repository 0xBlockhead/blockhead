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
		title = 'AI model observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiModel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiModel_Timestamp>
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
	entityType={EntityType.AiModel_Timestamp}
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
				providerDisplayName: true,
				availabilityStatus: true,
				$model: {
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
						modelFamily: true,
					},
				},
				providerLifecycleStatus: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiModelTimestamps) => [...new Map(aiModelTimestamps.values.map((aiModelTimestamp) => [aiModelTimestamp[EntityMetaKey.SelectorKey], aiModelTimestamp])).values()]}
	getKey={(aiModelTimestamp) => aiModelTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI model observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiModelTimestamp })}
		{@const aiModelTimestampFields = { ...aiModelTimestamp[EntityMetaKey.Selector], ...aiModelTimestamp }}
		<EntityView
			entityType={EntityType.AiModel_Timestamp}
			entitySelector={aiModelTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiModelTimestampFields.providerDisplayName) ?? '')].filter(Boolean).join(' ') || [[String((aiModelTimestampFields.$model.label) ?? '')].filter(Boolean).join(' ') || [String((aiModelTimestampFields.$model.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model'].filter(Boolean).join(' ') || 'AI model timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((aiModelTimestampFields.availabilityStatus) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiModelTimestampFields.providerLifecycleStatus) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
