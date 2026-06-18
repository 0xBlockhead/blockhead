<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


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
		selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
		id: string
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
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
							Source.Youtube_Rest,
							Source.Piped_Rest,
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
							<YouTubeChannelView
								selector={item.entitySelector}
								layout={EntityLayout.SummaryDetails}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
