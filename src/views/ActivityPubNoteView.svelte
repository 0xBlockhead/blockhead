<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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

	const activityPubNote = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
			...(open && {
				$$thread: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).content) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note')
	const viewDomId = $derived('activity-pub-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
			instanceOrigin: String(({ ...selection.entitySelector, ...prefetched }).instanceOrigin),
			localStatusId: String(({ ...selection.entitySelector, ...prefetched }).localStatusId),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).content) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
		{:else}
			<ResourceBoundary resource={activityPubNote}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).content) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.content) ?? ''), String((entity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).createdAt) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).content) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
		{:else}
			<ResourceBoundary resource={activityPubNote}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).createdAt) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).content) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.createdAt) ?? ''), String((entity.localStatusId) ?? '')].filter(Boolean).join(' ') || [String((entity.content) ?? ''), String((entity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ActivityPubActor, false>('$author')}
			>
				{#snippet children(activityPubActor)}
					{#if activityPubActor != null}
						<div>
							<dt>Author</dt>
							<dd>
								<ActivityPubActorView
									selection={select(EntityType.ActivityPubActor, activityPubActor.entitySelector)}
									prefetched={activityPubActor}
									href={
										resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
											instanceOrigin: String(activityPubActor.entitySelector.instanceOrigin),
											localAccountId: String(activityPubActor.entitySelector.localAccountId),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubNote}>
				{#snippet Pending()}
					{@const statusUrl = prefetched.statusUrl ?? selection.entitySelector.statusUrl}
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
					{@const statusUrl = entity.statusUrl ?? selection.entitySelector.statusUrl ?? prefetched.statusUrl}
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
					<ResourceBoundary resource={activityPubNote}>
						{#snippet Pending()}
							{@const activityStreamsUri = prefetched.activityStreamsUri ?? selection.entitySelector.activityStreamsUri}
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
							{@const activityStreamsUri = entity.activityStreamsUri ?? selection.entitySelector.activityStreamsUri ?? prefetched.activityStreamsUri}
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

		<ResourceBoundary resource={activityPubNote}>
			{#snippet children(entity)}
				{@const content = entity.content ?? selection.entitySelector.content ?? prefetched.content}
				{#if content === undefined || content === null || content === ''}
					<p data-text="muted">No content available.</p>
				{:else}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
