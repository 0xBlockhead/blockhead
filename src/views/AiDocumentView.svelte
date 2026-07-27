<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.AiDocument> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
	}))
	const aiDocument = $derived(viewSelection({
		fields: {
			documentKind: true,
			mediaType: true,
			documentUrl: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.documentKind ?? '') || 'AI document')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentClaimsView from '$/views/AiDocumentClaimsView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDocument}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiDocument}>
			{#snippet children(entity)}
				{entity.documentKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiDocument}>
			{#snippet children(entity)}
				{(entity.mediaType ?? '') || entity.documentKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiDocument}>
			{#snippet children(entity)}
				{@const documentUrl0 = entity.documentUrl}
				{#if documentUrl0 != null}
					<span data-text="muted">
						<a
							href={String(documentUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(documentUrl0)} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>document kind</dt>
				<dd>
					<ResourceBoundary
						resource={aiDocument}
					>
						{#snippet children(entity)}
							{entity.documentKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contentHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentHashAlgorithm = entity.contentHashAlgorithm}
					{#if contentHashAlgorithm != null}
						<div>
							<dt>content hash algorithm</dt>
							<dd>
								<TruncatedValue value={contentHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={String(contentHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
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
				resource={aiDocument}
			>
				{#snippet children(entity)}
					{@const documentUrl = entity.documentUrl}
					{#if documentUrl != null}
						<div>
							<dt>document URL</dt>
							<dd>
								<a
									href={String(documentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(documentUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aiDocument}
			>
				{#snippet children(entity)}
					{@const mediaType = entity.mediaType}
					{#if mediaType != null}
						<div>
							<dt>media type</dt>
							<dd>
								{mediaType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceFormat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceFormat = entity.sourceFormat}
					{#if sourceFormat != null}
						<div>
							<dt>source format</dt>
							<dd>
								{sourceFormat}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							schemaVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const schemaVersion = entity.schemaVersion}
					{#if schemaVersion != null}
						<div>
							<dt>schema version</dt>
							<dd>
								{schemaVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							conformsTo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const conformsTo = entity.conformsTo}
					{#if conformsTo != null}
						<div>
							<dt>conforms to</dt>
							<dd>
								{String(conformsTo)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							declaredSubjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const declaredSubjectKind = entity.declaredSubjectKind}
					{#if declaredSubjectKind != null}
						<div>
							<dt>declared subject kind</dt>
							<dd>
								{declaredSubjectKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aiDocumentAiDocumentClaimsViewClaimsResource = selection.$$claims}
		<ResourceBoundary
			resource={aiDocumentAiDocumentClaimsViewClaimsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentClaimsView
						selection={aiDocumentAiDocumentClaimsViewClaimsResource}
						countResource={aiDocumentAiDocumentClaimsViewClaimsResource.count}
						title='claims'
						id='claims'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
