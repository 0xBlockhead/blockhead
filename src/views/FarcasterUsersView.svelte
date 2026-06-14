<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		id = 'users',
		title = 'Users',
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
	}: {
		entityFieldReference: Extract<
			EntityFieldReference<typeof schema, EntityType.FarcasterUser>,
			{ entityType: EntityType.FarcasterNetwork }
		>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		href?: ComponentProps<typeof EntitiesList>['href']
		open?: boolean
		collapsible?: boolean
	} = $props()

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
	{href}
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
			No Farcaster users in this farcasterUsers yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentNetwork = subscribe(EntityType.FarcasterNetwork,
				entityFieldReference.selector,
				({ sources: [Source.Farcaster_Rest], fields: { protocolName: true, $$users: ({ sources: [Source.Snapchain_Rest] }) } }),
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
				getKey={(farcasterUser) => stringify(farcasterUser.value[EntityMetaKey.Selector])}
				getSortValue={(farcasterUser) => farcasterUser.value[EntityMetaKey.Selector].fid}
				placeholderText="Loading Farcaster users…"
				resource={users}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Farcaster users in this farcasterUsers yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const userId = item.value[EntityMetaKey.Selector]}
					<FarcasterUserView
						selector={{ fid: userId.fid }}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
