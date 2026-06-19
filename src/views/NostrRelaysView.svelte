<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
		title = 'Relays',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrRelay>
			id: string
			open?: boolean
			collapsible?: boolean
			title?: string
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
	entityType={EntityType.NostrRelay}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr relays accept signed events over WebSocket at public <code>wss://</code> URLs (NIP-01); optional NIP-11 HTTPS metadata describes software and supported NIPs.
		</p>
		<p>
			This directory lists <code>wss://</code> relay endpoints from Constants seeds and NostrBand relay rankings. Signed events, profiles, and timelines load separately via NostrBand and Primal HTTP indexers.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Nostr relays in this hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
					],
				})} placeholderText="Loading relays…">
				{#snippet children(relays)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrRelay}
						id={`${id}-items`}
						{title}
						open={true}
						items={relays.entities}
						getKey={(relay) => stringify(relay[EntityMetaKey.Selector])}
						getSortValue={(relay) => relay[EntityMetaKey.Selector].relayUrl}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No Nostr relays in this hub yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(nostr)/nostr/relay/[relayKey]', {
									relayKey: encodeURIComponent(item[EntityMetaKey.Selector].relayUrl),
								})}
							>
								<TruncatedValue
									value={item[EntityMetaKey.Selector].relayUrl}
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
