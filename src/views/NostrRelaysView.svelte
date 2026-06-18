<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
		title = 'Relays',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
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
					sources: [Source.NostrBand_Rest],
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
						getKey={(relay) => stringify(relay.entitySelector)}
						getSortValue={(relay) => relay.entitySelector.relayUrl}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No Nostr relays in this hub yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<NostrRelayView
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
