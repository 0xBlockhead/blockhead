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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeChannel>
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
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
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
		{@const selection = select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeChannelHrefFields = { ...youtubeChannel, ...youtubeChannel[EntityMetaKey.Selector] }}
		<YoutubeChannelView
			selection={selection}
			prefetched={youtubeChannelFields}
			href={
				(youtubeChannelHrefFields.channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
					channelId: encodeURIComponent(String(youtubeChannelHrefFields.channelId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
