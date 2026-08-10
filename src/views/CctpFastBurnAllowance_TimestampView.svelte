<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpFastBurnAllowance_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctpIris,
		],
	}))
	const cctpFastBurnAllowanceTimestamp = $derived(viewSelection({
		fields: {
			allowanceUsdc: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CctpAllowanceView from '$/views/CctpAllowanceView.svelte'
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
				{String(entity.allowanceUsdc)}
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
				<dt>Allowance</dt>
				<dd>
					<CctpAllowanceView
						selection={select(EntityType.CctpAllowance, selection.entitySelector.$allowance)}
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

			<div>
				<dt>Allowance USDC</dt>
				<dd>
					<ResourceBoundary
						resource={cctpFastBurnAllowanceTimestamp}
					>
						{#snippet children(entity)}
							{entity.allowanceUsdc}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
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
