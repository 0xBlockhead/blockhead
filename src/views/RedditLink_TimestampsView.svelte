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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RedditLink_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
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
		{@const selection = select(EntityType.RedditLink_Timestamp, redditLinkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const redditLinkTimestampHrefFields = { ...redditLinkTimestamp, ...redditLinkTimestamp[EntityMetaKey.Selector] }}
		<RedditLink_TimestampView
			selection={selection}
			prefetched={redditLinkTimestampFields}
			href={
				(redditLinkTimestampHrefFields.timestampMs !== undefined && redditLinkTimestampHrefFields.source !== undefined && redditLinkTimestampHrefFields.$link !== undefined && redditLinkTimestampHrefFields.$link.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(redditLinkTimestampHrefFields.timestampMs ?? ''),
					source: String(redditLinkTimestampHrefFields.source ?? ''),
					fullname: encodeURIComponent(String(redditLinkTimestampHrefFields.$link.fullname ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
