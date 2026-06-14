<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Relays',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrRelay>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.NostrBand_Rest,
						],
					},
				} }),
			)}
			{@const relays = derive(
				parent,
				(parent) => {
					const nostrRelays: readonly Entity<typeof schema, EntityType.NostrRelay>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						nostrRelays.map((relay) => ({
							selector: relay[EntityMetaKey.Selector],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrRelay}
				id={`${id}-items`}
				{title}
				resource={relays}
				placeholderText="Loading relays…"
				getKey={(relay) => stringify(relay.selector)}
				getSortValue={(relay) => relay.selector.relayUrl}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Nostr relays in this hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: relay,
				})}
					<NostrRelayView
						selector={relay.selector}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
