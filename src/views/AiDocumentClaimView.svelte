<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.AiDocumentClaim>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))
	const aiDocumentClaim = $derived(viewSelection({
		fields: {
			claimKind: true,
			confidence: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.claimPath || 'AI document claim')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDocumentClaim}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'documentUrl' in selection.entitySelector.$document ?
					resolve(
						'/(ai)/ai/document/url/[documentUrl=absoluteUrl]/(aiDocument)/claim/[extractorId=stringSegment]/[claimPath=stringSegment]',
						{
							documentUrl: encodeURIComponent(selection.entitySelector.$document.documentUrl),
							extractorId: selection.entitySelector.extractorId,
							claimPath: selection.entitySelector.claimPath,
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
	{#snippet Value()}
		<ResourceBoundary resource={aiDocumentClaim}>
			{#snippet children(entity)}
				{entity.claimKind || selection.entitySelector.claimPath || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiDocumentClaim}>
			{#snippet children(entity)}
				{@const confidence = entity.confidence}
				{#if confidence != null}
					<span data-text="muted">
						<NumberValue
							value={confidence}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>document</dt>
				<dd>
					<AiDocumentView
						selection={select(EntityType.AiDocument, selection.entitySelector.$document)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>extractor ID</dt>
				<dd>
					{selection.entitySelector.extractorId}
				</dd>
			</div>

			<div>
				<dt>claim path</dt>
				<dd>
					{selection.entitySelector.claimPath}
				</dd>
			</div>

			<div>
				<dt>claim kind</dt>
				<dd>
					<ResourceBoundary
						resource={aiDocumentClaim}
					>
						{#snippet children(entity)}
							{entity.claimKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							subjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subjectKind = entity.subjectKind}
					{#if subjectKind != null}
						<div>
							<dt>subject kind</dt>
							<dd>
								{subjectKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							metadataKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataKey = entity.metadataKey}
					{#if metadataKey != null}
						<div>
							<dt>metadata key</dt>
							<dd>
								{metadataKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							formatObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const formatObjectId = entity.formatObjectId}
					{#if formatObjectId != null}
						<div>
							<dt>format object ID</dt>
							<dd>
								{formatObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							formatObjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const formatObjectKind = entity.formatObjectKind}
					{#if formatObjectKind != null}
						<div>
							<dt>format object kind</dt>
							<dd>
								{formatObjectKind}
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
							checksumAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const checksumAlgorithm = entity.checksumAlgorithm}
					{#if checksumAlgorithm != null}
						<div>
							<dt>checksum algorithm</dt>
							<dd>
								{checksumAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							checksumValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const checksumValue = entity.checksumValue}
					{#if checksumValue != null}
						<div>
							<dt>checksum value</dt>
							<dd>
								{checksumValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							relationshipKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relationshipKind = entity.relationshipKind}
					{#if relationshipKind != null}
						<div>
							<dt>relationship kind</dt>
							<dd>
								{relationshipKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiDocumentClaim}
			>
				{#snippet children(entity)}
					{@const confidence = entity.confidence}
					{#if confidence != null}
						<div>
							<dt>confidence</dt>
							<dd>
								<NumberValue
									value={confidence}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
