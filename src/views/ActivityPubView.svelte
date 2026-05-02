<script lang="ts">
	// Types/constants
	import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'ActivityPubNetwork' as const,
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

	const networkIdKey = stringify(entityId)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.ActivityPubNetwork] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const actorsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.ActivityPubNetwork]['$$activityPubActors']! })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const notesQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.ActivityPubNetwork]['$$activityPubNotes']! })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const networkFields = $derived.by(() => {
		const bag = networkQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		return bag !== undefined && typeof bag === 'object' ? bag as Record<string, unknown> : null
	})


	// Components
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNetwork}
	{entityId}
	href={resolve('/(social)/activitypub')}
	open={true}
	title="ActivityPub"
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Actors</dt>
				<dd>{String(actorsQuery.data?.length ?? 0)}</dd>
			</div>
			<div>
				<dt>Notes</dt>
				<dd>{String(notesQuery.data?.length ?? 0)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ActivityPubNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl data-definition-list="vertical">
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'ActivityPub')}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(networkFields?.homeUrl ?? '#')}>
									{String(networkFields?.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
						{#if typeof networkFields?.docsUrl === 'string' && networkFields.docsUrl.length}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={networkFields.docsUrl}>
										{networkFields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
						<div>
							<dt>Configured instance</dt>
							<dd>{mastodonDefaultInstanceOrigin}</dd>
						</div>
					</dl>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Public timeline
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section>
						<ActivityPubActorsView
							entityFieldReference={{
								entityType: EntityType.ActivityPubNetwork,
								entityId,
								fieldName: '$$activityPubActors',
							}}
							href={resolve('/(social)/activitypub')}
							id={`${networkIdKey}:actors`}
							open={false}
						/>
					</section>

					<section>
						<ActivityPubMastodonFieldNotes
							entityFieldReference={{
								entityType: EntityType.ActivityPubNetwork,
								entityId,
								fieldName: '$$activityPubNotes',
							}}
							href={resolve('/(social)/activitypub')}
							id={`${networkIdKey}:notes`}
							orderByCreatedAt="desc"
							placeholderText="Loading public notes…"
							title="Public notes"
						/>
					</section>
				</div>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
