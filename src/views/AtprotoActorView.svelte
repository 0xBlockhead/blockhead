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
			displayName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? ''), String((pendingEntity.handle) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account')
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
		href ?? (pendingEntity.did !== undefined ? resolve('/atproto/actor/[did=stringSegment]', {
			did: String(pendingEntity.did ?? ''),
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
				{[String((pendingEntity.displayName) ?? ''), String((pendingEntity.handle) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'}
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
				{@const handle0 = pendingEntity.handle}
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
							{@const handle = pendingEntity.handle}
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
							{@const did = pendingEntity.did}
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
						{@const indexedAt = pendingEntity.indexedAt}
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
					resource={selection.$icon}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(media)}
						{#if media != null && media[EntityMetaKey.Selector] != null}
							<div>
								<dt>Avatar</dt>
								<dd>
									<MediaView
										selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
										prefetched={media}
										href={
											(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
												url: String(media[EntityMetaKey.Selector].url ?? ''),
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$banner}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(media)}
						{#if media != null && media[EntityMetaKey.Selector] != null}
							<div>
								<dt>Banner</dt>
								<dd>
									<MediaView
										selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
										prefetched={media}
										href={
											(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
												url: String(media[EntityMetaKey.Selector].url ?? ''),
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
						selection.$$posts({
							sources: [
								Source.Atproto_Xrpc,
							],
							count: true,
						})
					}
				title='Posts'
				href={resolve('/atproto/posts')}
				id='AtprotoPostsView-posts'
			/>

			<AtprotoActor_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Atproto_Xrpc,
							],
							count: true,
						})
					}
				title='Metric observations'
				id='AtprotoActor_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
