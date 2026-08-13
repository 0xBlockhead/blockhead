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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadSourceEndpoint_Timestamp>, 'prefetched'> = $props()

	const blockheadSourceEndpointTimestamp = $derived(selection({
		fields: {
			available: true,
			reachable: true,
			latencyMs: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadSourceEndpointView from '$/views/BlockheadSourceEndpointView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSourceEndpoint_Timestamp}
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
		<ResourceBoundary resource={blockheadSourceEndpointTimestamp}>
			{#snippet children(entity)}
				{[String(entity.available), String(entity.reachable)].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSourceEndpointTimestamp}>
			{#snippet children(entity)}
				{@const latencyMs = entity.latencyMs}
				{#if latencyMs != null}
					<span data-text="muted">
						{latencyMs}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Endpoint</dt>
				<dd>
					<BlockheadSourceEndpointView
						selection={select(EntityType.BlockheadSourceEndpoint, selection.entitySelector.$endpoint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Retrieved at</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Available</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpointTimestamp}
					>
						{#snippet children(entity)}
							{entity.available ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Reachable</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpointTimestamp}
					>
						{#snippet children(entity)}
							{entity.reachable ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadSourceEndpointTimestamp}
			>
				{#snippet children(entity)}
					{@const latencyMs = entity.latencyMs}
					{#if latencyMs != null}
						<div>
							<dt>Latency ms</dt>
							<dd>
								{latencyMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							statusCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusCode = entity.statusCode}
					{#if statusCode != null}
						<div>
							<dt>Status code</dt>
							<dd>
								{statusCode}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
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
							<dt>Rate limit remaining</dt>
							<dd>
								{rateLimitRemaining}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitResetMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rateLimitResetMs = entity.rateLimitResetMs}
					{#if rateLimitResetMs != null}
						<div>
							<dt>Rate limit reset</dt>
							<dd>
								<Timestamp timestamp={rateLimitResetMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
