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
		title = 'Federated actors',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.ActivityPubActor
			>
			id: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActivityPubActor}
	{id}
	bind:open
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub actors federate across instances; each id pairs an origin host with a local account id (Mastodon-style).
		</p>
		<p>
			Actor activityPubActors are discovery records—handles, inbox/outbox, and public keys live behind WebFinger and collection endpoints on the home instance.
		</p>
		<p>
			Rows merge catalog seeds with authors discovered from public timelines on configured instances; sorted by origin then local account id.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const activityPubNetwork = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [Source.Constants_Internal],
					protocolName: {},
					$$activityPubActors: {
						$: [
							Source.Constants_Internal,
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						],
					},
				},
			)}
			{@const actors = derive(
				activityPubNetwork,
				(activityPubNetwork) => (
					activityPubNetwork.$$activityPubActors ?? []
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.ActivityPubActor}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => stringify(activityPubActor[EntityMetaKey.Id])}
					getSortValue={(row) => {
						const actorId = activityPubActor[EntityMetaKey.Id]
						return `${actorId.instanceOrigin}\0${actorId.localAccountId}`
					}}
					placeholderText="Loading Mastodon actor directory…"
					resource={actors}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No actors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						{@const actorId = item[EntityMetaKey.Id]}
						<ActivityPubActorView
							entityId={{
								instanceOrigin: actorId.instanceOrigin,
								localAccountId: actorId.localAccountId,
							}}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
