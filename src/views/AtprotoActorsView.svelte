<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'ATProto handles',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.AtprotoActor
			>
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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoActor}
	{href}
	{id}
	bind:open
	{title}
	{...entitiesListRest}
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

	{#snippet body()}
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
					{href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => row[EntityMetaKey.Id].did}
					placeholderKeys={new SvelteSet()}
					placeholderText="Loading DID directory…"
					resource={actors}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No actors yet.
						</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
							{@const actorId = props.item[EntityMetaKey.Id]}
							<AtprotoActorView
								entityId={{ did: actorId.did }}
								href={resolve('/(social)/atproto/actor/[did]', {
									did: encodeURIComponent(actorId.did),
								})}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
