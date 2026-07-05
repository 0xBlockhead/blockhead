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
			selection: EntityProxyResource<typeof schema, EntityType.TokenMetadataDocument>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TokenMetadataDocument>>
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
	const tokenMetadataDocument = $derived(selection({
		fields: {
			$media: true,
			name: true,
			symbol: true,
			metadataStandard: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? ''), String((prefetched.symbol) ?? ''), String((selection.entitySelector.metadataKey ?? prefetched.metadataKey) ?? '')].filter(Boolean).join(' ') || 'token metadata document')
	const viewDomId = $derived('token-metadata-document-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.TokenMetadataDocument}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$media}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? ''), String((prefetched.symbol) ?? ''), String((selection.entitySelector.metadataKey ?? prefetched.metadataKey) ?? '')].filter(Boolean).join(' ') || title || 'token metadata document'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.metadataKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet Pending()}
				{[String((prefetched.metadataStandard) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? ''), String((prefetched.symbol) ?? ''), String((selection.entitySelector.metadataKey ?? prefetched.metadataKey) ?? '')].filter(Boolean).join(' ') || title || 'token metadata document'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.metadataStandard) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.metadataKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={tokenMetadataDocument}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Metadata subject key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									metadataSubjectKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const metadataSubjectKey = selection.entitySelector.metadataSubjectKey ?? prefetched.metadataSubjectKey}
							{#if metadataSubjectKey !== undefined && metadataSubjectKey !== null}
								{String((metadataSubjectKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const metadataSubjectKey = resolvedEntity.metadataSubjectKey}
							{#if metadataSubjectKey !== undefined && metadataSubjectKey !== null}
								{String((metadataSubjectKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Metadata key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									metadataKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const metadataKey = selection.entitySelector.metadataKey ?? prefetched.metadataKey}
							{#if metadataKey !== undefined && metadataKey !== null}
								{String((metadataKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const metadataKey = resolvedEntity.metadataKey}
							{#if metadataKey !== undefined && metadataKey !== null}
								{String((metadataKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const symbol = prefetched.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbol = resolvedEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadataStandard: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metadataStandard = prefetched.metadataStandard}
					{#if metadataStandard !== undefined && metadataStandard !== null}
						<div>
							<dt>Metadata standard</dt>
							<dd>
								{String((metadataStandard) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataStandard = resolvedEntity.metadataStandard}
					{#if metadataStandard !== undefined && metadataStandard !== null}
						<div>
							<dt>Metadata standard</dt>
							<dd>
								{String((metadataStandard) ?? '')}
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
				{#snippet Pending()}
					{@const mutable = prefetched.mutable}
					{#if mutable !== undefined && mutable !== null}
						<div>
							<dt>Mutable</dt>
							<dd>
								{mutable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mutable = resolvedEntity.mutable}
					{#if mutable !== undefined && mutable !== null}
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
				{#snippet Pending()}
					{@const uri = prefetched.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uri = resolvedEntity.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
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
				{#snippet Pending()}
					{@const contentHash = prefetched.contentHash}
					{#if contentHash !== undefined && contentHash !== null}
						<div>
							<dt>Content hash</dt>
							<dd>
								<TruncatedValue value={String((contentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentHash = resolvedEntity.contentHash}
					{#if contentHash !== undefined && contentHash !== null}
						<div>
							<dt>Content hash</dt>
							<dd>
								<TruncatedValue value={String((contentHash) ?? '')} />
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
				{#snippet Pending()}
					{@const mediaUrl = prefetched.mediaUrl}
					{#if mediaUrl !== undefined && mediaUrl !== null}
						<div>
							<dt>Media URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(mediaUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mediaUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mediaUrl = resolvedEntity.mediaUrl}
					{#if mediaUrl !== undefined && mediaUrl !== null}
						<div>
							<dt>Media URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(mediaUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mediaUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.AssetInstance, false>('$assetInstance')}
					>
						{#snippet children(assetInstance)}
							{#if assetInstance[EntityMetaKey.Selector] != null}
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									href={
										(({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2 !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2.namespace !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2 !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2.reference !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).kind !== undefined && ({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
											caip2: `${String(({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2.namespace ?? '')}:${String(({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).$network.caip2.reference ?? '')}`,
											kind: String(({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).kind ?? ''),
											assetKey: String(({ ...assetInstance[EntityMetaKey.Selector], ...assetInstance }).assetKey ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
