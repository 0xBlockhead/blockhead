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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XPost_Timestamp>
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
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
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
				$post: true,
				timestampMs: true,
			},
		})
	}
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
		{@const selection = select(EntityType.XPost_Timestamp, xPostTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xPostTimestampHrefFields = { ...xPostTimestamp, ...xPostTimestamp[EntityMetaKey.Selector] }}
		<XPost_TimestampView
			selection={selection}
			prefetched={xPostTimestampFields}
			href={
				(xPostTimestampHrefFields.timestampMs !== undefined && xPostTimestampHrefFields.$post !== undefined && xPostTimestampHrefFields.$post.id !== undefined ? resolve('/x/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(xPostTimestampHrefFields.timestampMs ?? ''),
					postId: String(xPostTimestampHrefFields.$post.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
