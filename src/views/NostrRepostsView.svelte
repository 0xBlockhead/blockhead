<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrRepost>
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
	entityType={EntityType.NostrRepost}
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
				eventId: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrReposts) => [...new Map(nostrReposts.values.map((nostrRepost) => [nostrRepost[EntityMetaKey.SelectorKey], nostrRepost])).values()]}
	getKey={(nostrRepost) => nostrRepost[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.NostrRepost}
			entitySelector={nostrRepost[EntityMetaKey.Selector]}
			href={
				(
					nostrRepost[EntityMetaKey.Selector] != null && 'eventId' in nostrRepost[EntityMetaKey.Selector]
					&& nostrRepost[EntityMetaKey.Selector].eventId != null ?
						resolve('/nostr/repost/[eventId=stringSegment]', {
					eventId: String(nostrRepost[EntityMetaKey.Selector].eventId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((nostrRepostFields.repostedEventId) ?? '')].filter(Boolean).join(' ') || 'Nostr repost'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrRepostFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
