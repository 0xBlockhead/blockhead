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
		title = 'Farcaster feeds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterFeeds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterFeed>
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
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterFeed}
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
				label: true,
				variant: true,
				fid: true,
				channelId: true,
				viewerFid: true,
			},
		})
	}
	getResourceItems={(farcasterFeeds) => [...new Map(farcasterFeeds.values.map((farcasterFeed) => [farcasterFeed[EntityMetaKey.SelectorKey], farcasterFeed])).values()]}
	getKey={(farcasterFeed) => farcasterFeed[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster feeds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterFeed })}
		{@const farcasterFeedFields = { ...farcasterFeed[EntityMetaKey.Selector], ...farcasterFeed }}
		{@const selection = select(EntityType.FarcasterFeed, farcasterFeed[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const farcasterFeedHrefFields = { ...farcasterFeed, ...farcasterFeed[EntityMetaKey.Selector] }}
		<FarcasterFeedView
			selection={selection}
			prefetched={farcasterFeedFields}
			href={
				(farcasterFeed[EntityMetaKey.Selector].variant === 'trending' ? resolve('/farcaster/feed/trending') : farcasterFeed[EntityMetaKey.Selector].variant === 'byUser' && farcasterFeedHrefFields.fid !== undefined ? resolve('/farcaster/feed/user/[userId=farcasterFid]', {
					userId: String(farcasterFeedHrefFields.fid ?? ''),
				}) : farcasterFeed[EntityMetaKey.Selector].variant === 'byChannel' && farcasterFeedHrefFields.channelId !== undefined ? resolve('/farcaster/feed/channel/[channelId=stringSegment]', {
					channelId: String(farcasterFeedHrefFields.channelId ?? ''),
				}) : farcasterFeed[EntityMetaKey.Selector].variant === 'following' && farcasterFeedHrefFields.viewerFid !== undefined ? resolve('/farcaster/feed/following/[userId=farcasterFid]', {
					userId: String(farcasterFeedHrefFields.viewerFid ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
