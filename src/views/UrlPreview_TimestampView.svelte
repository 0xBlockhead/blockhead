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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.UrlPreview_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UrlPreview_Timestamp>>
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
	const urlPreviewTimestamp = $derived(selection({
		fields: {
			title: true,
			siteName: true,
			previewStatus: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || 'URL preview timestamp')
	const viewDomId = $derived('url-preview-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<EntityView
	entityType={EntityType.UrlPreview_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$url !== undefined && pendingEntity.$url.url !== undefined ? resolve('/url/[url=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			url: String(pendingEntity.$url.url ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$image}
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
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet Pending()}
				{@const title0 = pendingEntity.title}
				{#if title0 !== undefined && title0 !== null}
					{String((title0) ?? '')}
				{/if}

				<UrlView
					selection={select(EntityType.Url, selection.entitySelector.$url)}
					href={
						(selection.entitySelector.$url.url !== undefined ? resolve('/url/[url=absoluteUrl]', {
							url: String(selection.entitySelector.$url.url ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const title0 = resolvedEntity.title}
				{#if title0 !== undefined && title0 !== null}
					{String((title0) ?? '')}
				{/if}

				<UrlView
					selection={select(EntityType.Url, selection.entitySelector.$url)}
					href={
						(selection.entitySelector.$url.url !== undefined ? resolve('/url/[url=absoluteUrl]', {
							url: String(selection.entitySelector.$url.url ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.title) ?? ''), String((pendingEntity.siteName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || title || 'URL preview timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.siteName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet Pending()}
				{@const previewStatus0 = pendingEntity.previewStatus}
				{#if previewStatus0 !== undefined && previewStatus0 !== null}
					<span data-text="muted">
						{String((previewStatus0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const previewStatus0 = resolvedEntity.previewStatus}
				{#if previewStatus0 !== undefined && previewStatus0 !== null}
					<span data-text="muted">
						{String((previewStatus0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previewStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previewStatus = pendingEntity.previewStatus}
					{#if previewStatus !== undefined && previewStatus !== null}
						<div>
							<dt>Preview status</dt>
							<dd>
								{String((previewStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previewStatus = resolvedEntity.previewStatus}
					{#if previewStatus !== undefined && previewStatus !== null}
						<div>
							<dt>Preview status</dt>
							<dd>
								{String((previewStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const title = pendingEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
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
							siteName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const siteName = pendingEntity.siteName}
					{#if siteName !== undefined && siteName !== null}
						<div>
							<dt>Site name</dt>
							<dd>
								{String((siteName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const siteName = resolvedEntity.siteName}
					{#if siteName !== undefined && siteName !== null}
						<div>
							<dt>Site name</dt>
							<dd>
								{String((siteName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = pendingEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							imageUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const imageUrl = pendingEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(imageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(imageUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const imageUrl = resolvedEntity.imageUrl}
					{#if imageUrl !== undefined && imageUrl !== null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(imageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(imageUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$image}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(media)}
					{#if media != null && media[EntityMetaKey.Selector] != null}
						<div>
							<dt>Image</dt>
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

			<div>
				<dt>URL</dt>
				<dd>
					<UrlView
						selection={select(EntityType.Url, selection.entitySelector.$url, {})}
						href={
							(selection.entitySelector.$url.url !== undefined ? resolve('/url/[url=absoluteUrl]', {
								url: String(selection.entitySelector.$url.url ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
