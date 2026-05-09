<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'
	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'channels',
		href = resolve('/farcaster/channels'),
		title = 'Channels',
		open = $bindable(true),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterChannel>
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const channelsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					$$channels: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
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
				.select(({ $$channels }) => (
					{ value: $$channels[EntityMetaKey.Value] }
				))
				.distinct()
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
	items={channelsQuery.data?.map(({ value }) => value) ?? []}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => row[EntityMetaKey.Id].id}
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: channelsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: channelsQuery.isLoading,
		isError: channelsQuery.isError,
		isReady: channelsQuery.isReady,
		error: channelsQuery.error,
		status: channelsQuery.status,
	}}
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
			{@const channelId = row[EntityMetaKey.Id]}
			<FarcasterChannelView
				entityId={{ id: channelId.id }}
				href={resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
					channelId: channelId.id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
