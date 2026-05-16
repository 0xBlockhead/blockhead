<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
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
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const actor = useEntity(
		EntityType.ActivityPubActor,
		entityId,
		{
			$: [Source.Mastodon_Rest],
			username: {},
			acct: {},
			displayName: {},
			note: {},
			$icon: {},
		},
	)


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading account…"
		>
			{#snippet children(activityPubActorRow)}
				{activityPubActorRow.displayName
					?? activityPubActorRow.acct
					?? activityPubActorRow.username
					?? entityId.localAccountId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet children(activityPubActorRow)}
				{#if activityPubActorRow.$icon}
					<IconComponent
						alt={activityPubActorRow.displayName ?? activityPubActorRow.acct ?? activityPubActorRow.username ?? entityId.localAccountId}
						shape={IconShape.Circle}
						src={activityPubActorRow.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.localAccountId}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={actor}>
			{#snippet children(activityPubActorRow)}
				{@const activityPubSummaryHeadingLine =
					activityPubActorRow.displayName
					?? activityPubActorRow.acct
					?? activityPubActorRow.username
					?? entityId.localAccountId}
				{#if activityPubActorRow.username && activityPubActorRow.username !== activityPubSummaryHeadingLine}
					<span data-text="muted">
						@{activityPubActorRow.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<div data-column>
			<ResourceBoundary
				resource={actor}
				placeholderText="Loading account…"
			>
			{#snippet children(activityPubActorRow)}
				{@const activityPubSummaryHeadingLine = (
					activityPubActorRow.displayName
					?? activityPubActorRow.acct
					?? activityPubActorRow.username
					?? entityId.localAccountId
				)}
				{#if activityPubActorRow.note}
						{#if !open}
							<p data-text="muted">
								{htmlToPlainText(activityPubActorRow.note)}
							</p>
						{/if}
					{/if}
					<dl data-column-item="center">
						{#if activityPubSummaryHeadingLine !== entityId.localAccountId}
							<div>
								<dt>Local account id</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if open}
							{#if activityPubActorRow.username}
								<div>
									<dt>Username</dt>
									<dd>{activityPubActorRow.username}</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if activityPubActorRow.acct}
								<div>
									<dt>Acct</dt>
									<dd>{activityPubActorRow.acct}</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if activityPubActorRow.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{activityPubActorRow.displayName}</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if activityPubActorRow.note}
								<div>
									<dt>About</dt>
									<dd>
										{htmlToPlainText(activityPubActorRow.note)}
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>

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
			<ResourceBoundary resource={actor}>
				{#snippet children(activityPubActorRow)}
					{#if (
						activityPubActorRow.acct == null
						&& activityPubActorRow.displayName == null
						&& activityPubActorRow.username == null
						&& activityPubActorRow.note == null
					)}
						<p data-text="muted">
							Profile details are not available yet for this account.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
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
