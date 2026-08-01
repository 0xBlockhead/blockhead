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
	}: EntitySelectionViewProps<EntityType.SwarmResource> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Swarm_Rest,
		],
	}))
	const swarmResource = $derived(viewSelection({
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
	const titleFallback = $derived((prefetched.canonicalUri ?? '') || 'Swarm resource')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.contentPath === '' ?
					resolve(
						'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
						{
							reference: selection.entitySelector.reference,
						}
					)
				:
					resolve(
						'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]',
						{
							reference: selection.entitySelector.reference,
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
		<ResourceBoundary resource={swarmResource}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.canonicalUri} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={swarmResource}>
			{#snippet children(entity)}
				{[(entity.contentType ?? ''), entity.displayType].filter(Boolean).join(' ') || entity.canonicalUri || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Reference</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.reference} />
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
						resource={swarmResource}
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
						resource={swarmResource}
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
						resource={swarmResource}
					>
						{#snippet children(entity)}
							{entity.gatewayOrigin}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={swarmResource}
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
				resource={swarmResource}
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
				resource={swarmResource}
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
				resource={swarmResource}
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
						resource={swarmResource}
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
						resource={swarmResource}
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
								/>
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
