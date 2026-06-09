<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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
			{@const activityPubNetwork = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					sources: [Source.Constants_Internal],
					fields: {
						protocolName: true,
						$$activityPubActors: {
							sources: [
								Source.Constants_Internal,
								Source.Mastodon_Rest,
								Source.Fedi_Rest,
							],
						},
					},
				},
			)}
			{@const actors = derive(
				activityPubNetwork,
				(activityPubNetwork) => (
					activityPubNetwork.fields.$$activityPubActors?.values ?? []
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
					getSortValue={(activityPubActor) => {
						const actorId = activityPubActor[EntityMetaKey.Id]
						return 'localAccountId' in actorId ?
							`${actorId.instanceOrigin}\0${actorId.localAccountId}`
						:
							`${actorId.instanceOrigin}\0${actorId.acct}`
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
