<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Reddit submissions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditLinks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RedditLink>
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
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditLink}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: [
				Source.Constants_Internal,
				Source.Reddit_PublicJson,
			],
			fields: {
				title: true,
				fullname: true,
				createdAt: true,
			},
		})
	}
	getResourceItems={(redditLinks) => [...new Map(redditLinks.values.map((redditLink) => [redditLink[EntityMetaKey.SelectorKey], redditLink])).values()]}
	getKey={(redditLink) => redditLink[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit submissions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditLink })}
		{@const redditLinkFields = { ...redditLink[EntityMetaKey.Selector], ...redditLink }}
		{@const selection = select(EntityType.RedditLink, redditLink[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const redditLinkHrefFields = { ...redditLink, ...redditLink[EntityMetaKey.Selector] }}
		<RedditLinkView
			selection={selection}
			prefetched={redditLinkFields}
			href={
				(redditLinkHrefFields.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]', {
					fullname: encodeURIComponent(String(redditLinkHrefFields.fullname ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
