<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubNote>>
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
	const activityPubNote = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.content) ?? ''), String((prefetched.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note')
	const viewDomId = $derived('activity-pub-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.instanceOrigin !== undefined && pendingEntity.localStatusId !== undefined ? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
			instanceOrigin: String(pendingEntity.instanceOrigin ?? ''),
			localStatusId: String(pendingEntity.localStatusId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet Pending()}
				{[String((prefetched.content) ?? ''), String((prefetched.localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.content) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet Pending()}
				{[String((prefetched.createdAt) ?? ''), String((prefetched.localStatusId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.content) ?? ''), String((prefetched.localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.createdAt) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.content) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ActivityPubActor, false>('$author')}
			>
				{#snippet children(activityPubActor)}
					{#if activityPubActor != null && activityPubActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<ActivityPubActorView
									selection={select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector])}
									prefetched={activityPubActor}
									href={
										(activityPubActor[EntityMetaKey.Selector].instanceOrigin !== undefined && activityPubActor[EntityMetaKey.Selector].localAccountId !== undefined ? resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
											instanceOrigin: String(activityPubActor[EntityMetaKey.Selector].instanceOrigin ?? ''),
											localAccountId: String(activityPubActor[EntityMetaKey.Selector].localAccountId ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
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
						fields: {
							statusUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statusUrl = prefetched.statusUrl}
					{#if statusUrl !== undefined && statusUrl !== null}
						<div>
							<dt>Status URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(statusUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(statusUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusUrl = resolvedEntity.statusUrl}
					{#if statusUrl !== undefined && statusUrl !== null}
						<div>
							<dt>Status URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(statusUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(statusUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ActivityStreams URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									activityStreamsUri: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const activityStreamsUri = prefetched.activityStreamsUri}
							{#if activityStreamsUri !== undefined && activityStreamsUri !== null}
								<svelte:element
									this={'a'}
									href={String(activityStreamsUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(activityStreamsUri)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const activityStreamsUri = resolvedEntity.activityStreamsUri}
							{#if activityStreamsUri !== undefined && activityStreamsUri !== null}
								<svelte:element
									this={'a'}
									href={String(activityStreamsUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(activityStreamsUri)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{#if content !== undefined && content !== null && content !== ''}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
