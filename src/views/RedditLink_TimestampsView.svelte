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
		title = 'Reddit submission observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditLink_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditLink_Timestamp>
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
	entityType={EntityType.RedditLink_Timestamp}
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
				timestampMs: true,
				score: true,
				source: true,
				commentCount: true,
				$link: true,
			},
		})
	}
	{countResource}
	getResourceItems={(redditLinkTimestamps) => [...new Map(redditLinkTimestamps.values.map((redditLinkTimestamp) => [redditLinkTimestamp[EntityMetaKey.SelectorKey], redditLinkTimestamp])).values()]}
	getKey={(redditLinkTimestamp) => redditLinkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit submission observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditLinkTimestamp })}
		{@const redditLinkTimestampFields = { ...redditLinkTimestamp[EntityMetaKey.Selector], ...redditLinkTimestamp }}
		<EntityView
			entityType={EntityType.RedditLink_Timestamp}
			entitySelector={redditLinkTimestamp[EntityMetaKey.Selector]}
			href={
				(
					redditLinkTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in redditLinkTimestamp[EntityMetaKey.Selector]
					&& redditLinkTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& redditLinkTimestamp[EntityMetaKey.Selector] != null && 'source' in redditLinkTimestamp[EntityMetaKey.Selector]
					&& redditLinkTimestamp[EntityMetaKey.Selector].source != null
					&& redditLinkTimestamp[EntityMetaKey.Selector] != null && '$link' in redditLinkTimestamp[EntityMetaKey.Selector]
					&& redditLinkTimestamp[EntityMetaKey.Selector].$link != null && 'fullname' in redditLinkTimestamp[EntityMetaKey.Selector].$link
					&& redditLinkTimestamp[EntityMetaKey.Selector].$link.fullname != null ?
						resolve('/reddit/link/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(redditLinkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(redditLinkTimestamp[EntityMetaKey.Selector].source ?? ''),
					fullname: encodeURIComponent(String(redditLinkTimestamp[EntityMetaKey.Selector].$link.fullname ?? '')),
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
				{[String((redditLinkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit submission timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((redditLinkTimestampFields.score) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((redditLinkTimestampFields.source) ?? ''), (String((redditLinkTimestampFields.commentCount) ?? '') ? String((redditLinkTimestampFields.commentCount) ?? '') + ' comments' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
