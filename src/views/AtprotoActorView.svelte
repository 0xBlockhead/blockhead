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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AtprotoActor>>
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
	const atprotoActor = $derived(selection({
		sources: [
			Source.Atproto_Xrpc,
		],
		fields: {
			$icon: true,
			displayName: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.displayName) ?? ''), String((prefetched.handle) ?? '')].filter(Boolean).join(' ') || [String((prefetched.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account')
	const viewDomId = $derived('atproto-actor-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.did !== undefined ? resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: encodeURIComponent(String(pendingEntity.did ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={atprotoActor}>
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
		<ResourceBoundary resource={atprotoActor}>
			{#snippet Pending()}
				{[String((prefetched.displayName) ?? ''), String((prefetched.handle) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.handle) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={atprotoActor}>
			{#snippet Pending()}
				{@const handle0 = prefetched.handle}
				{#if handle0 !== undefined && handle0 !== null}
					<span data-text="muted">
						{String((handle0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const handle0 = resolvedEntity.handle}
				{#if handle0 !== undefined && handle0 !== null}
					<span data-text="muted">
						{String((handle0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Handle</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									handle: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const handle = prefetched.handle}
							{#if handle !== undefined && handle !== null}
								<span>@</span>
								{String((handle) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const handle = resolvedEntity.handle}
							{#if handle !== undefined && handle !== null}
								<span>@</span>
								{String((handle) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									did: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const did = prefetched.did}
							{#if did !== undefined && did !== null}
								<TruncatedValue value={String((did) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const did = resolvedEntity.did}
							{#if did !== undefined && did !== null}
								<TruncatedValue value={String((did) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								indexedAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const indexedAt = prefetched.indexedAt}
						{#if indexedAt !== undefined && indexedAt !== null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp timestamp={Number(indexedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const indexedAt = resolvedEntity.indexedAt}
						{#if indexedAt !== undefined && indexedAt !== null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp timestamp={Number(indexedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Media, false>('$icon')}
				>
					{#snippet children(media)}
						{#if media != null && media[EntityMetaKey.Selector] != null}
							<div>
								<dt>Avatar</dt>
								<dd>
									<MediaView
										selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
										prefetched={media}
										href={
											(({ ...media[EntityMetaKey.Selector], ...media }).url !== undefined ? resolve('/(explore)/media/[url]', {
												url: String(({ ...media[EntityMetaKey.Selector], ...media }).url ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Media, false>('$banner')}
				>
					{#snippet children(media)}
						{#if media != null && media[EntityMetaKey.Selector] != null}
							<div>
								<dt>Banner</dt>
								<dd>
									<MediaView
										selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
										prefetched={media}
										href={
											(({ ...media[EntityMetaKey.Selector], ...media }).url !== undefined ? resolve('/(explore)/media/[url]', {
												url: String(({ ...media[EntityMetaKey.Selector], ...media }).url ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AtprotoPostsView
				selection={
						selection[EntityProxyField]<EntityType.AtprotoPost>('$$posts', {
							sources: [
								Source.Atproto_Xrpc,
							],
						})
					}
				title='Posts'
				href={resolve('/(social)/(atproto)/atproto/posts')}
				id='AtprotoPostsView-$$posts'
			/>

			<AtprotoActor_TimestampsView
				selection={
						selection[EntityProxyField]<EntityType.AtprotoActor_Timestamp>('$$timestamps', {
							sources: [
								Source.Atproto_Xrpc,
							],
						})
					}
				title='Metric observations'
				id='AtprotoActor_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
