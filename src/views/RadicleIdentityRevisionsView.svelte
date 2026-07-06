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
		title = 'Radicle identity revisions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RadicleIdentityRevisions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RadicleIdentityRevision>
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
	import RadicleIdentityRevisionView from '$/views/RadicleIdentityRevisionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RadicleIdentityRevision}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(radicleIdentityRevisions)}
			{@const uniqueRadicleIdentityRevisions = [...new Map(radicleIdentityRevisions.values.map((radicleIdentityRevision) => [radicleIdentityRevision[EntityMetaKey.SelectorKey], radicleIdentityRevision])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RadicleIdentityRevision}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={radicleIdentityRevisions.totalCount}
				getKey={(radicleIdentityRevision) => radicleIdentityRevision[EntityMetaKey.SelectorKey]}
				items={uniqueRadicleIdentityRevisions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Radicle identity revisions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: radicleIdentityRevision }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RadicleIdentityRevision> })}
					{@const radicleIdentityRevisionFields = { ...radicleIdentityRevision[EntityMetaKey.Selector], ...radicleIdentityRevision }}
					<RadicleIdentityRevisionView
						selection={select(EntityType.RadicleIdentityRevision, radicleIdentityRevision[EntityMetaKey.Selector])}
						prefetched={radicleIdentityRevisionFields}
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
		entityType={EntityType.RadicleIdentityRevision}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
