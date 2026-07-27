<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType._GlobalAiModelCatalog_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const globalAiModelCatalogTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'global AI model catalog timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalAiModelCatalogView from '$/views/_GlobalAiModelCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiModelCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalAiModelCatalogTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog</dt>
				<dd>
					<GlobalAiModelCatalogView
						selection={select(EntityType._GlobalAiModelCatalog, selection.entitySelector.$catalog)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={globalAiModelCatalogTimestamp}
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
							sourceReportedModelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedModelCount = entity.sourceReportedModelCount}
					{#if sourceReportedModelCount != null}
						<div>
							<dt>sourceReportedModelCount</dt>
							<dd>
								<NumberValue
									value={sourceReportedModelCount}
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
							seededModelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededModelCount = entity.seededModelCount}
					{#if seededModelCount != null}
						<div>
							<dt>seededModelCount</dt>
							<dd>
								<NumberValue
									value={seededModelCount}
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
							searchResultCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const searchResultCount = entity.searchResultCount}
					{#if searchResultCount != null}
						<div>
							<dt>searchResultCount</dt>
							<dd>
								<NumberValue
									value={searchResultCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rateLimitRemaining = entity.rateLimitRemaining}
					{#if rateLimitRemaining != null}
						<div>
							<dt>rateLimitRemaining</dt>
							<dd>
								<NumberValue
									value={rateLimitRemaining}
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
								<TruncatedValue value={queryHashAlgorithm} />
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
								<TruncatedValue value={String(queryHash)} />
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
