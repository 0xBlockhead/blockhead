<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubActor>>
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
	const activityPubActor = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			profileUrl: true,
			createdAt: true,
			$icon: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.displayName) ?? ''), String((prefetched.acct) ?? ''), String((prefetched.username) ?? ''), String((prefetched.localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor')
	const viewDomId = $derived('activity-pub-actor-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.instanceOrigin !== undefined && pendingEntity.localAccountId !== undefined ? resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: String(pendingEntity.instanceOrigin ?? ''),
			localAccountId: String(pendingEntity.localAccountId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet Pending()}
				{[String((prefetched.displayName) ?? ''), String((prefetched.acct) ?? ''), String((prefetched.username) ?? ''), String((prefetched.localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.acct) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet Pending()}
				{[String((prefetched.acct) ?? ''), String((prefetched.localAccountId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.displayName) ?? ''), String((prefetched.acct) ?? ''), String((prefetched.username) ?? ''), String((prefetched.localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.acct) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.acct) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>acct</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									acct: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const acct = prefetched.acct}
							{#if acct !== undefined && acct !== null}
								{String((acct) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const acct = resolvedEntity.acct}
							{#if acct !== undefined && acct !== null}
								{String((acct) ?? '')}
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
						fields: {
							username: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const username = prefetched.username}
					{#if username !== undefined && username !== null}
						<div>
							<dt>Username</dt>
							<dd>
								{String((username) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const username = resolvedEntity.username}
					{#if username !== undefined && username !== null}
						<div>
							<dt>Username</dt>
							<dd>
								{String((username) ?? '')}
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
							profileUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const profileUrl = prefetched.profileUrl}
					{#if profileUrl !== undefined && profileUrl !== null}
						<div>
							<dt>Profile URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(profileUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(profileUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const profileUrl = resolvedEntity.profileUrl}
					{#if profileUrl !== undefined && profileUrl !== null}
						<div>
							<dt>Profile URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(profileUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(profileUrl)} />
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
	{/snippet}
</EntityView>
