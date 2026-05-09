<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	import { htmlToPlainText } from '$/lib/html.ts'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubActor>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const activityPubActorMergeSourceOrder = [
		Source.Mastodon_Rest,
	] as const

	const actorQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.ActivityPubActor] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const actorFields = $derived(
		mergeEntityCollectionRowFields<EntityType.ActivityPubActor>(
			actorQuery.data,
			activityPubActorMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		actorFields.displayName
		?? actorFields.acct
		?? actorFields.username
		?? entityId.localAccountId,
	)

	const avatarUrl = $derived((
		actorFields.$icon?.[EntityMetaKey.Id].url
	))


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if avatarUrl !== undefined}
			<IconComponent
				alt={(
					actorFields.displayName
					?? actorFields.acct
					?? actorFields.username
					?? ''
				)}
				shape={IconShape.Circle}
				src={avatarUrl}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if actorFields.username !== undefined && actorFields.username !== displayTitle}
			<span data-text="muted">
				@{actorFields.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if actorFields.note}
				<p data-text="muted">
					{htmlToPlainText(actorFields.note)}
				</p>
			{/if}
			<div data-text="mono muted">
				{entityId.instanceOrigin}
				 · 
				{entityId.localAccountId}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ActivityPubActor}
			{entityId}
		>
			<QueryBoundary
				query={actorQuery}
			>
				{#snippet children(mastoRestActorResultRows)}
					{#if mastoRestActorResultRows.length === 0}
						<p data-text="muted">
							No account data in the app for this id yet. Try again shortly, or check that the Mastodon instance
							API can be reached.
						</p>
					{:else}
						<dl>
							{#if actorFields.username}
								<div>
									<dt>Username</dt>
									<dd>{actorFields.username}</dd>
								</div>
							{/if}
							{#if actorFields.acct}
								<div>
									<dt>Acct</dt>
									<dd>{actorFields.acct}</dd>
								</div>
							{/if}
							{#if actorFields.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{actorFields.displayName}</dd>
								</div>
							{/if}
							{#if actorFields.note}
								<div>
									<dt>About</dt>
									<dd>
										{htmlToPlainText(actorFields.note)}
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<ActivityPubMastodonFieldNotes
			entityFieldReference={{
				entityType: EntityType.ActivityPubActor,
				entityId,
				fieldName: '$$notes',
			}}
			href={resolve('/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/notes', {
				instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
				localAccountId: encodeURIComponent(entityId.localAccountId),
			})}
			id="activitypub-actor-statuses"
			orderByCreatedAt="desc"
			placeholderText="Loading statuses…"
			title="Statuses"
		/>
	{/snippet}
</EntityView>
