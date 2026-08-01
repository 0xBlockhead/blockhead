<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpFastBurnAllowance_Timestamp>, 'prefetched'> = $props()

	const cctpFastBurnAllowanceTimestamp = $derived(selection({
		fields: {
			allowanceUsdc: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.CctpFastBurnAllowance_Timestamp}
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
		<ResourceBoundary resource={cctpFastBurnAllowanceTimestamp}>
			{#snippet children(entity)}
				{String(entity.allowanceUsdc ?? '') || String(selection.entitySelector.timestampMs)}
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
				resource={cctpFastBurnAllowanceTimestamp}
			>
				{#snippet children(entity)}
					{@const allowanceUsdc = entity.allowanceUsdc}
					{#if allowanceUsdc != null}
						<div>
							<dt>Allowance USDC</dt>
							<dd>
								{allowanceUsdc}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastUpdatedMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastUpdatedMs = entity.lastUpdatedMs}
					{#if lastUpdatedMs != null}
						<div>
							<dt>Last updated ms</dt>
							<dd>
								<Timestamp timestamp={lastUpdatedMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestId = entity.requestId}
					{#if requestId != null}
						<div>
							<dt>Request ID</dt>
							<dd>
								{requestId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
