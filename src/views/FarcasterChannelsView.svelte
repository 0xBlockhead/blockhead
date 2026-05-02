<script lang="ts">
	// Types/constants
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const channelRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const channelId = rowEntityId(row)
		return (
			typeof channelId === 'object'
			&& channelId !== undefined
			&& 'id' in channelId
			&& typeof channelId.id === 'string' ?
				channelId.id
			:
				''
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'channels',
		href = resolve('/farcaster/channels'),
		title = 'Channels',
		open = $bindable(true),
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.FarcasterChannel>
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const channelsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$channels: entityFieldCollections[EntityType.FarcasterNetwork]['$$channels']! })
				.where(({ $$channels }) => (
					eq(
						$$channels[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ $$channels }) => (
					eq(
						$$channels[EntityMetaKey.Source],
						Source.Farcaster_Rest,
					)
				))
				.select(({ $$channels }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error Farcaster channel field row Value holds entity id
						$$channels[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterChannel}
	{id}
	{href}
	{title}
	bind:open
	query={channelsQuery}
	items={new SvelteSet(channelsQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={channelRowSortKey}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet Empty()}
		<p data-text="muted">
			No channels loaded for this network yet. Try again shortly.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const channelId = rowEntityId(row)}
			{#if typeof channelId === 'object' && channelId !== undefined && 'id' in channelId && typeof channelId.id === 'string' && channelId.id.length}
				<FarcasterChannelView
					entityId={{ id: channelId.id }}
					href={resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
						channelId: channelId.id,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
