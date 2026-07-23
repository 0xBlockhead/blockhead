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
		title = 'Contacts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRoomPeers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadRoomPeer>
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
	entityType={EntityType.BlockheadRoomPeer}
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
				displayName: true,
				isConnected: true,
				peerId: true,
				id: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadRoomPeers) => [...new Map(blockheadRoomPeers.values.map((blockheadRoomPeer) => [blockheadRoomPeer[EntityMetaKey.SelectorKey], blockheadRoomPeer])).values()]}
	getKey={(blockheadRoomPeer) => blockheadRoomPeer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Contacts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRoomPeer })}
		{@const blockheadRoomPeerFields = { ...blockheadRoomPeer[EntityMetaKey.Selector], ...blockheadRoomPeer }}
		<EntityView
			entityType={EntityType.BlockheadRoomPeer}
			entitySelector={blockheadRoomPeer[EntityMetaKey.Selector]}
			href={
				(
					blockheadRoomPeer[EntityMetaKey.Selector] != null && 'id' in blockheadRoomPeer[EntityMetaKey.Selector]
					&& blockheadRoomPeer[EntityMetaKey.Selector].id != null ?
						resolve('/~/multiplayer/contact/[contactId=stringSegment]', {
					contactId: String(blockheadRoomPeer[EntityMetaKey.Selector].id ?? ''),
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
				{[String((blockheadRoomPeerFields.displayName) ?? '')].filter(Boolean).join(' ') || [String((blockheadRoomPeerFields.peerId) ?? '')].filter(Boolean).join(' ') || 'contact'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadRoomPeerFields.isConnected) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
