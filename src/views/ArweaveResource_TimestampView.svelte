<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ArweaveResource_Timestamp>, 'prefetched'> = $props()

	const resource = $derived(selection.entitySelector.$resource)
	const arweaveResourceTimestamp = $derived(selection({
		fields: {
			contentType: true,
			displayType: true,
			reachable: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveResource_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(arweave)/arweave/resource/[transactionId=stringSegment]/[contentPath=stringSegment]/(arweaveResource)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					transactionId: resource.transactionId,
					contentPath: resource.contentPath,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
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
		<ResourceBoundary resource={arweaveResourceTimestamp}>
			{#snippet children(entity)}
				{[(entity.contentType ?? ''), (entity.displayType ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={arweaveResourceTimestamp}>
			{#snippet children(entity)}
				{@const reachable = entity.reachable}
				{#if reachable != null}
					<span data-text="muted">
						{reachable ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>resource</dt>
				<dd>
					<ArweaveResourceView
						selection={select(EntityType.ArweaveResource, selection.entitySelector.$resource)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
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
				<dt>gateway origin</dt>
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
						{#snippet children(entity)}
							{entity.gatewayOrigin}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>gateway URL</dt>
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
			<ResourceBoundary
				resource={arweaveResourceTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fileName = entity.fileName}
					{#if fileName != null}
						<div>
							<dt>file name</dt>
							<dd>
								{fileName}
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
				{#snippet children(entity)}
					{@const extension = entity.extension}
					{#if extension != null}
						<div>
							<dt>extension</dt>
							<dd>
								{extension}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={arweaveResourceTimestamp}
			>
				{#snippet children(entity)}
					{@const contentType = entity.contentType}
					{#if contentType != null}
						<div>
							<dt>content type</dt>
							<dd>
								{contentType}
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
				{#snippet children(entity)}
					{@const contentLength = entity.contentLength}
					{#if contentLength != null}
						<div>
							<dt>content length</dt>
							<dd>
								<NumberValue
									value={contentLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={arweaveResourceTimestamp}
			>
				{#snippet children(entity)}
					{@const displayType = entity.displayType}
					{#if displayType != null}
						<div>
							<dt>display type</dt>
							<dd>
								{displayType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isContentTypeInferred: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isContentTypeInferred = entity.isContentTypeInferred}
					{#if isContentTypeInferred != null}
						<div>
							<dt>is content type inferred</dt>
							<dd>
								{isContentTypeInferred ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const text = entity.text}
					{#if text != null}
						<div>
							<dt>text</dt>
							<dd>
								{text}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$media}
			>
				{#snippet children(media)}
					{#if media != null}
						{@const mediaInitial = untrack(() => media)}
						<div>
							<dt>media</dt>
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
	{/snippet}
</EntityView>
