<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


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
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
				(atprotoNetwork) => (
					atprotoNetwork.$$atprotoActors ?? []
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.AtprotoActor}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => stringify(atprotoActor[EntityMetaKey.Id])}
					getSortValue={(row) => atprotoActor[EntityMetaKey.Id].did}
					placeholderText="Loading DID directory…"
					resource={actors}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No actors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						{@const actorId = item[EntityMetaKey.Id]}
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
