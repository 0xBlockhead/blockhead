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
	}: EntitySelectionViewProps<EntityType.CctpAllowance> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cctpAllowance = $derived(selection({
		fields: {
			allowance: true,
			fetchedAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.apiHost ?? '') || 'CCTP allowance')


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
	{#snippet Title()}
		{(pendingEntity.apiHost ?? '') || 'CCTP allowance'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet children(entity)}
				{String(entity.allowance ?? '') || pendingEntity.apiHost || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.fetchedAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>API host</dt>
				<dd>
					{pendingEntity.apiHost}
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
								{String(allowance)}
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
							<Timestamp timestamp={Number(entity.fetchedAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
