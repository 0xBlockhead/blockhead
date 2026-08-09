<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.BlockheadLocalMediaIngest> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadLocalMediaIngest = $derived(viewSelection({
		fields: {
			createdAt: true,
			fileName: true,
			mimeType: true,
		},
	}))
	const titleFallback = $derived((prefetched.fileName ?? '') || selection.entitySelector.ingestId || 'local media ingest')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLocalMediaIngest_TimestampsView from '$/views/BlockheadLocalMediaIngest_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLocalMediaIngest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/media/ingest/[ingestId=stringSegment]',
				{
					ingestId: selection.entitySelector.ingestId,
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
		<ResourceBoundary resource={blockheadLocalMediaIngest}>
			{#snippet children(entity)}
				{(entity.fileName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLocalMediaIngest}>
			{#snippet children(entity)}
				{(entity.mimeType ?? '') || (entity.fileName ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLocalMediaIngest}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ingest ID</dt>
				<dd>
					{selection.entitySelector.ingestId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLocalMediaIngest}
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
				resource={blockheadLocalMediaIngest}
			>
				{#snippet children(entity)}
					{@const mimeType = entity.mimeType}
					{#if mimeType != null}
						<div>
							<dt>MIME type</dt>
							<dd>
								{mimeType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const size = entity.size}
					{#if size != null}
						<div>
							<dt>size</dt>
							<dd>
								<NumberValue
									value={size}
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
							sha256: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sha256 = entity.sha256}
					{#if sha256 != null}
						<div>
							<dt>SHA-256</dt>
							<dd>
								{sha256}
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
						<div>
							<dt>media</dt>
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

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadLocalMediaIngest}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLocalMediaIngest_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
