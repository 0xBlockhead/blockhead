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

	const activityPubActor = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			profileUrl: true,
			createdAt: true,
			$icon: true,
			...(open && {
				$$timestamps: true,
				$$notes: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor')
	const viewDomId = $derived('activity-pub-actor-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: String(({ ...selection.entitySelector, ...prefetched }).instanceOrigin),
			localAccountId: String(({ ...selection.entitySelector, ...prefetched }).localAccountId),
		})
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
		{:else}
			<ResourceBoundary resource={activityPubActor}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? ''), String((entity.acct) ?? ''), String((entity.username) ?? ''), String((entity.localAccountId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
		{:else}
			<ResourceBoundary resource={activityPubActor}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).acct) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).username) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).localAccountId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub actor'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.acct) ?? ''), String((entity.localAccountId) ?? '')].filter(Boolean).join(' ') || [String((entity.displayName) ?? ''), String((entity.acct) ?? ''), String((entity.username) ?? ''), String((entity.localAccountId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubActor}>
				{#snippet Pending()}
					{@const profileUrl = prefetched.profileUrl ?? selection.entitySelector.profileUrl}
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
					{@const profileUrl = entity.profileUrl ?? selection.entitySelector.profileUrl ?? prefetched.profileUrl}
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
					<ResourceBoundary resource={activityPubActor}>
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

		<dl data-column-item="center">
			<ResourceBoundary resource={activityPubActor}>
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt ?? selection.entitySelector.createdAt}
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
					{@const createdAt = entity.createdAt ?? selection.entitySelector.createdAt ?? prefetched.createdAt}
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
