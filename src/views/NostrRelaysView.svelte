<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Relays',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrRelay>
			href: string
			id: string
			open?: boolean
			title?: string
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrRelay}
	{href}
	{id}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
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

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[fieldName]: {
						$: [
							Source.NostrBand_Rest,
						],
					},
				},
			)}
			{@const relays = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.NostrRelay>[] = (
						parent[fieldName] ?? []
					)
					return (
						rows.map((relay) => ({
							entityId: relay[EntityMetaKey.Id],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrRelay}
				{href}
				id={`${id}-items`}
				{title}
				resource={relays}
				placeholderText="Loading relays…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.entityId.relayUrl}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Nostr relays in this hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: row,
				})}
					{#if row}
						<NostrRelayView
							entityId={row.entityId}
							href={resolve('/nostr/relay/[relayKey]', {
								relayKey: encodeURIComponent(row.entityId.relayUrl),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
