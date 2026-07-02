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
		title = 'Reddit submission observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Reddit submission observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditLink_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditLink_Timestamp>
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
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
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
					timestampMs: true,
					score: true,
					source: true,
					commentCount: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditLink_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(redditLinkTimestamps)}
			{@const uniqueRedditLinkTimestamps = [...new Map(redditLinkTimestamps.values.map((redditLinkTimestamp) => [redditLinkTimestamp[EntityMetaKey.SelectorKey], redditLinkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditLink_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditLinkTimestamps.values.length === uniqueRedditLinkTimestamps.length && redditLinkTimestamps.totalCount != null && redditLinkTimestamps.totalCount >= uniqueRedditLinkTimestamps.length ? redditLinkTimestamps.totalCount : uniqueRedditLinkTimestamps.length}
				getKey={(redditLinkTimestamp) => redditLinkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRedditLinkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit submission observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditLinkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditLink_Timestamp> })}
					<RedditLink_TimestampView
						href={
							resolve('/(social)/(reddit)/reddit/link/[fullname]/(link)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								fullname: String(({ ...redditLinkTimestamp.entitySelector, ...redditLinkTimestamp }).$link.fullname),
								timestampMs: String(({ ...redditLinkTimestamp.entitySelector, ...redditLinkTimestamp }).timestampMs),
								source: String(({ ...redditLinkTimestamp.entitySelector, ...redditLinkTimestamp }).source),
							})
						}
						selection={select(EntityType.RedditLink_Timestamp, redditLinkTimestamp.entitySelector)}
						prefetched={redditLinkTimestamp}
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
		entityType={EntityType.RedditLink_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
