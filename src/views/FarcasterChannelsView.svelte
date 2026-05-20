<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'channels',
		href = resolve('/farcaster/channels'),
		title = 'Channels',
		open = $bindable(true),
		collapsible = true,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.FarcasterChannel
			>
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
</script>


<EntitiesList
	entityType={EntityType.FarcasterChannel}
	{id}
	{href}
	{title}
	bind:open
	{collapsible}
	{...entitiesListProps}
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

	{#snippet body()}
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
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
				getSortValue={(row) => row.result[EntityMetaKey.Id].id}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading Farcaster channels (channel id / slug)…"
				resource={channels}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No channels yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const channelId = props.item.result[EntityMetaKey.Id]}
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
		{/if}
	{/snippet}
</EntitiesList>
