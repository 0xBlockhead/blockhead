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
		title = 'A2A artifacts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aArtifacts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.A2aArtifact>
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
	entityType={EntityType.A2aArtifact}
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
				name: true,
				$task: {
					fields: {
						taskId: true,
						contextId: true,
						providerTaskId: true,
						updatedAt: true,
					},
				},
				artifactId: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(a2aArtifacts) => [...new Map(a2aArtifacts.values.map((a2aArtifact) => [a2aArtifact[EntityMetaKey.SelectorKey], a2aArtifact])).values()]}
	getKey={(a2aArtifact) => a2aArtifact[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A artifacts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aArtifact })}
		{@const a2aArtifactFields = { ...a2aArtifact[EntityMetaKey.Selector], ...a2aArtifact }}
		<EntityView
			entityType={EntityType.A2aArtifact}
			entitySelector={a2aArtifact[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((a2aArtifactFields.name) ?? '')].filter(Boolean).join(' ') || [String((a2aArtifactFields.artifactId) ?? '')].filter(Boolean).join(' ') || 'A2A artifact'}
			{/snippet}

			{#snippet Value()}
				{[[String((a2aArtifactFields.$task.taskId) ?? '')].filter(Boolean).join(' ') || [String((a2aArtifactFields.$task.providerTaskId) ?? '')].filter(Boolean).join(' ') || 'A2A task'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((a2aArtifactFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
