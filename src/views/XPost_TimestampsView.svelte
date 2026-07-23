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
		title = 'X post observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XPost_Timestamp>
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
	entityType={EntityType.XPost_Timestamp}
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
				$post: {
					fields: {
						text: true,
						createdAt: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xPostTimestamps) => [...new Map(xPostTimestamps.values.map((xPostTimestamp) => [xPostTimestamp[EntityMetaKey.SelectorKey], xPostTimestamp])).values()]}
	getKey={(xPostTimestamp) => xPostTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No X post observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xPostTimestamp })}
		{@const xPostTimestampFields = { ...xPostTimestamp[EntityMetaKey.Selector], ...xPostTimestamp }}
		<EntityView
			entityType={EntityType.XPost_Timestamp}
			entitySelector={xPostTimestamp[EntityMetaKey.Selector]}
			href={
				(
					xPostTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in xPostTimestamp[EntityMetaKey.Selector]
					&& xPostTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& xPostTimestamp[EntityMetaKey.Selector] != null && 'source' in xPostTimestamp[EntityMetaKey.Selector]
					&& xPostTimestamp[EntityMetaKey.Selector].source != null
					&& xPostTimestamp[EntityMetaKey.Selector] != null && '$post' in xPostTimestamp[EntityMetaKey.Selector]
					&& xPostTimestamp[EntityMetaKey.Selector].$post != null && 'id' in xPostTimestamp[EntityMetaKey.Selector].$post
					&& xPostTimestamp[EntityMetaKey.Selector].$post.id != null ?
						resolve('/x/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(xPostTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(xPostTimestamp[EntityMetaKey.Selector].source ?? ''),
					postId: String(xPostTimestamp[EntityMetaKey.Selector].$post.id ?? ''),
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
				{[[String((xPostTimestampFields.$post.text) ?? ''), String((xPostTimestampFields.$post.id) ?? '')].filter(Boolean).join(' ') || 'X post'].filter(Boolean).join(' ') || 'X post observation'}
			{/snippet}

			{#snippet Value()}
				{[String((xPostTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((xPostTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
