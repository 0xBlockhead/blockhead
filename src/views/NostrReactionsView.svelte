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
		title = 'Nostr reactions',
		typeAnnotationParagraphs = ['A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrReactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrReaction>
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
	entityType={EntityType.NostrReaction}
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
				content: true,
				eventId: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrReactions) => [...new Map(nostrReactions.values.map((nostrReaction) => [nostrReaction[EntityMetaKey.SelectorKey], nostrReaction])).values()]}
	getKey={(nostrReaction) => nostrReaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr reactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrReaction })}
		{@const nostrReactionFields = { ...nostrReaction[EntityMetaKey.Selector], ...nostrReaction }}
		<EntityView
			entityType={EntityType.NostrReaction}
			entitySelector={nostrReaction[EntityMetaKey.Selector]}
			href={
				(
					nostrReaction[EntityMetaKey.Selector] != null && 'eventId' in nostrReaction[EntityMetaKey.Selector]
					&& nostrReaction[EntityMetaKey.Selector].eventId != null ?
						resolve('/nostr/reaction/[eventId=stringSegment]', {
					eventId: String(nostrReaction[EntityMetaKey.Selector].eventId ?? ''),
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
				{[String((nostrReactionFields.content) ?? '')].filter(Boolean).join(' ') || [String((nostrReactionFields.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr reaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrReactionFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
