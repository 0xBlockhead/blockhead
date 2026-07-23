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
		title = 'Nostr article events',
		typeAnnotationParagraphs = ['One cryptographically signed kind-30023 version of a stable Nostr article coordinate.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrArticleEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrArticleEvent>
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
	entityType={EntityType.NostrArticleEvent}
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
				title: true,
				identifier: true,
				eventId: true,
				createdAt: true,
				sensitive: true,
				contentWarning: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrArticleEvents) => [...new Map(nostrArticleEvents.values.map((nostrArticleEvent) => [nostrArticleEvent[EntityMetaKey.SelectorKey], nostrArticleEvent])).values()]}
	getKey={(nostrArticleEvent) => nostrArticleEvent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr article events yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrArticleEvent })}
		{@const nostrArticleEventFields = { ...nostrArticleEvent[EntityMetaKey.Selector], ...nostrArticleEvent }}
		<EntityView
			entityType={EntityType.NostrArticleEvent}
			entitySelector={nostrArticleEvent[EntityMetaKey.Selector]}
			href={
				(
					nostrArticleEvent[EntityMetaKey.Selector] != null && 'eventId' in nostrArticleEvent[EntityMetaKey.Selector]
					&& nostrArticleEvent[EntityMetaKey.Selector].eventId != null ?
						resolve('/nostr/article-version/[eventId=stringSegment]', {
					eventId: String(nostrArticleEvent[EntityMetaKey.Selector].eventId ?? ''),
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
				{[String((nostrArticleEventFields.title) ?? ''), String((nostrArticleEventFields.identifier) ?? '')].filter(Boolean).join(' ') || [String((nostrArticleEventFields.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr article event'}
			{/snippet}

			{#snippet Value()}
				{[String((nostrArticleEventFields.eventId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrArticleEventFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
