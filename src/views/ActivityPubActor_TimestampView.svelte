<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ActivityPubActor_Timestamp>, 'prefetched'> = $props()

	const actor = $derived(selection.entitySelector.$actor)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ActivityPub actor observation'}
	href={
		href === undefined ?
			(
				'instanceOrigin' in actor
				&& 'localAccountId' in actor ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(actor.instanceOrigin),
							localAccountId: actor.localAccountId,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ActivityPubActorView
			selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Actor</dt>
				<dd>
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, selection.entitySelector.$actor)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							followersCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followersCount = entity.followersCount}
					{#if followersCount != null}
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
					viewSelection({
						fields: {
							followingCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followingCount = entity.followingCount}
					{#if followingCount != null}
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
					viewSelection({
						fields: {
							statusesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusesCount = entity.statusesCount}
					{#if statusesCount != null}
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
