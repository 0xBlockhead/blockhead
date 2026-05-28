<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		entityFieldReference,
		id = 'users',
		title = 'Users',
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.FarcasterUser}
	{id}
	{title}
	bind:open
	{collapsible}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentNetwork = useEntity(
				EntityType.FarcasterNetwork,
				entityFieldReference.entityId,
				{
					$: [Source.Farcaster_Rest],
					protocolName: {},
					$$users: { $: [Source.Snapchain_Rest] },
				},
			)}
			{@const users = derive(
				parentNetwork,
				(parentNetwork) => (
					[...(parentNetwork.$$users ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterUser}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => row.value[EntityMetaKey.Id].fid}
				placeholderText="Loading Farcaster users…"
				resource={users}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Farcaster users in this list yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const userId = item.value[EntityMetaKey.Id]}
					<FarcasterUserView
						entityId={{ fid: userId.fid }}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
