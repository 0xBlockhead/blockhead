<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CctpFastBurnAllowance_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cctpFastBurnAllowanceTimestamp = $derived(selection({
		fields: {
			allowanceUsdc: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'CCTP fast burn allowance timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.CctpFastBurnAllowance_Timestamp}
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
		<ResourceBoundary resource={cctpFastBurnAllowanceTimestamp}>
			{#snippet children(entity)}
				{String(entity.allowanceUsdc ?? '') || String(pendingEntity.timestampMs) || titleFallback}
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
				resource={cctpFastBurnAllowanceTimestamp}
			>
				{#snippet children(entity)}
					{@const allowanceUsdc = entity.allowanceUsdc}
					{#if allowanceUsdc != null}
						<div>
							<dt>Allowance USDC</dt>
							<dd>
								{String(allowanceUsdc)}
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
								<Timestamp timestamp={Number(lastUpdatedMs)} />
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
