<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		id = 'farcaster-feeds',
		title = 'Feeds',
		open = $bindable(true),
		limit = 120,
		collapsible = true,
		CollapsibleProps = {},
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterFeed>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		open?: boolean
		limit?: number
		collapsible?: boolean
	} = $props()


	// Functions
	const summaryHref = (idArg: EntityId<typeof schema, EntityType.FarcasterFeed>) => (
		idArg.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: idArg.variant === 'byUser' ?
			resolve(`/farcaster/feed/user/${String(idArg.fid)}`)
		: idArg.variant === 'byChannel' ?
			resolve(`/farcaster/feed/channel/${encodeURIComponent(idArg.channelId)}`)
		:
			resolve('/farcaster/feed')
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.FarcasterFeed}
	{id}
	{title}
	{collapsible}
	bind:open
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster feed definitions address hub APIs: trending timelines, per-user casts, channel-scoped streams, or following feeds.
		</p>
		<p>
			Each row’s parameters determine which cast hashes the hub returns—different ids are not interchangeable.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No feeds yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentNetwork = useEntity(
				EntityType.FarcasterNetwork,
				entityFieldReference.entityId,
				{
					$$feeds: { $: [Source.Farcaster_Rest] },
				},
			)}
			{@const feeds = derive(
				parentNetwork,
				(parentNetwork) => (
					[...(parentNetwork.$$feeds ?? [])]
						.slice(0, limit)
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterFeed}
				{id}
				{title}
				open={true}
				getKey={(row) => stringify(farcasterFeed.value[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(farcasterFeed.value[EntityMetaKey.Id])}
				placeholderText="Loading Farcaster feeds (trending, FID, channel)…"
				resource={feeds}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No feeds yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const feedId = item.value[EntityMetaKey.Id]}
					<FarcasterFeedView
						entityId={feedId}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
