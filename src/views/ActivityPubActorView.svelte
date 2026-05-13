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
			{#snippet Pending()}{/snippet}
			{#snippet children(u)}
				<HeadingComponent>
					{u.displayName
						?? u.acct
						?? u.username
						?? entityId.localAccountId}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet Pending()}{/snippet}
			{#snippet children(u)}
				{#if u.$icon}
					<IconComponent
						alt={u.displayName ?? u.acct ?? u.username ?? entityId.localAccountId}
						shape={IconShape.Circle}
						src={u.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={actor}>
			{#snippet Pending()}{/snippet}
			{#snippet children(u)}
				{@const heading =
					u.displayName
					?? u.acct
					?? u.username
					?? entityId.localAccountId}
				{#if u.username !== undefined && u.username !== heading}
					<span data-text="muted">
						@{u.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary
				resource={actor}
				placeholderText="Loading account…"
			>
				{#snippet children(u)}
					{#if u.note}
						<p data-text="muted">
							{htmlToPlainText(u.note)}
						</p>
					{/if}
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
				{#snippet children(u)}
					{#if u.acct == null && u.displayName == null && u.username == null && u.note == null}
						<p data-text="muted">
							Profile details are not available yet for this account.
						</p>
					{:else}
						<dl>
							{#if u.username}
								<div>
									<dt>Username</dt>
									<dd>{u.username}</dd>
								</div>
							{/if}
							{#if u.acct}
								<div>
									<dt>Acct</dt>
									<dd>{u.acct}</dd>
								</div>
							{/if}
							{#if u.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{u.displayName}</dd>
								</div>
							{/if}
							{#if u.note}
								<div>
									<dt>About</dt>
									<dd>
										{htmlToPlainText(u.note)}
									</dd>
								</div>
							{/if}
						</dl>
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
