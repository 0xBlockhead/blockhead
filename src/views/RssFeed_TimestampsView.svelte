<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'RSS feed observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssFeed_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RssFeed_Timestamp>
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
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
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
					$feed: true,
					timestampMs: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(rssFeedTimestamps)}
			{@const uniqueRssFeedTimestamps = [...new Map(rssFeedTimestamps.values.map((rssFeedTimestamp) => [rssFeedTimestamp[EntityMetaKey.SelectorKey], rssFeedTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RssFeed_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={rssFeedTimestamps.totalCount}
				getKey={(rssFeedTimestamp) => rssFeedTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRssFeedTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No RSS feed observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: rssFeedTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RssFeed_Timestamp> })}
					{@const rssFeedTimestampFields = { ...rssFeedTimestamp[EntityMetaKey.Selector], ...rssFeedTimestamp }}
					{@const rssFeedTimestampHrefFields = { ...rssFeedTimestamp, ...rssFeedTimestamp[EntityMetaKey.Selector] }}
					<RssFeed_TimestampView
						selection={select(EntityType.RssFeed_Timestamp, rssFeedTimestamp[EntityMetaKey.Selector])}
						prefetched={rssFeedTimestampFields}
						href={
							(rssFeedTimestampHrefFields.$feed !== undefined && rssFeedTimestampHrefFields.$feed.feedUrl !== undefined && rssFeedTimestampHrefFields.timestampMs !== undefined && rssFeedTimestampHrefFields.source !== undefined ? resolve('/(social)/(rss)/rss/feed/[feedKey]/(feed)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								feedKey: String(rssFeedTimestampHrefFields.$feed.feedUrl ?? ''),
								timestampMs: String(rssFeedTimestampHrefFields.timestampMs ?? ''),
								source: String(rssFeedTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.RssFeed_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
