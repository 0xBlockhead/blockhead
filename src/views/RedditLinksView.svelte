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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditLink>
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
	entityType={EntityType.RedditLink}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
			fields: {
				title: true,
				fullname: true,
				createdAt: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.RedditLink}
			entitySelector={redditLink[EntityMetaKey.Selector]}
			href={
				(
					redditLink[EntityMetaKey.Selector] != null && 'fullname' in redditLink[EntityMetaKey.Selector]
					&& redditLink[EntityMetaKey.Selector].fullname != null ?
						resolve('/reddit/link/[fullname=stringSegment]', {
					fullname: encodeURIComponent(String(redditLink[EntityMetaKey.Selector].fullname ?? '')),
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
				{[String((redditLinkFields.title) ?? '')].filter(Boolean).join(' ') || [String((redditLinkFields.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((redditLinkFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
