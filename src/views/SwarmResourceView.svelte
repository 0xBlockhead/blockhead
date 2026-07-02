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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.SwarmResource>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SwarmResource>>
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

	const swarmResource = $derived(selection({
		sources: [
			Source.Swarm_Rest,
		],
		fields: {
			canonicalUri: true,
			gatewayOrigin: true,
			gatewayUrl: true,
			fileName: true,
			extension: true,
			contentType: true,
			contentLength: true,
			displayType: true,
			isContentTypeInferred: true,
			...(open && {
				text: true,
				$media: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || 'Swarm resource')
	const viewDomId = $derived('swarm-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmResource}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.reference != null && ({ ...selection.entitySelector, ...prefetched })?.contentPath != null ? resolve('/(explore)/(swarm)/swarm/[reference]', {
			reference: String(({ ...selection.entitySelector, ...prefetched }).reference),
		}) : ({ ...selection.entitySelector, ...prefetched })?.reference != null && ({ ...selection.entitySelector, ...prefetched })?.contentPath != null ? resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
			reference: String(({ ...selection.entitySelector, ...prefetched }).reference),
			contentPath: String(({ ...selection.entitySelector, ...prefetched }).contentPath),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const canonicalUri0 = ({ ...selection.entitySelector, ...prefetched }).canonicalUri}
			{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
				<TruncatedValue value={String(canonicalUri0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={swarmResource}>
				{#snippet Pending()}
					{@const canonicalUri0 = ({ ...selection.entitySelector, ...prefetched }).canonicalUri}
					{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
						<TruncatedValue value={String(canonicalUri0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const canonicalUri0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).canonicalUri}
					{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
						<TruncatedValue value={String(canonicalUri0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).contentType) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).displayType) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || title || 'Swarm resource'}
		{:else}
			<ResourceBoundary resource={swarmResource}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).contentType) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).displayType) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || title || 'Swarm resource'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.contentType) ?? ''), String((entity.displayType) ?? '')].filter(Boolean).join(' ') || [String((entity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Reference</dt>
				<dd>
					<ResourceBoundary resource={swarmResource}>
						{#snippet Pending()}
							{@const reference = prefetched.reference ?? selection.entitySelector.reference}
							{#if reference !== undefined && reference !== null}
								<TruncatedValue value={String(reference)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const reference = entity.reference ?? selection.entitySelector.reference ?? prefetched.reference}
							{#if reference !== undefined && reference !== null}
								<TruncatedValue value={String(reference)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>
					<ResourceBoundary resource={swarmResource}>
						{#snippet Pending()}
							{@const contentPath = prefetched.contentPath ?? selection.entitySelector.contentPath}
							{#if contentPath !== undefined && contentPath !== null}
								{String((contentPath) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const contentPath = entity.contentPath ?? selection.entitySelector.contentPath ?? prefetched.contentPath}
							{#if contentPath !== undefined && contentPath !== null}
								{String((contentPath) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gateway URL</dt>
				<dd>
					<ResourceBoundary resource={swarmResource}>
						{#snippet Pending()}
							{@const gatewayUrl = prefetched.gatewayUrl ?? selection.entitySelector.gatewayUrl}
							{#if gatewayUrl !== undefined && gatewayUrl !== null}
								<svelte:element
									this={'a'}
									href={String(gatewayUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(gatewayUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const gatewayUrl = entity.gatewayUrl ?? selection.entitySelector.gatewayUrl ?? prefetched.gatewayUrl}
							{#if gatewayUrl !== undefined && gatewayUrl !== null}
								<svelte:element
									this={'a'}
									href={String(gatewayUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(gatewayUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Gateway origin</dt>
				<dd>
					<ResourceBoundary resource={swarmResource}>
						{#snippet Pending()}
							{@const gatewayOrigin = prefetched.gatewayOrigin ?? selection.entitySelector.gatewayOrigin}
							{#if gatewayOrigin !== undefined && gatewayOrigin !== null}
								{String((gatewayOrigin) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const gatewayOrigin = entity.gatewayOrigin ?? selection.entitySelector.gatewayOrigin ?? prefetched.gatewayOrigin}
							{#if gatewayOrigin !== undefined && gatewayOrigin !== null}
								{String((gatewayOrigin) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={swarmResource}>
				{#snippet Pending()}
					{@const fileName = prefetched.fileName ?? selection.entitySelector.fileName}
					{#if fileName !== undefined && fileName !== null}
						<div>
							<dt>File name</dt>
							<dd>
								{String((fileName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fileName = entity.fileName ?? selection.entitySelector.fileName ?? prefetched.fileName}
					{#if fileName !== undefined && fileName !== null}
						<div>
							<dt>File name</dt>
							<dd>
								{String((fileName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={swarmResource}>
				{#snippet Pending()}
					{@const extension = prefetched.extension ?? selection.entitySelector.extension}
					{#if extension !== undefined && extension !== null}
						<div>
							<dt>Extension</dt>
							<dd>
								{String((extension) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const extension = entity.extension ?? selection.entitySelector.extension ?? prefetched.extension}
					{#if extension !== undefined && extension !== null}
						<div>
							<dt>Extension</dt>
							<dd>
								{String((extension) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={swarmResource}>
				{#snippet Pending()}
					{@const contentLength = prefetched.contentLength ?? selection.entitySelector.contentLength}
					{#if contentLength !== undefined && contentLength !== null}
						<div>
							<dt>Content length</dt>
							<dd>
								<NumberValue value={Number(contentLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const contentLength = entity.contentLength ?? selection.entitySelector.contentLength ?? prefetched.contentLength}
					{#if contentLength !== undefined && contentLength !== null}
						<div>
							<dt>Content length</dt>
							<dd>
								<NumberValue value={Number(contentLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Content type inferred</dt>
				<dd>
					<ResourceBoundary resource={swarmResource}>
						{#snippet Pending()}
							{@const isContentTypeInferred = prefetched.isContentTypeInferred ?? selection.entitySelector.isContentTypeInferred}
							{#if isContentTypeInferred !== undefined && isContentTypeInferred !== null}
								{String((isContentTypeInferred) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const isContentTypeInferred = entity.isContentTypeInferred ?? selection.entitySelector.isContentTypeInferred ?? prefetched.isContentTypeInferred}
							{#if isContentTypeInferred !== undefined && isContentTypeInferred !== null}
								{String((isContentTypeInferred) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Media, false>('$media')}
			>
				{#snippet children(media)}
					{#if media != null}
						<div>
							<dt>Media</dt>
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
		</dl>

		<ResourceBoundary resource={swarmResource}>
			{#snippet children(entity)}
				{@const text = entity.text ?? selection.entitySelector.text ?? prefetched.text}
				{#if text === undefined || text === null || text === ''}
					<p data-text="muted">No text available.</p>
				{:else}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
