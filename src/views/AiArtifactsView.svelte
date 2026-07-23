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
		title = 'AI artifacts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiArtifacts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiArtifact>
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
	entityType={EntityType.AiArtifact}
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
				artifactType: true,
				mediaType: true,
				providerArtifactId: true,
				ociDigest: true,
				ipfsCid: true,
				arweaveId: true,
				gitObject: true,
				digest: true,
				size: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiArtifacts) => [...new Map(aiArtifacts.values.map((aiArtifact) => [aiArtifact[EntityMetaKey.SelectorKey], aiArtifact])).values()]}
	getKey={(aiArtifact) => aiArtifact[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI artifacts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiArtifact })}
		{@const aiArtifactFields = { ...aiArtifact[EntityMetaKey.Selector], ...aiArtifact }}
		<EntityView
			entityType={EntityType.AiArtifact}
			entitySelector={aiArtifact[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiArtifactFields.artifactType) ?? '')].filter(Boolean).join(' ') || [String((aiArtifactFields.providerArtifactId) ?? ''), String((aiArtifactFields.ociDigest) ?? ''), String((aiArtifactFields.ipfsCid) ?? ''), String((aiArtifactFields.arweaveId) ?? ''), String((aiArtifactFields.gitObject) ?? ''), String((aiArtifactFields.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet Value()}
				{[String((aiArtifactFields.mediaType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiArtifactFields.size) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
