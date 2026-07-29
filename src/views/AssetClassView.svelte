<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.AssetClass> = $props()

	const assetClass = $derived(selection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([(prefetched.label ?? ''), selection.entitySelector.classKey].filter(Boolean).join(' ') || 'asset class')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetClass}>
			{#snippet children(entity)}
				{[(entity.label ?? ''), selection.entitySelector.classKey].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{[selection.entitySelector.classKind, selection.entitySelector.classKey].filter(Boolean).join(' ') || [(prefetched.label ?? ''), selection.entitySelector.classKey].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<AssetInstanceView
				selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A reusable asset classification used to group related asset instances and objects.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Class kind</dt>
				<dd>
					{selection.entitySelector.classKind}
				</dd>
			</div>

			<div>
				<dt>Class key</dt>
				<dd>
					{selection.entitySelector.classKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>Slot</dt>
							<dd>
								{slot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							partition: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const partition = entity.partition}
					{#if partition != null}
						<div>
							<dt>Partition</dt>
							<dd>
								{partition}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							series: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const series = entity.series}
					{#if series != null}
						<div>
							<dt>Series</dt>
							<dd>
								{series}
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
							maturityMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maturityMs = entity.maturityMs}
					{#if maturityMs != null}
						<div>
							<dt>Maturity</dt>
							<dd>
								{maturityMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueDecimals = entity.valueDecimals}
					{#if valueDecimals != null}
						<div>
							<dt>Value decimals</dt>
							<dd>
								{valueDecimals}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
