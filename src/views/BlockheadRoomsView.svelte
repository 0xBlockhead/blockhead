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
		title = 'Rooms',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRooms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadRoom>
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
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRoom}
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
				name: true,
				createdAt: true,
				id: true,
			},
		})
	}
	getResourceItems={(blockheadRooms) => [...new Map(blockheadRooms.values.map((blockheadRoom) => [blockheadRoom[EntityMetaKey.SelectorKey], blockheadRoom])).values()]}
	getKey={(blockheadRoom) => blockheadRoom[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Rooms yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRoom })}
		{@const blockheadRoomFields = { ...blockheadRoom[EntityMetaKey.Selector], ...blockheadRoom }}
		{@const selection = select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadRoomHrefFields = { ...blockheadRoom, ...blockheadRoom[EntityMetaKey.Selector] }}
		<BlockheadRoomView
			selection={selection}
			prefetched={blockheadRoomFields}
			href={
				(blockheadRoomHrefFields.id !== undefined ? resolve('/~/multiplayer/room/[roomId=stringSegment]', {
					roomId: String(blockheadRoomHrefFields.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
