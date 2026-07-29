<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.IpfsResource> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Ipfs_Rest,
		],
	}))
	const ipfsResource = $derived(viewSelection({
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
	const titleFallback = $derived((prefetched.canonicalUri ?? '') || 'IPFS resource')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.contentPath === '' ?
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
						{
							namespace: selection.entitySelector.namespace,
							target: selection.entitySelector.target,
						}
					)
				:
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
						{
							namespace: selection.entitySelector.namespace,
							target: selection.entitySelector.target,
							contentPath: selection.entitySelector.contentPath,
						}
					)
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ipfsResource}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.canonicalUri} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ipfsResource}>
			{#snippet children(entity)}
				{[(entity.contentType ?? ''), entity.displayType].filter(Boolean).join(' ') || entity.canonicalUri || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					{selection.entitySelector.namespace}
				</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.target} />
				</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>
					{selection.entitySelector.contentPath}
				</dd>
			</div>

			<div>
				<dt>Canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							<a
								href={entity.canonicalUri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.canonicalUri} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gateway URL</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							<a
								href={entity.gatewayUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.gatewayUrl} />
							</a>
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
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							{entity.gatewayOrigin}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={ipfsResource}
			>
				{#snippet children(entity)}
					{@const fileName = entity.fileName}
					{#if fileName != null}
						<div>
							<dt>File name</dt>
							<dd>
								{fileName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ipfsResource}
			>
				{#snippet children(entity)}
					{@const extension = entity.extension}
					{#if extension != null}
						<div>
							<dt>Extension</dt>
							<dd>
								{extension}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ipfsResource}
			>
				{#snippet children(entity)}
					{@const contentType = entity.contentType}
					{#if contentType != null}
						<div>
							<dt>Content type</dt>
							<dd>
								{contentType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ipfsResource}
			>
				{#snippet children(entity)}
					{@const contentLength = entity.contentLength}
					{#if contentLength != null}
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
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							{entity.displayType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content type inferred</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							{entity.isContentTypeInferred ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$media}
			>
				{#snippet children(media)}
					{#if media != null}
						<div>
							<dt>Media</dt>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidVersion = entity.cidVersion}
					{#if cidVersion != null}
						<div>
							<dt>CID version</dt>
							<dd>
								<NumberValue
									value={cidVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultibase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultibase = entity.cidMultibase}
					{#if cidMultibase != null}
						<div>
							<dt>CID multibase</dt>
							<dd>
								{cidMultibase}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMulticodecCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMulticodecCode = entity.cidMulticodecCode}
					{#if cidMulticodecCode != null}
						<div>
							<dt>CID multicodec code</dt>
							<dd>
								<NumberValue
									value={cidMulticodecCode}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultihashCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultihashCode = entity.cidMultihashCode}
					{#if cidMultihashCode != null}
						<div>
							<dt>CID multihash code</dt>
							<dd>
								<NumberValue
									value={cidMultihashCode}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultihashDigestHex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultihashDigestHex = entity.cidMultihashDigestHex}
					{#if cidMultihashDigestHex != null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								<TruncatedValue value={cidMultihashDigestHex} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isCidSubdomainSafe: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isCidSubdomainSafe = entity.isCidSubdomainSafe}
					{#if isCidSubdomainSafe != null}
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
				viewSelection({
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p data-text="long-text">{text}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
