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
		title = 'AT Protocol post observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoPost_Timestamp>
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
	import AtprotoPost_TimestampView from '$/views/AtprotoPost_TimestampView.svelte'
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
					timestampMs: true,
					likeCount: true,
					replyCount: true,
					$post: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(atprotoPostTimestamps)}
			{@const uniqueAtprotoPostTimestamps = [...new Map(atprotoPostTimestamps.values.map((atprotoPostTimestamp) => [atprotoPostTimestamp[EntityMetaKey.SelectorKey], atprotoPostTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={atprotoPostTimestamps.totalCount}
				getKey={(atprotoPostTimestamp) => atprotoPostTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAtprotoPostTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol post observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: atprotoPostTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AtprotoPost_Timestamp> })}
					{@const atprotoPostTimestampFields = { ...atprotoPostTimestamp[EntityMetaKey.Selector], ...atprotoPostTimestamp }}
					{@const atprotoPostTimestampHrefFields = { ...atprotoPostTimestamp, ...atprotoPostTimestamp[EntityMetaKey.Selector] }}
					<AtprotoPost_TimestampView
						selection={select(EntityType.AtprotoPost_Timestamp, atprotoPostTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={atprotoPostTimestampFields}
						href={
							(atprotoPostTimestampHrefFields.timestampMs !== undefined && atprotoPostTimestampHrefFields.$post !== undefined && atprotoPostTimestampHrefFields.$post.uri !== undefined ? resolve('/atproto/post/[...uri=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
								timestampMs: String(atprotoPostTimestampHrefFields.timestampMs ?? ''),
								uri: String(atprotoPostTimestampHrefFields.$post.uri ?? ''),
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
		entityType={EntityType.AtprotoPost_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
