<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Channels',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeChannel>
			id: string
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
						Source.Youtube_Rest,
						Source.Piped_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
				} }),
			)}
			{@const channels = derive(
				parent,
				(parent) => {
					const youTubeChannels: readonly Entity<typeof schema, EntityType.YouTubeChannel>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						youTubeChannels.map((value) => ({
							selector: value[EntityMetaKey.Selector],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubeChannel}
				id={`${id}-items`}
				{title}
				resource={channels}
				placeholderText="Loading channels…"
				getKey={(channel) => stringify(channel.selector)}
				getSortValue={(channel) => channel.selector.channelId}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No channels in this YouTube hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: channel,
				})}
					<YouTubeChannelView
						selector={channel.selector}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
