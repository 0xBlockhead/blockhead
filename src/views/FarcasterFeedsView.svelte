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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterFeed>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.FarcasterFeed}
			entitySelector={farcasterFeed[EntityMetaKey.Selector]}
			href={
				(
					farcasterFeed[EntityMetaKey.Selector].variant === 'trending' ?
						resolve('/farcaster/feed/trending')
				:
						farcasterFeed[EntityMetaKey.Selector].variant === 'byUser'
						&& farcasterFeed[EntityMetaKey.Selector] != null && 'fid' in farcasterFeed[EntityMetaKey.Selector]
						&& farcasterFeed[EntityMetaKey.Selector].fid != null ?
							resolve('/farcaster/feed/user/[userId=farcasterFid]', {
						userId: String(farcasterFeed[EntityMetaKey.Selector].fid ?? ''),
					})
					:
							farcasterFeed[EntityMetaKey.Selector].variant === 'byChannel'
							&& farcasterFeed[EntityMetaKey.Selector] != null && 'channelId' in farcasterFeed[EntityMetaKey.Selector]
							&& farcasterFeed[EntityMetaKey.Selector].channelId != null ?
								resolve('/farcaster/feed/channel/[channelId=stringSegment]', {
							channelId: String(farcasterFeed[EntityMetaKey.Selector].channelId ?? ''),
						})
						:
								farcasterFeed[EntityMetaKey.Selector].variant === 'following'
								&& farcasterFeed[EntityMetaKey.Selector] != null && 'viewerFid' in farcasterFeed[EntityMetaKey.Selector]
								&& farcasterFeed[EntityMetaKey.Selector].viewerFid != null ?
									resolve('/farcaster/feed/following/[userId=farcasterFid]', {
								userId: String(farcasterFeed[EntityMetaKey.Selector].viewerFid ?? ''),
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
				{[String((farcasterFeedFields.label) ?? ''), String((farcasterFeedFields.variant) ?? '')].filter(Boolean).join(' ') || 'Farcaster feed'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterFeedFields.variant) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
