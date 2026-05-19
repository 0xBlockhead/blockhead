<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'users',
		href = resolve('/farcaster/users'),
		title = 'Users',
		open = $bindable(true),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	const parentNetwork = useEntity(
		EntityType.FarcasterNetwork,
		entityFieldReference.entityId,
		(
			open ?
				{
					$: [Source.Farcaster_Rest],
					protocolName: {},
					$$users: { $: [Source.Snapchain_Rest] },
				}
			:
				{}
		),
	)

	const users = derive(
		parentNetwork,
		(merged) => (
			[...(merged.$$users ?? [])]
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].fid - b[EntityMetaKey.Id].fid
				))
				.map((value) => ({
					value,
				}))
		),
	)
</script>


<EntitiesList
	entityType={EntityType.FarcasterUser}
	{id}
	{href}
	{title}
	bind:open
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.value[EntityMetaKey.Id].fid}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading Farcaster users…"
	resource={users}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						Farcaster users are numeric FIDs registered through Hubs and Snapchain-style sync; directory APIs enumerate who exists on that network view.
					</p>
					<p>
						Human-readable fnames resolve per profile; empty directories usually mean the indexer has not caught up yet.
					</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Farcaster users in this list yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const userId = props.item.value[EntityMetaKey.Id]}
			<FarcasterUserView
				entityId={{ fid: userId.fid }}
				href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
					userId: String(userId.fid),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
