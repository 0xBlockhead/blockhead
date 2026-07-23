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
		title = 'AT Protocol post observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AtprotoPost_Timestamp>
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
	entityType={EntityType.AtprotoPost_Timestamp}
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
				likeCount: true,
				replyCount: true,
				$post: true,
			},
		})
	}
	{countResource}
	getResourceItems={(atprotoPostTimestamps) => [...new Map(atprotoPostTimestamps.values.map((atprotoPostTimestamp) => [atprotoPostTimestamp[EntityMetaKey.SelectorKey], atprotoPostTimestamp])).values()]}
	getKey={(atprotoPostTimestamp) => atprotoPostTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol post observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: atprotoPostTimestamp })}
		{@const atprotoPostTimestampFields = { ...atprotoPostTimestamp[EntityMetaKey.Selector], ...atprotoPostTimestamp }}
		<EntityView
			entityType={EntityType.AtprotoPost_Timestamp}
			entitySelector={atprotoPostTimestamp[EntityMetaKey.Selector]}
			href={
				(
					atprotoPostTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in atprotoPostTimestamp[EntityMetaKey.Selector]
					&& atprotoPostTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& atprotoPostTimestamp[EntityMetaKey.Selector] != null && '$post' in atprotoPostTimestamp[EntityMetaKey.Selector]
					&& atprotoPostTimestamp[EntityMetaKey.Selector].$post != null && 'uri' in atprotoPostTimestamp[EntityMetaKey.Selector].$post
					&& atprotoPostTimestamp[EntityMetaKey.Selector].$post.uri != null ?
						resolve('/atproto/post/[...uri=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(atprotoPostTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					uri: encodeURIComponent(String(atprotoPostTimestamp[EntityMetaKey.Selector].$post.uri ?? '')),
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
				{[String((atprotoPostTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post observation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((atprotoPostTimestampFields.likeCount) ?? '') ? String((atprotoPostTimestampFields.likeCount) ?? '') + ' likes' : ''), (String((atprotoPostTimestampFields.replyCount) ?? '') ? String((atprotoPostTimestampFields.replyCount) ?? '') + ' replies' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
