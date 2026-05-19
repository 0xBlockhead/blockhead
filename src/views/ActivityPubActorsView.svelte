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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Federated actors',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.ActivityPubActor
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

	const activityPubNetwork = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Constants_Internal],
			...(open ?
				{
					protocolName: {},
					$$activityPubActors: {
						$: [
							Source.Constants_Internal,
							Source.Mastodon_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const actors = derive(
		activityPubNetwork,
		(activityPubNetwork) => (
			(activityPubNetwork.$$activityPubActors ?? [])
				.toSorted((a, b) => {
					const left = a[EntityMetaKey.Id]
					const right = b[EntityMetaKey.Id]
					const originCompare = (
						left.instanceOrigin.localeCompare(right.instanceOrigin)
					)
					return (
						originCompare !== 0 ?
							originCompare
						:
							left.localAccountId.localeCompare(right.localAccountId)
					)
				})
		),
	)
</script>


<EntitiesList
	entityType={EntityType.ActivityPubActor}
	{href}
	{id}
	bind:open
	{title}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub actors federate across instances; each id pairs an origin host with a local account id (Mastodon-style).
		</p>
		<p>
			Actor rows are discovery records—handles, inbox/outbox, and public keys live behind WebFinger and collection endpoints on the home instance.
		</p>
		<p>
			Sorted like the instance directory collection response.
		</p>
	{/snippet}

	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.ActivityPubActor}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading Mastodon actor directory…"
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
						<ActivityPubActorView
							entityId={{
								instanceOrigin: actorId.instanceOrigin,
								localAccountId: actorId.localAccountId,
							}}
							href={resolve('/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
								instanceOrigin: encodeURIComponent(actorId.instanceOrigin),
								localAccountId: encodeURIComponent(actorId.localAccountId),
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
