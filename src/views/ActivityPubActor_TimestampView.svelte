<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubActor_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ActivityPubActor_Timestamp>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const activityPubActorTimestamp = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('ActivityPub actor observation')
	const viewDomId = $derived('activity-pub-actor-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$actor !== undefined && pendingEntity.$actor.instanceOrigin !== undefined && pendingEntity.$actor.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			instanceOrigin: encodeURIComponent(String(pendingEntity.$actor.instanceOrigin ?? '')),
			localAccountId: String(pendingEntity.$actor.localAccountId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
						href={
						(selection.entitySelector.$actor.instanceOrigin !== undefined && selection.entitySelector.$actor.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
							instanceOrigin: encodeURIComponent(String(selection.entitySelector.$actor.instanceOrigin ?? '')),
							localAccountId: String(selection.entitySelector.$actor.localAccountId ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
						href={
						(selection.entitySelector.$actor.instanceOrigin !== undefined && selection.entitySelector.$actor.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
							instanceOrigin: encodeURIComponent(String(selection.entitySelector.$actor.instanceOrigin ?? '')),
							localAccountId: String(selection.entitySelector.$actor.localAccountId ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={activityPubActorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Actor</dt>
				<dd>
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.instanceOrigin !== undefined && selection.entitySelector.$actor.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
								instanceOrigin: encodeURIComponent(String(selection.entitySelector.$actor.instanceOrigin ?? '')),
								localAccountId: String(selection.entitySelector.$actor.localAccountId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							followersCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const followersCount = resolvedEntity.followersCount}
					{#if followersCount !== undefined && followersCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue
									value={followersCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							followingCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const followingCount = resolvedEntity.followingCount}
					{#if followingCount !== undefined && followingCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue
									value={followingCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							statusesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusesCount = resolvedEntity.statusesCount}
					{#if statusesCount !== undefined && statusesCount !== null}
						<div>
							<dt>Statuses</dt>
							<dd>
								<NumberValue
									value={statusesCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
