<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: EntitySelectionViewProps<EntityType.AgentIdentityClaim> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))
	const titleFallback = $derived((pendingEntity.identityKind ?? '') || 'agent identity claim')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.AgentIdentityClaim}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.identityKind ?? '') || 'agent identity claim'}
	{/snippet}

	{#snippet Value()}
		{[(pendingEntity.subjectKind ?? ''), (pendingEntity.objectKind ?? '')].filter(Boolean).join(' ') || (pendingEntity.identityKind ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					{pendingEntity.subjectKind}
				</dd>
			</div>

			<div>
				<dt>identity kind</dt>
				<dd>
					{pendingEntity.identityKind}
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					{pendingEntity.objectKind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							confidence: true,
						},
					})
				}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verificationMethod: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationMethod = entity.verificationMethod}
					{#if verificationMethod != null}
						<div>
							<dt>verification method</dt>
							<dd>
								{verificationMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$document}
			>
				{#snippet children(aiDocument)}
					{#if aiDocument != null}
						<div>
							<dt>document</dt>
							<dd>
								<AiDocumentView
									selection={select(EntityType.AiDocument, aiDocument[EntityMetaKey.Selector])}
									prefetched={aiDocument}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceUri = entity.evidenceUri}
					{#if evidenceUri != null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<a
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							evidenceHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceHashAlgorithm = entity.evidenceHashAlgorithm}
					{#if evidenceHashAlgorithm != null}
						<div>
							<dt>evidence hash algorithm</dt>
							<dd>
								<TruncatedValue value={evidenceHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							evidenceHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceHash = entity.evidenceHash}
					{#if evidenceHash != null}
						<div>
							<dt>evidence hash</dt>
							<dd>
								<TruncatedValue value={evidenceHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
