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

	const atprotoActor = $derived(selection({
		sources: [
			Source.Atproto_Xrpc,
		],
		fields: {
			$icon: true,
			displayName: true,
			description: true,
			indexedAt: true,
			$banner: true,
			...(open && {
				$$posts: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).handle) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account')
	const viewDomId = $derived('atproto-actor-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).handle) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'}
		{:else}
			<ResourceBoundary resource={atprotoActor}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).handle) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? ''), String((entity.handle) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const handle0 = prefetched.handle}
			{#if handle0 !== undefined && handle0 !== null}
				<span data-text="muted">
					{String((handle0) ?? '')}
				</span>
			{/if}
		{:else}
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
					{@const handle0 = entity.handle}
					{#if handle0 !== undefined && handle0 !== null}
						<span data-text="muted">
							{String((handle0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={atprotoActor}>
					{#snippet Pending()}
						{@const description = prefetched.description ?? selection.entitySelector.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={atprotoActor}>
					{#snippet Pending()}
						{@const indexedAt = prefetched.indexedAt ?? selection.entitySelector.indexedAt}
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
						{@const indexedAt = entity.indexedAt ?? selection.entitySelector.indexedAt ?? prefetched.indexedAt}
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
					resource={selection[EntityProxyField]<EntityType.Media, false>('$banner')}
				>
					{#snippet children(media)}
						{#if media != null}
							<div>
								<dt>Banner</dt>
								<dd>
									<MediaView
										selection={select(EntityType.Media, media.entitySelector)}
										prefetched={media}
										href={
											resolve('/(explore)/media/[url]', {
												url: String(media.entitySelector.url),
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AtprotoPostsView
				selection={selection[EntityProxyField]<EntityType.AtprotoPost>('$$posts')}
				title='Posts'
				href={resolve('/(social)/(atproto)/atproto/posts')}
				id='AtprotoPostsView-$$posts'
			/>

			<AtprotoActor_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AtprotoActor_Timestamp>('$$timestamps')}
				title='Metric observations'
				id='AtprotoActor_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
