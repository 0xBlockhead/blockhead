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
	}: EntitySelectionViewProps<EntityType.AiDocument> = $props()

	const artifact = $derived(selection.entitySelector.$artifact)
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
	const titleFallback = $derived((prefetched.documentKind ?? '') || 'AI document')


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
	href={
		href === undefined ?
			(
				'documentKind' in selection.entitySelector
				&& '$artifact' in selection.entitySelector
				&& 'digestAlgorithm' in artifact
				&& 'digest' in artifact ?
					resolve(
						'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/document/[documentKind=stringSegment]',
						{
							digestAlgorithm: artifact.digestAlgorithm,
							digest: artifact.digest,
							documentKind: selection.entitySelector.documentKind,
						}
					)
				:
					'documentKind' in selection.entitySelector
					&& 'contentHashAlgorithm' in selection.entitySelector
					&& 'contentHash' in selection.entitySelector ?
						resolve(
							'/(ai)/ai/document/[documentKind=stringSegment]/hash/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]',
							{
								documentKind: selection.entitySelector.documentKind,
								contentHashAlgorithm: selection.entitySelector.contentHashAlgorithm,
								contentHash: selection.entitySelector.contentHash,
							}
						)
					:
						'documentUrl' in selection.entitySelector ?
							resolve(
								'/(ai)/ai/document/url/[documentUrl=absoluteUrl]',
								{
									documentUrl: encodeURIComponent(selection.entitySelector.documentUrl),
								}
							)
						:
							undefined
			)
		:
			href ?? undefined
	}
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
				{@const documentUrl = entity.documentUrl}
				{#if documentUrl != null}
					<span data-text="muted">
						<a
							href={documentUrl}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={documentUrl} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
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
								{contentHashAlgorithm}
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
								<TruncatedValue value={contentHash} />
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
						{@const aiArtifactInitial = untrack(() => aiArtifact)}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, (aiArtifact ?? aiArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={aiArtifact ?? aiArtifactInitial}
									layout={EntityLayout.Value}
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
									href={documentUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={documentUrl} />
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
								{conformsTo}
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

	{#snippet Details()}
		{@const claimsResource = selection.$$claims}
		<ResourceBoundary
			resource={claimsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentClaimsView
						selection={claimsResource}
						countResource={claimsResource.count}
						title='claims'
						id='claims'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
