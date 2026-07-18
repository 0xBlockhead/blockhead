<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AiDocument>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiDocument>>
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
	const aiDocument = $derived(selection({
		sources: selection.sources,
		fields: {
			mediaType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.documentKind) ?? '')].filter(Boolean).join(' ') || 'AI document')
	const viewDomId = $derived('ai-document-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentClaimsView from '$/views/AiDocumentClaimsView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDocument}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.documentKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDocument}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.documentKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.documentKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDocument}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.documentKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const documentUrl0 = pendingEntity.documentUrl}
			{#if documentUrl0 !== undefined && documentUrl0 !== null}
				<span data-text="muted">
					<svelte:element
						this={'a'}
						href={String(documentUrl0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(documentUrl0)} />
					</svelte:element>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiDocument}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentUrl0 = resolvedEntity.documentUrl}
					{#if documentUrl0 !== undefined && documentUrl0 !== null}
						<span data-text="muted">
							<svelte:element
								this={'a'}
								href={String(documentUrl0)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(documentUrl0)} />
							</svelte:element>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>document kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									documentKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const documentKind = resolvedEntity.documentKind}
							{#if documentKind !== undefined && documentKind !== null}
								{String((documentKind) ?? '')}
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
							contentHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentHashAlgorithm = resolvedEntity.contentHashAlgorithm}
					{#if contentHashAlgorithm !== undefined && contentHashAlgorithm !== null}
						<div>
							<dt>content hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((contentHashAlgorithm) ?? '')} />
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
							contentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentHash = resolvedEntity.contentHash}
					{#if contentHash !== undefined && contentHash !== null}
						<div>
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={String((contentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null && aiArtifact[EntityMetaKey.Selector] != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							documentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentUrl = resolvedEntity.documentUrl}
					{#if documentUrl !== undefined && documentUrl !== null}
						<div>
							<dt>document URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(documentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(documentUrl)} />
								</svelte:element>
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
						sources: selection.sources,
						fields: {
							mediaType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mediaType = resolvedEntity.mediaType}
					{#if mediaType !== undefined && mediaType !== null}
						<div>
							<dt>media type</dt>
							<dd>
								{String((mediaType) ?? '')}
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
							sourceFormat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceFormat = resolvedEntity.sourceFormat}
					{#if sourceFormat !== undefined && sourceFormat !== null}
						<div>
							<dt>source format</dt>
							<dd>
								{String((sourceFormat) ?? '')}
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
							schemaVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const schemaVersion = resolvedEntity.schemaVersion}
					{#if schemaVersion !== undefined && schemaVersion !== null}
						<div>
							<dt>schema version</dt>
							<dd>
								{String((schemaVersion) ?? '')}
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
							conformsTo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const conformsTo = resolvedEntity.conformsTo}
					{#if conformsTo !== undefined && conformsTo !== null}
						<div>
							<dt>conforms to</dt>
							<dd>
								{String((conformsTo) ?? '')}
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
							declaredSubjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredSubjectKind = resolvedEntity.declaredSubjectKind}
					{#if declaredSubjectKind !== undefined && declaredSubjectKind !== null}
						<div>
							<dt>declared subject kind</dt>
							<dd>
								{String((declaredSubjectKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiDocumentClaimsView
				selection={
						selection.$$claims({
							count: true,
						})
					}
				title='claims'
				emptyText='No AI document claims.'
				id='AiDocumentClaimsView-claims'
			/>
		{/if}
	{/snippet}
</EntityView>
