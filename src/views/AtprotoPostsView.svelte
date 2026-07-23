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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AtprotoPost>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.AtprotoPost}
			entitySelector={atprotoPost[EntityMetaKey.Selector]}
			href={
				(
					atprotoPost[EntityMetaKey.Selector] != null && 'uri' in atprotoPost[EntityMetaKey.Selector]
					&& atprotoPost[EntityMetaKey.Selector].uri != null ?
						resolve('/atproto/post/[...uri=stringSegment]', {
					uri: encodeURIComponent(String(atprotoPost[EntityMetaKey.Selector].uri ?? '')),
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
				{[String((atprotoPostFields.text) ?? '')].filter(Boolean).join(' ') || [String((atprotoPostFields.uri) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((atprotoPostFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
