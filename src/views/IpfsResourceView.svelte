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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
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
		},
	}))
	const titleFallback = $derived([String((prefetched.canonicalUri) ?? '')].filter(Boolean).join(' ') || 'IPFS resource')
	const viewDomId = $derived('ipfs-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.namespace !== undefined && pendingEntity.target !== undefined ? resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]', {
			namespace: String(pendingEntity.namespace ?? ''),
			target: String(pendingEntity.target ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ipfsResource}>
			{#snippet Pending()}
				{@const canonicalUri0 = prefetched.canonicalUri}
				{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
					<TruncatedValue value={String((canonicalUri0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const canonicalUri0 = resolvedEntity.canonicalUri}
				{#if canonicalUri0 !== undefined && canonicalUri0 !== null}
					<TruncatedValue value={String((canonicalUri0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ipfsResource}>
			{#snippet Pending()}
				{[String((prefetched.contentType) ?? ''), String((prefetched.displayType) ?? '')].filter(Boolean).join(' ') || [String((prefetched.canonicalUri) ?? '')].filter(Boolean).join(' ') || title || 'IPFS resource'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.contentType) ?? ''), String((resolvedEntity.displayType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const namespace = selection.entitySelector.namespace ?? prefetched.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									target: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const target = selection.entitySelector.target ?? prefetched.target}
							{#if target !== undefined && target !== null}
								<TruncatedValue value={String((target) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const target = resolvedEntity.target}
							{#if target !== undefined && target !== null}
								<TruncatedValue value={String((target) ?? '')} />
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
								fields: {
									contentPath: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contentPath = selection.entitySelector.contentPath ?? prefetched.contentPath}
							{#if contentPath !== undefined && contentPath !== null}
								{String((contentPath) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									canonicalUri: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const canonicalUri = prefetched.canonicalUri}
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
								fields: {
									gatewayUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const gatewayUrl = prefetched.gatewayUrl}
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
								fields: {
									gatewayOrigin: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const gatewayOrigin = prefetched.gatewayOrigin}
							{#if gatewayOrigin !== undefined && gatewayOrigin !== null}
								{String((gatewayOrigin) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							fileName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fileName = prefetched.fileName}
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
						fields: {
							extension: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const extension = prefetched.extension}
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
						fields: {
							contentType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentType = prefetched.contentType}
					{#if contentType !== undefined && contentType !== null}
						<div>
							<dt>Content type</dt>
							<dd>
								{String((contentType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							contentLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentLength = prefetched.contentLength}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentLength = resolvedEntity.contentLength}
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
				<dt>Display type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									displayType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const displayType = prefetched.displayType}
							{#if displayType !== undefined && displayType !== null}
								{String((displayType) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									isContentTypeInferred: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const isContentTypeInferred = prefetched.isContentTypeInferred}
							{#if isContentTypeInferred !== undefined && isContentTypeInferred !== null}
								{isContentTypeInferred ? 'Yes' : 'No'}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.Media, false>('$media')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							cidVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cidVersion = prefetched.cidVersion}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cidVersion = resolvedEntity.cidVersion}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cidMultibase: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cidMultibase = prefetched.cidMultibase}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cidMultibase = resolvedEntity.cidMultibase}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cidMulticodecCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cidMulticodecCode = prefetched.cidMulticodecCode}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cidMulticodecCode = resolvedEntity.cidMulticodecCode}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cidMultihashCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cidMultihashCode = prefetched.cidMultihashCode}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cidMultihashCode = resolvedEntity.cidMultihashCode}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cidMultihashDigestHex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cidMultihashDigestHex = prefetched.cidMultihashDigestHex}
					{#if cidMultihashDigestHex !== undefined && cidMultihashDigestHex !== null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								<TruncatedValue value={String((cidMultihashDigestHex) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cidMultihashDigestHex = resolvedEntity.cidMultihashDigestHex}
					{#if cidMultihashDigestHex !== undefined && cidMultihashDigestHex !== null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								<TruncatedValue value={String((cidMultihashDigestHex) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isCidSubdomainSafe: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isCidSubdomainSafe = prefetched.isCidSubdomainSafe}
					{#if isCidSubdomainSafe !== undefined && isCidSubdomainSafe !== null}
						<div>
							<dt>CID subdomain safe</dt>
							<dd>
								{isCidSubdomainSafe ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isCidSubdomainSafe = resolvedEntity.isCidSubdomainSafe}
					{#if isCidSubdomainSafe !== undefined && isCidSubdomainSafe !== null}
						<div>
							<dt>CID subdomain safe</dt>
							<dd>
								{isCidSubdomainSafe ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
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
