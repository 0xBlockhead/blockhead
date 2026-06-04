<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		id = 'channels',
		title = 'Channels',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.FarcasterChannel
			>
			id?: string
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterChannel}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster channels are namespaces (ids/slugs) that collect casts; hub APIs expose directory pages of channel metadata.
		</p>
		<p>
			A channel is not a wallet, a FID, nor an on-chain contract—just social grouping on the protocol graph.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No channels yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentNetwork = useEntity(
				EntityType.FarcasterNetwork,
				entityFieldReference.entityId,
				{
					$$channels: { $: [Source.Farcaster_Rest] },
				},
			)}
			{@const channels = derive(
				parentNetwork,
				(parentNetwork) => (
					[...(parentNetwork.$$channels ?? [])]
						.map((result) => ({
							result,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterChannel}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(channel) => stringify(channel.result[EntityMetaKey.Id])}
				getSortValue={(channel) => channel.result[EntityMetaKey.Id].id}
				placeholderText="Loading Farcaster channels (channel id / slug)…"
				resource={channels}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No channels yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const channelId = item.result[EntityMetaKey.Id]}
					<FarcasterChannelView
						entityId={{ id: channelId.id }}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
