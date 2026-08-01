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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadSource_Timestamp>, 'prefetched'> = $props()

	const blockheadSourceTimestamp = $derived(selection({
		fields: {
			health: true,
			enabled: true,
			latencyMs: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource_Timestamp}
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
		<ResourceBoundary resource={blockheadSourceTimestamp}>
			{#snippet children(entity)}
				{[(entity.health ?? ''), String(entity.enabled ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSourceTimestamp}>
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
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadSourceTimestamp}
			>
				{#snippet children(entity)}
					{@const enabled = entity.enabled}
					{#if enabled != null}
						<div>
							<dt>Enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadSourceTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>Health</dt>
							<dd>
								{health}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadSourceTimestamp}
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
							<dt>Rate limit reset ms</dt>
							<dd>
								<Timestamp timestamp={rateLimitResetMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolverCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolverCount = entity.resolverCount}
					{#if resolverCount != null}
						<div>
							<dt>Resolver count</dt>
							<dd>
								{resolverCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Source</dt>
				<dd>
					<BlockheadSourceView
						selection={select(EntityType.BlockheadSource, selection.entitySelector.$source)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
