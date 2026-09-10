<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IpfsResource_Timestamp>, 'prefetched'> = $props()

	const resource = $derived(selection.entitySelector.$resource)
	const ipfsResourceTimestamp = $derived(selection({
		sources: selection.sources ?? [
			Source.Ipfs_Rest,
		],
		fields: {
			gatewayOrigin: true,
			gatewayUrl: true,
			fileName: true,
			extension: true,
			contentType: true,
			contentLength: true,
			displayType: true,
			isContentTypeInferred: true,
			text: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				resource.contentPath != null
				&& resource.contentPath !== '' ?
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]/path/[...contentPath=stringSegment]',
						{
							namespace: resource.namespace,
							target: resource.target,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
							contentPath: resource.contentPath,
						}
					)
				:
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							namespace: resource.namespace,
							target: resource.target,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ipfsResourceTimestamp}>
			{#snippet children(entity)}
				{[(entity.contentType ?? ''), entity.displayType].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>{selection.entitySelector.$resource.namespace}</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>{selection.entitySelector.$resource.target}</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>{selection.entitySelector.$resource.contentPath}</dd>
			</div>

			<div>
				<dt>Captured</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Gateway URL</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResourceTimestamp}
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
						resource={ipfsResourceTimestamp}
					>
						{#snippet children(entity)}
							{entity.gatewayOrigin}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={ipfsResourceTimestamp}
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
				resource={ipfsResourceTimestamp}
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
				resource={ipfsResourceTimestamp}
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
				resource={ipfsResourceTimestamp}
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
						resource={ipfsResourceTimestamp}
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
						resource={ipfsResourceTimestamp}
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
						{@const mediaInitial = untrack(() => media)}
						<div>
							<dt>Media</dt>
							<dd>
								<MediaView
									selection={select(EntityType.Media, (media ?? mediaInitial)[EntityMetaKey.Selector])}
									prefetched={media ?? mediaInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={ipfsResourceTimestamp}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p data-text="long-text">{text}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={ipfsResourceTimestamp}
		>
			{#snippet children(entity)}
				{@const artifactContent = entity.text}
				{#if artifactContent != null && artifactContent !== ''}
					<a
						href={`data:text/plain;charset=utf-8,${encodeURIComponent(artifactContent)}`}
						download='ipfs-resource.txt'
					>
						Download resolved text
					</a>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
