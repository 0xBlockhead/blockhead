<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TokenMetadataDocument> = $props()

	const tokenMetadataDocument = $derived(selection({
		fields: {
			name: true,
			symbol: true,
			metadataStandard: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.symbol ?? ''), selection.entitySelector.metadataKey].filter(Boolean).join(' ') || 'token metadata document')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.TokenMetadataDocument}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet children(entity)}
				{@const reference = entity.$media}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.symbol ?? ''), selection.entitySelector.metadataKey].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet children(entity)}
				{[(entity.metadataStandard ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || [(entity.name ?? ''), (entity.symbol ?? ''), selection.entitySelector.metadataKey].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Metadata subject key</dt>
				<dd>
					{selection.entitySelector.metadataSubjectKey}
				</dd>
			</div>

			<div>
				<dt>Metadata key</dt>
				<dd>
					{selection.entitySelector.metadataKey}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={tokenMetadataDocument}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tokenMetadataDocument}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tokenMetadataDocument}
			>
				{#snippet children(entity)}
					{@const metadataStandard = entity.metadataStandard}
					{#if metadataStandard != null}
						<div>
							<dt>Metadata standard</dt>
							<dd>
								{metadataStandard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mutable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mutable = entity.mutable}
					{#if mutable != null}
						<div>
							<dt>Mutable</dt>
							<dd>
								{mutable ? 'Yes' : 'No'}
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
							uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uri = entity.uri}
					{#if uri != null}
						<div>
							<dt>URI</dt>
							<dd>
								<a
									href={uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={uri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentHash = entity.contentHash}
					{#if contentHash != null}
						<div>
							<dt>Content hash</dt>
							<dd>
								<TruncatedValue value={contentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mediaUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mediaUrl = entity.mediaUrl}
					{#if mediaUrl != null}
						<div>
							<dt>Media URL</dt>
							<dd>
								<a
									href={mediaUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={mediaUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$assetInstance}
					>
						{#snippet children(assetInstance)}
							<AssetInstanceView
								selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
								prefetched={assetInstance}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
