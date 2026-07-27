<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.AiDocumentClaim> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((pendingEntity.claimPath ?? '') || 'AI document claim')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDocumentClaim}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.claimPath ?? '') || 'AI document claim'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiDocumentClaim}>
			{#snippet children(entity)}
				{entity.claimKind || pendingEntity.claimPath || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiDocumentClaim}>
			{#snippet children(entity)}
				{@const confidence0 = entity.confidence}
				{#if confidence0 != null}
					<span data-text="muted">
						<NumberValue
							value={confidence0}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>document</dt>
				<dd>
					<AiDocumentView
						selection={select(EntityType.AiDocument, selection.entitySelector.$document)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>extractor ID</dt>
				<dd>
					{pendingEntity.extractorId}
				</dd>
			</div>

			<div>
				<dt>claim path</dt>
				<dd>
					{pendingEntity.claimPath}
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
