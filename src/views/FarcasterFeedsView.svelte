<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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
		href,
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterFeed>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		href?: ComponentProps<typeof EntitiesList>['href']
		open?: boolean
		limit?: number
		collapsible?: boolean
	} = $props()


	// Functions
	const summaryHref = (idArg: EntitySelector<typeof schema, EntityType.FarcasterFeed>) => (
		idArg.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: idArg.variant === 'byUser' ?
			resolve('/(social)/(farcaster)/farcaster/feed/user/[userId]', {
				userId: String(idArg.fid),
			})
		: idArg.variant === 'byChannel' ?
			resolve('/(social)/(farcaster)/farcaster/feed/channel/[channelId]', {
				channelId: idArg.channelId,
			})
		:
			resolve('/farcaster/feed')
	)


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
	{href}
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
			{@const parentNetwork = subscribe(EntityType.FarcasterNetwork,
				entityFieldReference.selector,
				({ fields: { $$feeds: ({ sources: [Source.Farcaster_Rest], limit: limit }) } }),
			)}
			{@const feeds = derive(
				parentNetwork,
				(parentNetwork) => (
					[...(parentNetwork.$$feeds ?? [])]
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
				getKey={(row) => stringify(row.value[EntityMetaKey.Selector])}
				getSortValue={(row) => stringify(row.value[EntityMetaKey.Selector])}
				placeholderText="Loading Farcaster feeds (trending, FID, channel)…"
				resource={feeds}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No feeds yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const feedId = item.value[EntityMetaKey.Selector]}
					<FarcasterFeedView
						selector={feedId}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
