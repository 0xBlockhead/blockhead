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
		title = 'AI model versions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiModelVersions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiModelVersion>
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
	entityType={EntityType.AiModelVersion}
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
				versionId: true,
				$model: true,
				revision: true,
				$artifact: true,
				quantization: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiModelVersions) => [...new Map(aiModelVersions.values.map((aiModelVersion) => [aiModelVersion[EntityMetaKey.SelectorKey], aiModelVersion])).values()]}
	getKey={(aiModelVersion) => aiModelVersion[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI model versions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiModelVersion })}
		{@const aiModelVersionFields = { ...aiModelVersion[EntityMetaKey.Selector], ...aiModelVersion }}
		<EntityView
			entityType={EntityType.AiModelVersion}
			entitySelector={aiModelVersion[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiModelVersionFields.versionId) ?? '')].filter(Boolean).join(' ') || [String((aiModelVersionFields.revision) ?? ''), [String((aiModelVersionFields.$artifact.artifactType) ?? '')].filter(Boolean).join(' ') || [String((aiModelVersionFields.$artifact.providerArtifactId) ?? ''), String((aiModelVersionFields.$artifact.ociDigest) ?? ''), String((aiModelVersionFields.$artifact.ipfsCid) ?? ''), String((aiModelVersionFields.$artifact.arweaveId) ?? ''), String((aiModelVersionFields.$artifact.gitObject) ?? ''), String((aiModelVersionFields.$artifact.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ') || 'AI model version'}
			{/snippet}

			{#snippet Value()}
				{[[String((aiModelVersionFields.$model.label) ?? '')].filter(Boolean).join(' ') || [String((aiModelVersionFields.$model.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiModelVersionFields.quantization) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
