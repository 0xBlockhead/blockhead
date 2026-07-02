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
			selection: EntityProxyResource<typeof schema, EntityType.IpfsResource>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IpfsResource>>
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

	const ipfsResource = $derived(selection({
		sources: [
			Source.Ipfs_Rest,
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
				cidVersion: true,
				cidMultibase: true,
				cidMulticodecCode: true,
				cidMultihashCode: true,
				cidMultihashDigestHex: true,
				isCidSubdomainSafe: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || 'IPFS resource')
	const viewDomId = $derived('ipfs-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.namespace != null && ({ ...selection.entitySelector, ...prefetched })?.target != null && ({ ...selection.entitySelector, ...prefetched })?.contentPath != null ? resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]', {
			namespace: String(({ ...selection.entitySelector, ...prefetched }).namespace),
			target: String(({ ...selection.entitySelector, ...prefetched }).target),
		}) : ({ ...selection.entitySelector, ...prefetched })?.namespace != null && ({ ...selection.entitySelector, ...prefetched })?.target != null && ({ ...selection.entitySelector, ...prefetched })?.contentPath != null ? resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]/(ipfsResource)/path/[...contentPath]', {
			namespace: String(({ ...selection.entitySelector, ...prefetched }).namespace),
			target: String(({ ...selection.entitySelector, ...prefetched }).target),
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
			<ResourceBoundary resource={ipfsResource}>
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
			{[String((({ ...selection.entitySelector, ...prefetched }).contentType) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).displayType) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || title || 'IPFS resource'}
		{:else}
			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).contentType) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).displayType) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).canonicalUri) ?? '')].filter(Boolean).join(' ') || title || 'IPFS resource'}
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
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary resource={ipfsResource}>
						{#snippet Pending()}
							{@const namespace = prefetched.namespace ?? selection.entitySelector.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const namespace = entity.namespace ?? selection.entitySelector.namespace ?? prefetched.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>
					<ResourceBoundary resource={ipfsResource}>
						{#snippet Pending()}
							{@const target = prefetched.target ?? selection.entitySelector.target}
							{#if target !== undefined && target !== null}
								<TruncatedValue value={String(target)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const target = entity.target ?? selection.entitySelector.target ?? prefetched.target}
							{#if target !== undefined && target !== null}
								<TruncatedValue value={String(target)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>
					<ResourceBoundary resource={ipfsResource}>
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
					<ResourceBoundary resource={ipfsResource}>
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
					<ResourceBoundary resource={ipfsResource}>
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

			<ResourceBoundary resource={ipfsResource}>
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

			<ResourceBoundary resource={ipfsResource}>
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

			<ResourceBoundary resource={ipfsResource}>
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
					<ResourceBoundary resource={ipfsResource}>
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

		<dl data-column-item="center">
			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const cidVersion = prefetched.cidVersion ?? selection.entitySelector.cidVersion}
					{#if cidVersion !== undefined && cidVersion !== null}
						<div>
							<dt>CID version</dt>
							<dd>
								<NumberValue value={Number(cidVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cidVersion = entity.cidVersion ?? selection.entitySelector.cidVersion ?? prefetched.cidVersion}
					{#if cidVersion !== undefined && cidVersion !== null}
						<div>
							<dt>CID version</dt>
							<dd>
								<NumberValue value={Number(cidVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const cidMultibase = prefetched.cidMultibase ?? selection.entitySelector.cidMultibase}
					{#if cidMultibase !== undefined && cidMultibase !== null}
						<div>
							<dt>CID multibase</dt>
							<dd>
								{String((cidMultibase) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cidMultibase = entity.cidMultibase ?? selection.entitySelector.cidMultibase ?? prefetched.cidMultibase}
					{#if cidMultibase !== undefined && cidMultibase !== null}
						<div>
							<dt>CID multibase</dt>
							<dd>
								{String((cidMultibase) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const cidMulticodecCode = prefetched.cidMulticodecCode ?? selection.entitySelector.cidMulticodecCode}
					{#if cidMulticodecCode !== undefined && cidMulticodecCode !== null}
						<div>
							<dt>CID multicodec code</dt>
							<dd>
								<NumberValue value={Number(cidMulticodecCode)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cidMulticodecCode = entity.cidMulticodecCode ?? selection.entitySelector.cidMulticodecCode ?? prefetched.cidMulticodecCode}
					{#if cidMulticodecCode !== undefined && cidMulticodecCode !== null}
						<div>
							<dt>CID multicodec code</dt>
							<dd>
								<NumberValue value={Number(cidMulticodecCode)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const cidMultihashCode = prefetched.cidMultihashCode ?? selection.entitySelector.cidMultihashCode}
					{#if cidMultihashCode !== undefined && cidMultihashCode !== null}
						<div>
							<dt>CID multihash code</dt>
							<dd>
								<NumberValue value={Number(cidMultihashCode)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cidMultihashCode = entity.cidMultihashCode ?? selection.entitySelector.cidMultihashCode ?? prefetched.cidMultihashCode}
					{#if cidMultihashCode !== undefined && cidMultihashCode !== null}
						<div>
							<dt>CID multihash code</dt>
							<dd>
								<NumberValue value={Number(cidMultihashCode)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const cidMultihashDigestHex = prefetched.cidMultihashDigestHex ?? selection.entitySelector.cidMultihashDigestHex}
					{#if cidMultihashDigestHex !== undefined && cidMultihashDigestHex !== null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								<TruncatedValue value={String(cidMultihashDigestHex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cidMultihashDigestHex = entity.cidMultihashDigestHex ?? selection.entitySelector.cidMultihashDigestHex ?? prefetched.cidMultihashDigestHex}
					{#if cidMultihashDigestHex !== undefined && cidMultihashDigestHex !== null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								<TruncatedValue value={String(cidMultihashDigestHex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ipfsResource}>
				{#snippet Pending()}
					{@const isCidSubdomainSafe = prefetched.isCidSubdomainSafe ?? selection.entitySelector.isCidSubdomainSafe}
					{#if isCidSubdomainSafe !== undefined && isCidSubdomainSafe !== null}
						<div>
							<dt>CID subdomain safe</dt>
							<dd>
								{String((isCidSubdomainSafe) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isCidSubdomainSafe = entity.isCidSubdomainSafe ?? selection.entitySelector.isCidSubdomainSafe ?? prefetched.isCidSubdomainSafe}
					{#if isCidSubdomainSafe !== undefined && isCidSubdomainSafe !== null}
						<div>
							<dt>CID subdomain safe</dt>
							<dd>
								{String((isCidSubdomainSafe) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={ipfsResource}>
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
