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

	const summaryFields = $derived.by((): Record<string, unknown> | null => {
		const r = actorQuery.data
			?.find((e) => e.row[EntityMetaKey.Source] === Source.Mastodon_Rest)
			?.row
			?? actorQuery.data?.[0]?.row
		const b = r?.[EntityMetaKey.Fields]
		if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
			return null
		}
		return b as Record<string, unknown>
	})

	const displayTitle = $derived(
		(typeof summaryFields?.['displayName'] === 'string' && summaryFields['displayName']
			? summaryFields['displayName']
			:	undefined)
		?? (typeof summaryFields?.['acct'] === 'string' ? summaryFields['acct'] : undefined)
		?? (typeof summaryFields?.['username'] === 'string' ? summaryFields['username'] : undefined)
		?? entityId.localAccountId
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
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
		{@const s = summaryFields}
		{@const a = s != null && typeof s['avatarUrl'] === 'string' ? s['avatarUrl'] : null}
		{#if a}
			<Icon
				alt={(
					(s != null && typeof s['displayName'] === 'string' && s['displayName'])
					?? (s != null && typeof s['acct'] === 'string' && s['acct'])
					?? (s != null && typeof s['username'] === 'string' && s['username'])
					?? ''
				)}
				shape={IconShape.Circle}
				src={a}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{@const s = summaryFields}
		{@const u = s != null && typeof s['username'] === 'string' && s['username'] !== displayTitle ? s['username'] : null}
		{#if u}
			<span data-text="muted">
				@{u}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if typeof summaryFields?.['note'] === 'string' && summaryFields['note'].length}
				<p data-text="muted">
					{htmlToPlainText(summaryFields['note'])}
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
					{@const detailFields = (() => {
						const r = mastoRestActorResultRows
							?.find((e) => e.row[EntityMetaKey.Source] === Source.Mastodon_Rest)
							?.row
							?? mastoRestActorResultRows?.[0]?.row
						const b = r?.[EntityMetaKey.Fields]
						if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
							return null
						}
						return b as Record<string, unknown>
					})()}
					{#if detailFields == null}
						<p data-text="muted">
							No account data in the app for this id yet. Try again shortly, or check that the Mastodon instance
							API can be reached.
						</p>
					{:else}
						<dl>
							{#if typeof detailFields['username'] === 'string' && detailFields['username']}
								<div>
									<dt>Username</dt>
									<dd>{detailFields['username']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['acct'] === 'string' && detailFields['acct']}
								<div>
									<dt>Acct</dt>
									<dd>{detailFields['acct']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['displayName'] === 'string' && detailFields['displayName']}
								<div>
									<dt>Display name</dt>
									<dd>{detailFields['displayName']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['note'] === 'string' && detailFields['note']}
								<div>
									<dt>About</dt>
									<dd>
										{htmlToPlainText(detailFields['note'])}
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
