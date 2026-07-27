<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.UrlPreview_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const urlPreviewTimestamp = $derived(selection({
		fields: {
			title: true,
			siteName: true,
			previewStatus: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.title ?? '') || 'URL preview timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<EntityView
	entityType={EntityType.UrlPreview_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				url: encodeURIComponent(String(selection.entitySelector.$url.url)),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet children(entity)}
				{@const reference = entity.$image}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
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
			{#snippet children(entity)}
				{@const title0 = entity.title}
				{#if title0 != null}
					{title0}
				{/if}

				<UrlView
					selection={select(EntityType.Url, selection.entitySelector.$url)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), (entity.siteName ?? '')].filter(Boolean).join(' ') || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={urlPreviewTimestamp}>
			{#snippet children(entity)}
				{@const previewStatus0 = entity.previewStatus}
				{#if previewStatus0 != null}
					<span data-text="muted">
						{previewStatus0}
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
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={urlPreviewTimestamp}
			>
				{#snippet children(entity)}
					{@const previewStatus = entity.previewStatus}
					{#if previewStatus != null}
						<div>
							<dt>Preview status</dt>
							<dd>
								{previewStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={urlPreviewTimestamp}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>Title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={urlPreviewTimestamp}
			>
				{#snippet children(entity)}
					{@const siteName = entity.siteName}
					{#if siteName != null}
						<div>
							<dt>Site name</dt>
							<dd>
								{siteName}
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
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
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
				{#snippet children(entity)}
					{@const imageUrl = entity.imageUrl}
					{#if imageUrl != null}
						<div>
							<dt>Image URL</dt>
							<dd>
								<a
									href={String(imageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(imageUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$image}
			>
				{#snippet children(media)}
					{#if media != null}
						<div>
							<dt>Image</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
									prefetched={media}
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
						selection={select(EntityType.Url, selection.entitySelector.$url)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
