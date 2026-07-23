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
		title = 'Local media ingests',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLocalMediaIngests-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLocalMediaIngest>
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
	entityType={EntityType.BlockheadLocalMediaIngest}
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
				fileName: true,
				mimeType: true,
				ingestId: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLocalMediaIngests) => [...new Map(blockheadLocalMediaIngests.values.map((blockheadLocalMediaIngest) => [blockheadLocalMediaIngest[EntityMetaKey.SelectorKey], blockheadLocalMediaIngest])).values()]}
	getKey={(blockheadLocalMediaIngest) => blockheadLocalMediaIngest[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Local media ingests yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLocalMediaIngest })}
		{@const blockheadLocalMediaIngestFields = { ...blockheadLocalMediaIngest[EntityMetaKey.Selector], ...blockheadLocalMediaIngest }}
		<EntityView
			entityType={EntityType.BlockheadLocalMediaIngest}
			entitySelector={blockheadLocalMediaIngest[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLocalMediaIngestFields.fileName) ?? '')].filter(Boolean).join(' ') || [String((blockheadLocalMediaIngestFields.ingestId) ?? '')].filter(Boolean).join(' ') || 'local media ingest'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLocalMediaIngestFields.mimeType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLocalMediaIngestFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
