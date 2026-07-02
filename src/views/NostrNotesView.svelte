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
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'Nostr notes',
		typeAnnotationParagraphs = ['A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.'],
		placeholderText = 'Loading Nostr notes...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrNotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrNote>
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					content: true,
					eventId: true,
					createdAt: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrNote}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(nostrNotes)}
			{@const uniqueNostrNotes = [...new Map(nostrNotes.values.map((nostrNote) => [nostrNote[EntityMetaKey.SelectorKey], nostrNote])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrNote}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrNotes.values.length === uniqueNostrNotes.length && nostrNotes.totalCount != null && nostrNotes.totalCount >= uniqueNostrNotes.length ? nostrNotes.totalCount : uniqueNostrNotes.length}
				getKey={(nostrNote) => nostrNote[EntityMetaKey.SelectorKey]}
				items={uniqueNostrNotes}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr notes yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrNote }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrNote> })}
					<EntityView
						entityType={EntityType.NostrNote}
						entitySelector={nostrNote.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const content0 = ({ ...nostrNote.entitySelector, ...nostrNote }).content}
							<span data-text="long-text">{String((content0) ?? '')}</span>
							{@const eventId1 = ({ ...nostrNote.entitySelector, ...nostrNote }).eventId}
							<TruncatedValue value={String(eventId1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const createdAtAfter0 = ({ ...nostrNote.entitySelector, ...nostrNote }).createdAt}
							{#if createdAtAfter0 != null}
								<span data-text="muted">
									<Timestamp timestamp={Number(createdAtAfter0)} />
								</span>
							{/if}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.NostrNote}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
