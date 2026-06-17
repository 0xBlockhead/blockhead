<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'
	import { proxy } from '$/routes/+layout.svelte'
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


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [Source.Constants_Internal],
					}
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.Constants_Internal,
						Source.Mastodon_Rest,
						Source.Fedi_Rest,
					],
				})} placeholderText="Loading Mastodon actor directory…">
				{#snippet children(actors)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.ActivityPubActor}
						id={`${id}-items`}
						{title}
						open={true}
						items={actors.entities}
						getKey={(activityPubActor) => stringify(activityPubActor.entitySelector)}
						getSortValue={(activityPubActor) => ('localAccountId' in activityPubActor.entitySelector ?
								`${activityPubActor.entitySelector.instanceOrigin}\0${activityPubActor.entitySelector.localAccountId}`
							: 'acct' in activityPubActor.entitySelector ?
								`${activityPubActor.entitySelector.instanceOrigin}\0${activityPubActor.entitySelector.acct}`
							:
								activityPubActor.entitySelector.activityStreamsUri)}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No actors yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{@const activityPubActorLabel = 'localAccountId' in item.entitySelector ?
								`${item.entitySelector.instanceOrigin}/${item.entitySelector.localAccountId}`
							: 'acct' in item.entitySelector ?
								`${item.entitySelector.instanceOrigin}/@${item.entitySelector.acct}`
							:
								item.entitySelector.activityStreamsUri}
							{#if 'localAccountId' in item.entitySelector && String(item.entitySelector.localAccountId) !== '-1'}
								<a
									href={resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
										instanceOrigin: encodeURIComponent(item.entitySelector.instanceOrigin),
										localAccountId: item.entitySelector.localAccountId,
									})}
								>
									<TruncatedValue
										value={activityPubActorLabel}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							{:else}
								<TruncatedValue
									value={activityPubActorLabel}
									format={TruncatedValueFormat.Visual}
								/>
							{/if}
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
