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
		title = 'AT Protocol posts',
		typeAnnotationParagraphs = ['A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoPosts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AtprotoPost>
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
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoPost}
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
				text: true,
				uri: true,
				createdAt: true,
			},
			limit: 25,
		})
	}
	getResourceItems={(atprotoPosts) => [...new Map(atprotoPosts.values.map((atprotoPost) => [atprotoPost[EntityMetaKey.SelectorKey], atprotoPost])).values()]}
	getKey={(atprotoPost) => atprotoPost[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol posts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: atprotoPost })}
		{@const atprotoPostFields = { ...atprotoPost[EntityMetaKey.Selector], ...atprotoPost }}
		{@const selection = select(EntityType.AtprotoPost, atprotoPost[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const atprotoPostHrefFields = { ...atprotoPost, ...atprotoPost[EntityMetaKey.Selector] }}
		<AtprotoPostView
			selection={selection}
			prefetched={atprotoPostFields}
			href={
				(atprotoPostHrefFields.uri !== undefined ? resolve('/atproto/post/[...uri=stringSegment]', {
					uri: encodeURIComponent(String(atprotoPostHrefFields.uri ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
