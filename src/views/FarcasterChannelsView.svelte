<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		id = 'channels',
		title = 'Channels',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
				<ResourceBoundary
					resource={selection({
						sources: [Source.Farcaster_Rest],
					})}
					placeholderText="Loading Farcaster channels (channel id / slug)…"
				>
					{#snippet children(channels)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FarcasterChannel}
						id={`${id}-items`}
						{title}
						open={true}
							items={channels.values}
						getKey={(channel) => stringify(channel[EntityMetaKey.Selector])}
						getSortValue={(channel) => channel[EntityMetaKey.Selector].id}
						placeholderText="Loading Farcaster channels (channel id / slug)…"
					>
						{#snippet Empty()}
							<p data-text="muted">
								No channels yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<FarcasterChannelView
								selector={item[EntityMetaKey.Selector]}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
