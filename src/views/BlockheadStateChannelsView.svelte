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
		title = 'Channels',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadStateChannel>
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
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannel}
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
				id: true,
				createdAt: true,
			},
		})
	}
	getResourceItems={(blockheadStateChannels) => [...new Map(blockheadStateChannels.values.map((blockheadStateChannel) => [blockheadStateChannel[EntityMetaKey.SelectorKey], blockheadStateChannel])).values()]}
	getKey={(blockheadStateChannel) => blockheadStateChannel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channels yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannel })}
		{@const blockheadStateChannelFields = { ...blockheadStateChannel[EntityMetaKey.Selector], ...blockheadStateChannel }}
		{@const selection = select(EntityType.BlockheadStateChannel, blockheadStateChannel[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadStateChannelHrefFields = { ...blockheadStateChannel, ...blockheadStateChannel[EntityMetaKey.Selector] }}
		<BlockheadStateChannelView
			selection={selection}
			prefetched={blockheadStateChannelFields}
			href={
				(blockheadStateChannelHrefFields.id !== undefined ? resolve('/channel/[channelId=stringSegment]', {
					channelId: String(blockheadStateChannelHrefFields.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
