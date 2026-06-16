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
		id = 'farcaster-feeds',
		title = 'Feeds',
		open = $bindable(true),
		limit = 120,
		collapsible = true,
		CollapsibleProps = {},
		href,
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterFeed>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		href?: ComponentProps<typeof EntitiesList>['href']
		open?: boolean
		limit?: number
		collapsible?: boolean
	} = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.FarcasterFeed}
	{id}
	{title}
	{collapsible}
	{href}
	bind:open
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster feed definitions address hub APIs: trending timelines, per-user casts, channel-scoped streams, or following feeds.
		</p>
		<p>
			Each row’s parameters determine which cast hashes the hub returns—different ids are not interchangeable.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No feeds yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentNetwork = subscribe(EntityType.FarcasterNetwork,
				entityFieldReference.selector,
				({
					fields: {
						[entityFieldReference.fieldName]: {
							sources: [Source.Farcaster_Rest],
							limit,
						},
					},
				})
			)}
			<ResourceBoundary
				resource={parentNetwork}
				placeholderText="Loading Farcaster feeds (trending, FID, channel)…"
			>
				{#snippet children(parentNetwork)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FarcasterFeed}
						{id}
						{title}
						open={true}
						items={parentNetwork.fields[entityFieldReference.fieldName]?.values ?? []}
						getKey={(feed) => stringify(feed[EntityMetaKey.Selector])}
						getSortValue={(feed) => stringify(feed[EntityMetaKey.Selector])}
						placeholderText="Loading Farcaster feeds (trending, FID, channel)…"
					>
						{#snippet Empty()}
							<p data-text="muted">
								No feeds yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<FarcasterFeedView
								selector={item[EntityMetaKey.Selector]}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
