<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.SwarmResource>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SwarmResource>>
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
	const swarmResource = $derived(selection({
		sources: selection.sources,
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
		},
	}))
	const titleFallback = $derived([String((pendingEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || 'Swarm resource')
	const viewDomId = $derived('swarm-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmResource}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.contentPath === '' && pendingEntity.reference !== undefined ? resolve('/swarm/[reference=stringSegment]', {
			reference: String(pendingEntity.reference ?? ''),
		}) : pendingEntity.contentPath !== '' && pendingEntity.reference !== undefined && pendingEntity.contentPath !== undefined ? resolve('/swarm/[reference=stringSegment]/path/[...contentPath=stringSegment]', {
			reference: String(pendingEntity.reference ?? ''),
			contentPath: String(pendingEntity.contentPath ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const canonicalUri0 = pendingEntity.canonicalUri}
					{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
						<TruncatedValue value={String((canonicalUri0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={swarmResource}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canonicalUri0 = resolvedEntity.canonicalUri}
					{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
						<TruncatedValue value={String((canonicalUri0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.contentType) ?? ''), String((pendingEntity.displayType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={swarmResource}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.contentType) ?? ''), String((resolvedEntity.displayType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Reference</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									reference: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const reference = resolvedEntity.reference}
							{#if reference !== undefined && reference !== null}
								<TruncatedValue value={String((reference) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									contentPath: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contentPath = resolvedEntity.contentPath}
							{#if contentPath !== undefined && contentPath !== null}
								{String((contentPath) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									canonicalUri: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canonicalUri = resolvedEntity.canonicalUri}
							{#if canonicalUri !== undefined && canonicalUri !== null}
								<svelte:element
									this={'a'}
									href={String(canonicalUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(canonicalUri)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gateway URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									gatewayUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const gatewayUrl = resolvedEntity.gatewayUrl}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									gatewayOrigin: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const gatewayOrigin = resolvedEntity.gatewayOrigin}
							{#if gatewayOrigin !== undefined && gatewayOrigin !== null}
								{String((gatewayOrigin) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fileName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fileName = resolvedEntity.fileName}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							extension: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extension = resolvedEntity.extension}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							contentType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentType = resolvedEntity.contentType}
					{#if contentType !== undefined && contentType !== null}
						<div>
							<dt>Content type</dt>
							<dd>
								{String((contentType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							contentLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentLength = resolvedEntity.contentLength}
					{#if contentLength !== undefined && contentLength !== null}
						<div>
							<dt>Content length</dt>
							<dd>
								<NumberValue
									value={contentLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Display type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									displayType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const displayType = resolvedEntity.displayType}
							{#if displayType !== undefined && displayType !== null}
								{String((displayType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content type inferred</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									isContentTypeInferred: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const isContentTypeInferred = resolvedEntity.isContentTypeInferred}
							{#if isContentTypeInferred !== undefined && isContentTypeInferred !== null}
								{isContentTypeInferred ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$media}
			>
				{#snippet children(media)}
					{#if media != null && media[EntityMetaKey.Selector] != null}
						<div>
							<dt>Media</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
									prefetched={media}
									href={
										(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
											url: encodeURIComponent(String(media[EntityMetaKey.Selector].url ?? '')),
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
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text = resolvedEntity.text}
				{#if text !== undefined && text !== null && text !== ''}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
