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


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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
			{@const atprotoNetwork = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					sources: [Source.Constants_Internal],
					fields: {
						protocolName: true,
						$$atprotoActors: {
							sources: [
								Source.Constants_Internal,
								Source.Atproto_Xrpc,
								Source.Atproto_BskySocial_Xrpc,
							],
						},
					},
				},
			)}
			{@const actors = derive(
				atprotoNetwork,
					(atprotoNetwork) => {
						const atprotoActors: readonly Entity<typeof schema, EntityType.AtprotoActor>[] = (
					atprotoNetwork.fields.$$atprotoActors?.values ?? []
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
					getSortValue={(row) => {
						const actorId = row.value[EntityMetaKey.Id]
						return 'did' in actorId ? actorId.did : actorId.handle
					}}
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
							entityId={actorId}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
