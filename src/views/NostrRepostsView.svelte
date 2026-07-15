<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Nostr reposts',
		typeAnnotationParagraphs = ['A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrReposts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrRepost>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					eventId: true,
					createdAt: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRepost}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(nostrReposts)}
			{@const uniqueNostrReposts = [...new Map(nostrReposts.values.map((nostrRepost) => [nostrRepost[EntityMetaKey.SelectorKey], nostrRepost])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRepost}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrReposts.totalCount}
				getKey={(nostrRepost) => nostrRepost[EntityMetaKey.SelectorKey]}
				items={uniqueNostrReposts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr reposts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrRepost })}
					{@const nostrRepostFields = { ...nostrRepost[EntityMetaKey.Selector], ...nostrRepost }}
					{@const selection = select(EntityType.NostrRepost, nostrRepost[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const nostrRepostHrefFields = { ...nostrRepost, ...nostrRepost[EntityMetaKey.Selector] }}
					<NostrRepostView
						selection={selection}
						prefetched={nostrRepostFields}
						href={
							(nostrRepostHrefFields.eventId !== undefined ? resolve('/nostr/repost/[eventId=stringSegment]', {
								eventId: String(nostrRepostHrefFields.eventId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.NostrRepost}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
