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

	const urlPreviewTimestamp = $derived(selection({
		fields: {
			$image: true,
			title: true,
			siteName: true,
			previewStatus: true,
			description: true,
			imageUrl: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || 'URL preview timestamp')
	const viewDomId = $derived('url-preview-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UrlView from '$/views/UrlView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.UrlPreview_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/url/[url]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			url: encodeURIComponent(String(({ ...selection.entitySelector, ...prefetched }).$url.url)),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: encodeURIComponent(String(({ ...selection.entitySelector, ...prefetched }).source)),
		})
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const title0 = ({ ...selection.entitySelector, ...prefetched }).title}
			{#if title0 !== undefined && title0 !== null}
				{String((title0) ?? '')}
			{/if}

			<UrlView
				selection={select(EntityType.Url, selection.entitySelector.$url)}
				href={
						resolve('/(explore)/url/[url]', {
							url: encodeURIComponent(String(selection.entitySelector.$url.url)),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={urlPreviewTimestamp}>
				{#snippet Pending()}
					{@const title0 = ({ ...selection.entitySelector, ...prefetched }).title}
					{#if title0 !== undefined && title0 !== null}
						{String((title0) ?? '')}
					{/if}

					<UrlView
						selection={select(EntityType.Url, selection.entitySelector.$url)}
						href={
							resolve('/(explore)/url/[url]', {
								url: encodeURIComponent(String(selection.entitySelector.$url.url)),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					{@const title0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).title}
					{#if title0 !== undefined && title0 !== null}
						{String((title0) ?? '')}
					{/if}

					<UrlView
						selection={select(EntityType.Url, selection.entitySelector.$url)}
						href={
							resolve('/(explore)/url/[url]', {
								url: encodeURIComponent(String(selection.entitySelector.$url.url)),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).siteName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || 'URL preview timestamp'}
		{:else}
			<ResourceBoundary resource={urlPreviewTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).siteName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || 'URL preview timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? ''), String((entity.siteName) ?? '')].filter(Boolean).join(' ') || [String((entity.title) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const previewStatus0 = prefetched.previewStatus}
			{#if previewStatus0 !== undefined && previewStatus0 !== null}
				<span data-text="muted">
					{String((previewStatus0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={urlPreviewTimestamp}>
				{#snippet Pending()}
					{@const previewStatus0 = prefetched.previewStatus}
					{#if previewStatus0 !== undefined && previewStatus0 !== null}
						<span data-text="muted">
							{String((previewStatus0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const previewStatus0 = entity.previewStatus}
					{#if previewStatus0 !== undefined && previewStatus0 !== null}
						<span data-text="muted">
							{String((previewStatus0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={urlPreviewTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={urlPreviewTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={urlPreviewTimestamp}>
				{#snippet Pending()}
					{@const description = prefetched.description ?? selection.entitySelector.description}
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
					{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
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

			<ResourceBoundary resource={urlPreviewTimestamp}>
				{#snippet Pending()}
					{@const imageUrl = prefetched.imageUrl ?? selection.entitySelector.imageUrl}
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
					{@const imageUrl = entity.imageUrl ?? selection.entitySelector.imageUrl ?? prefetched.imageUrl}
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
		</dl>
	{/snippet}
</EntityView>
