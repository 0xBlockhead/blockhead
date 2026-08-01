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
	}: Omit<EntitySelectionViewProps<EntityType.CctpAllowance>, 'prefetched'> = $props()

	const cctpAllowance = $derived(selection({
		fields: {
			allowance: true,
			fetchedAt: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.apiHost || 'CCTP allowance')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.CctpAllowance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet children(entity)}
				{String(entity.allowance ?? '') || selection.entitySelector.apiHost || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.fetchedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>API host</dt>
				<dd>
					{selection.entitySelector.apiHost}
				</dd>
			</div>

			<ResourceBoundary
				resource={cctpAllowance}
			>
				{#snippet children(entity)}
					{@const allowance = entity.allowance}
					{#if allowance != null}
						<div>
							<dt>Allowance</dt>
							<dd>
								{allowance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fetched at</dt>
				<dd>
					<ResourceBoundary
						resource={cctpAllowance}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.fetchedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
