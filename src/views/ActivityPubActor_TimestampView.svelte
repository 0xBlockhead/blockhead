<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubActor_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const activityPubActorTimestamp = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
		fields: {
			followersCount: true,
			followingCount: true,
			statusesCount: true,
		},
	}))
	const titleFallback = $derived('ActivityPub actor observation')
	const viewDomId = $derived('activity-pub-actor-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ActivityPubActorView
				selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
				href={
						resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
							instanceOrigin: String(selection.entitySelector.$actor.instanceOrigin),
							localAccountId: String(selection.entitySelector.$actor.localAccountId),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet Pending()}
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
						href={
							resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
								instanceOrigin: String(selection.entitySelector.$actor.instanceOrigin),
								localAccountId: String(selection.entitySelector.$actor.localAccountId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
						href={
							resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
								instanceOrigin: String(selection.entitySelector.$actor.instanceOrigin),
								localAccountId: String(selection.entitySelector.$actor.localAccountId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet Pending()}
					{@const followersCount = prefetched.followersCount ?? selection.entitySelector.followersCount}
					{#if followersCount !== undefined && followersCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followersCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const followersCount = entity.followersCount ?? selection.entitySelector.followersCount ?? prefetched.followersCount}
					{#if followersCount !== undefined && followersCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followersCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet Pending()}
					{@const followingCount = prefetched.followingCount ?? selection.entitySelector.followingCount}
					{#if followingCount !== undefined && followingCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followingCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const followingCount = entity.followingCount ?? selection.entitySelector.followingCount ?? prefetched.followingCount}
					{#if followingCount !== undefined && followingCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followingCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet Pending()}
					{@const statusesCount = prefetched.statusesCount ?? selection.entitySelector.statusesCount}
					{#if statusesCount !== undefined && statusesCount !== null}
						<div>
							<dt>Statuses</dt>
							<dd>
								<NumberValue value={Number(statusesCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const statusesCount = entity.statusesCount ?? selection.entitySelector.statusesCount ?? prefetched.statusesCount}
					{#if statusesCount !== undefined && statusesCount !== null}
						<div>
							<dt>Statuses</dt>
							<dd>
								<NumberValue value={Number(statusesCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
