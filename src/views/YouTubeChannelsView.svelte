<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Channels',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeChannel>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubeChannel}
	{href}
	{id}
	{title}
	bind:open
	{collapsible}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			YouTube channels are publisher namespaces keyed by opaque UC… channel ids.
		</p>
		<p>
			Not Reddit subreddits, Nostr pubkeys, or Farcaster FIDs.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No channels in this YouTube hub yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
					[fieldName]: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
				},
			)}
			{@const channels = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.YouTubeChannel>[] = (
						parent[fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							entityId: value[EntityMetaKey.Id],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubeChannel}
				{href}
				id={`${id}-items`}
				{title}
				resource={channels}
				placeholderText="Loading channels…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.entityId.channelId}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No channels in this YouTube hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: row,
				})}
					{#if row}
						<YouTubeChannelView
							entityId={row.entityId}
							href={resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
								channelId: encodeURIComponent(row.entityId.channelId),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
