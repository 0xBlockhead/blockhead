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
	}: EntitySelectionViewProps<EntityType.TezosCycle> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'tezos cycle'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosCycle}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos cycle
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					{String(pendingEntity.cycle)}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							firstLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const firstLevel = entity.firstLevel}
					{#if firstLevel != null}
						<div>
							<dt>first level</dt>
							<dd>
								{String(firstLevel)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastLevel = entity.lastLevel}
					{#if lastLevel != null}
						<div>
							<dt>last level</dt>
							<dd>
								{String(lastLevel)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							snapshotLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const snapshotLevel = entity.snapshotLevel}
					{#if snapshotLevel != null}
						<div>
							<dt>snapshot level</dt>
							<dd>
								{String(snapshotLevel)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							randomSeed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const randomSeed = entity.randomSeed}
					{#if randomSeed != null}
						<div>
							<dt>random seed</dt>
							<dd>
								{randomSeed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
