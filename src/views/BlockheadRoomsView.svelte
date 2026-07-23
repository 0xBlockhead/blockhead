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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadRoom>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadRoom}
			entitySelector={blockheadRoom[EntityMetaKey.Selector]}
			href={
				(
					blockheadRoom[EntityMetaKey.Selector] != null && 'id' in blockheadRoom[EntityMetaKey.Selector]
					&& blockheadRoom[EntityMetaKey.Selector].id != null ?
						resolve('/~/multiplayer/room/[roomId=stringSegment]', {
					roomId: String(blockheadRoom[EntityMetaKey.Selector].id ?? ''),
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
				{[String((blockheadRoomFields.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadRoomFields.id) ?? '')].filter(Boolean).join(' ') || 'room'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadRoomFields.createdAt) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
