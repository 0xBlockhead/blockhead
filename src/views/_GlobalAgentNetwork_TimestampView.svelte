<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType._GlobalAgentNetwork_Timestamp> = $props()

	const globalAgentNetworkTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalAgentNetworkView from '$/views/_GlobalAgentNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAgentNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalAgentNetworkTimestamp}>
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
				<dt>network</dt>
				<dd>
					<GlobalAgentNetworkView
						selection={select(EntityType._GlobalAgentNetwork, selection.entitySelector.$network)}
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
				resource={globalAgentNetworkTimestamp}
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
							sourceReportedAgentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedAgentCount = entity.sourceReportedAgentCount}
					{#if sourceReportedAgentCount != null}
						<div>
							<dt>sourceReportedAgentCount</dt>
							<dd>
								<NumberValue
									value={sourceReportedAgentCount}
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
							seededAgentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededAgentCount = entity.seededAgentCount}
					{#if seededAgentCount != null}
						<div>
							<dt>seededAgentCount</dt>
							<dd>
								<NumberValue
									value={seededAgentCount}
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
							sourceReportedServerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceReportedServerCount = entity.sourceReportedServerCount}
					{#if sourceReportedServerCount != null}
						<div>
							<dt>sourceReportedServerCount</dt>
							<dd>
								<NumberValue
									value={sourceReportedServerCount}
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
							seededServerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededServerCount = entity.seededServerCount}
					{#if seededServerCount != null}
						<div>
							<dt>seededServerCount</dt>
							<dd>
								<NumberValue
									value={seededServerCount}
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
