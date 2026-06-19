<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Channels',
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.YouTubeChannel>
		id: string
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.YouTubeChannel}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			YouTube channels are publisher namespaces keyed by opaque UC… channel ids.
		</p>
		<p>
			Not Reddit subreddits, Nostr pubkeys, or Farcaster FIDs.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No channels in this YouTube hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Constants_Internal,
						],
					})}
				placeholderText="Loading channels…"
			>
				{#snippet children(channels)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.YouTubeChannel}
						id={`${id}-items`}
						{title}
						items={channels.entities}
						placeholderText="Loading channels…"
						getKey={(channel) => stringify(channel.entitySelector)}
						getSortValue={(channel) => channel.entitySelector.channelId}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No channels in this YouTube hub yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
									channelId: item.entitySelector.channelId,
								})}
							>
								<TruncatedValue
									value={item.entitySelector.channelId}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
