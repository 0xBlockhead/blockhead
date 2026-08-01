<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.XUser> = $props()

	const xUser = $derived(selection({
		sources: selection.sources ?? [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	})({
		fields: {
			id: true,
			username: true,
			name: true,
			description: true,
			location: true,
			websiteUrl: true,
			verified: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.username ?? ''), (prefetched.id ?? '')].filter(Boolean).join(' ') || 'X user')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import XUser_TimestampsView from '$/views/XUser_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'id' in selection.entitySelector ?
					resolve(
						'/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
						{
							userId: selection.entitySelector.id,
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
	{#snippet Icon()}
		<ResourceBoundary resource={xUser}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={xUser}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), entity.username, entity.id].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={xUser}>
			{#snippet children(entity)}
				{['@' + entity.username, entity.id].filter(Boolean).join(' ') || [(entity.name ?? ''), entity.username, entity.id].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={xUser}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Username</dt>
				<dd>
					<ResourceBoundary
						resource={xUser}
					>
						{#snippet children(entity)}
							<span>@</span>
							{entity.username}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xUser}
			>
				{#snippet children(entity)}
					{@const verified = entity.verified}
					{#if verified != null}
						<div>
							<dt>Verified</dt>
							<dd>
								{verified ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xUser}
			>
				{#snippet children(entity)}
					{@const location = entity.location}
					{#if location != null}
						<div>
							<dt>Location</dt>
							<dd>
								{location}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xUser}
			>
				{#snippet children(entity)}
					{@const websiteUrl = entity.websiteUrl}
					{#if websiteUrl != null}
						<div>
							<dt>Website URL</dt>
							<dd>
								<a
									href={websiteUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={websiteUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xUser}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={xUser}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const postsResource = selection.$$posts}
		<ResourceBoundary
			resource={postsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XPostsView
						selection={postsResource}
						countResource={postsResource.count}
						title='Posts'
						id='posts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XUser_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
