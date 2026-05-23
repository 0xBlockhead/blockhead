<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		id = 'farcaster-feeds',
		href = resolve('/farcaster/feed'),
		title = 'Feeds',
		open = $bindable(true),
		limit = 120,
		collapsible = true,
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterFeed>
		id?: string
		href?: string
		title?: string
		open?: boolean
		limit?: number
		collapsible?: boolean
	} = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterFeed}
	{id}
	{href}
	{title}
	{collapsible}
	bind:open
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster feed definitions address hub APIs: trending timelines, numeric feed ids, per-user casts, or channel-scoped streams.
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

	{#snippet body()}
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
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row.value[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading Farcaster feeds (trending, FID, channel)…"
				resource={feeds}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No feeds yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const feedId = props.item.value[EntityMetaKey.Id]}
						<FarcasterFeedView
							entityId={feedId}
							href={summaryHref(feedId)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
