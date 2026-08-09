<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalAiArtifactCatalog_Timestamp>, 'prefetched'> = $props()

	const globalAiArtifactCatalogTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalAiArtifactCatalogView from '$/views/_GlobalAiArtifactCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/ai/artifact-catalog/[catalogId=stringSegment]/(globalAiArtifactCatalog)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					catalogId: selection.entitySelector.$catalog.catalogId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalAiArtifactCatalogTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>catalog</dt>
				<dd>
					<GlobalAiArtifactCatalogView
						selection={select(EntityType._GlobalAiArtifactCatalog, selection.entitySelector.$catalog)}
						layout={EntityLayout.Value}
					/>
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

			<ResourceBoundary
				resource={globalAiArtifactCatalogTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
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
							sourceReportedArtifactCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedArtifactCount = entity.sourceReportedArtifactCount}
					{#if sourceReportedArtifactCount != null}
						<div>
							<dt>sourceReportedArtifactCount</dt>
							<dd>
								<NumberValue
									value={sourceReportedArtifactCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededArtifactCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededArtifactCount = entity.seededArtifactCount}
					{#if seededArtifactCount != null}
						<div>
							<dt>seededArtifactCount</dt>
							<dd>
								<NumberValue
									value={seededArtifactCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedDocumentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedDocumentCount = entity.sourceReportedDocumentCount}
					{#if sourceReportedDocumentCount != null}
						<div>
							<dt>sourceReportedDocumentCount</dt>
							<dd>
								<NumberValue
									value={sourceReportedDocumentCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededDocumentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededDocumentCount = entity.seededDocumentCount}
					{#if seededDocumentCount != null}
						<div>
							<dt>seededDocumentCount</dt>
							<dd>
								<NumberValue
									value={seededDocumentCount}
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
					selection({
						fields: {
							declaredEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const declaredEndpointCount = entity.declaredEndpointCount}
					{#if declaredEndpointCount != null}
						<div>
							<dt>declaredEndpointCount</dt>
							<dd>
								<NumberValue
									value={declaredEndpointCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachableEndpointCount = entity.reachableEndpointCount}
					{#if reachableEndpointCount != null}
						<div>
							<dt>reachableEndpointCount</dt>
							<dd>
								<NumberValue
									value={reachableEndpointCount}
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
					selection({
						fields: {
							queryHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queryHashAlgorithm = entity.queryHashAlgorithm}
					{#if queryHashAlgorithm != null}
						<div>
							<dt>query hash algorithm</dt>
							<dd>
								{queryHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queryHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queryHash = entity.queryHash}
					{#if queryHash != null}
						<div>
							<dt>query hash</dt>
							<dd>
								<TruncatedValue value={queryHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastCursor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastCursor = entity.lastCursor}
					{#if lastCursor != null}
						<div>
							<dt>last cursor</dt>
							<dd>
								{lastCursor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
