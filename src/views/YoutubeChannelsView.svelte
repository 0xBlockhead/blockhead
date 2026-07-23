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
		title = 'YouTube channels',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeChannel>
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
	entityType={EntityType.YoutubeChannel}
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
				title: true,
				channelId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubeChannels) => [...new Map(youtubeChannels.values.map((youtubeChannel) => [youtubeChannel[EntityMetaKey.SelectorKey], youtubeChannel])).values()]}
	getKey={(youtubeChannel) => youtubeChannel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube channels yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeChannel })}
		{@const youtubeChannelFields = { ...youtubeChannel[EntityMetaKey.Selector], ...youtubeChannel }}
		<EntityView
			entityType={EntityType.YoutubeChannel}
			entitySelector={youtubeChannel[EntityMetaKey.Selector]}
			href={
				(
					youtubeChannel[EntityMetaKey.Selector] != null && 'channelId' in youtubeChannel[EntityMetaKey.Selector]
					&& youtubeChannel[EntityMetaKey.Selector].channelId != null ?
						resolve('/youtube/channel/[channelId=stringSegment]', {
					channelId: encodeURIComponent(String(youtubeChannel[EntityMetaKey.Selector].channelId ?? '')),
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
				{[String((youtubeChannelFields.title) ?? '')].filter(Boolean).join(' ') || [String((youtubeChannelFields.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
