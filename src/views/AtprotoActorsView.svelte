<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'
	// State
	let {
		selection,
		id,
		limit = 12,
		open = $bindable(true),
		collapsible = true,
		title = 'ATProto handles',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoActor>
			id: string
			limit?: number
			open?: boolean
			title?: string
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoActor}
	{id}
	bind:open
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			AT Protocol accounts are DIDs; public handles, follow graphs, and posts are stored in content-addressed repos synced by PDS and relays.
		</p>
		<p>
			A directory response lists only the handles a hub currently indexes—not every DID that exists network-wide.
		</p>
		<p>
			Listing order is lexicographic by DID as returned by the hub directory.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
						Source.Atproto_Xrpc,
					],
					limit,
				})} placeholderText="Loading DID directory…">
				{#snippet children(actors)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.AtprotoActor}
						id={`${id}-items`}
						{title}
						open={true}
						items={actors.entities}
						getKey={(actor) => stringify(actor.entitySelector)}
						getSortValue={(actor) => ('did' in actor.entitySelector ? actor.entitySelector.did : actor.entitySelector.handle)}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No actors yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{#if 'did' in item.entitySelector}
								<a
									href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
										did: encodeURIComponent(item.entitySelector.did),
									})}
								>
									<TruncatedValue
										value={item.entitySelector.did}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							{:else}
								<TruncatedValue
									value={item.entitySelector.handle}
									format={TruncatedValueFormat.Visual}
								/>
							{/if}
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
