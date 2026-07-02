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


	// State
	let {
		selection,
		title = 'Nostr reactions',
		typeAnnotationParagraphs = ['A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.'],
		placeholderText = 'Loading Nostr reactions...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrReactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrReaction>
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
				entityType={EntityType.NostrReaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(nostrReactions)}
			{@const uniqueNostrReactions = [...new Map(nostrReactions.values.map((nostrReaction) => [nostrReaction[EntityMetaKey.SelectorKey], nostrReaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrReaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrReactions.values.length === uniqueNostrReactions.length && nostrReactions.totalCount != null && nostrReactions.totalCount >= uniqueNostrReactions.length ? nostrReactions.totalCount : uniqueNostrReactions.length}
				getKey={(nostrReaction) => nostrReaction[EntityMetaKey.SelectorKey]}
				items={uniqueNostrReactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr reactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrReaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrReaction> })}
					<EntityView
						entityType={EntityType.NostrReaction}
						entitySelector={nostrReaction.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const content0 = ({ ...nostrReaction.entitySelector, ...nostrReaction }).content}
							{String((content0) ?? '')}
							{@const eventId1 = ({ ...nostrReaction.entitySelector, ...nostrReaction }).eventId}
							<TruncatedValue value={String(eventId1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const createdAtAfter0 = ({ ...nostrReaction.entitySelector, ...nostrReaction }).createdAt}
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
		entityType={EntityType.NostrReaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
