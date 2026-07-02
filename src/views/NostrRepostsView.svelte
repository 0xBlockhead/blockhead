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
		title = 'Nostr reposts',
		typeAnnotationParagraphs = ['A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.'],
		placeholderText = 'Loading Nostr reposts...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrReposts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrRepost>
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
				entityType={EntityType.NostrRepost}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
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
				totalCount={nostrReposts.values.length === uniqueNostrReposts.length && nostrReposts.totalCount != null && nostrReposts.totalCount >= uniqueNostrReposts.length ? nostrReposts.totalCount : uniqueNostrReposts.length}
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

				{#snippet Item({ item: nostrRepost }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrRepost> })}
					<EntityView
						entityType={EntityType.NostrRepost}
						entitySelector={nostrRepost.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const eventId0 = ({ ...nostrRepost.entitySelector, ...nostrRepost }).eventId}
							<TruncatedValue value={String(eventId0)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const createdAtAfter0 = ({ ...nostrRepost.entitySelector, ...nostrRepost }).createdAt}
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
		entityType={EntityType.NostrRepost}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
