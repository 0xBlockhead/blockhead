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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'ATProto handles',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.AtprotoActor
			>
			id: string
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
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
			{@const atprotoNetwork = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [Source.Constants_Internal],
					protocolName: {},
					$$atprotoActors: {
						$: [
							Source.Constants_Internal,
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
					},
				},
			)}
			{@const actors = derive(
				atprotoNetwork,
					(atprotoNetwork) => {
						const atprotoActors: Entity<typeof schema, EntityType.AtprotoActor>[] = (
					atprotoNetwork.$$atprotoActors ?? []
						)
						return (
							atprotoActors.map((value) => ({
								value,
							}))
						)
					},
			)}
			{#key stringify(entityFieldReference.entityId)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.AtprotoActor}
					id={`${id}-items`}
					{title}
					open={true}
						getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
						getSortValue={(row) => row.value[EntityMetaKey.Id].did}
					placeholderText="Loading DID directory…"
					resource={actors}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No actors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						{@const actorId = item.value[EntityMetaKey.Id]}
						<AtprotoActorView
							entityId={{ did: actorId.did }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
