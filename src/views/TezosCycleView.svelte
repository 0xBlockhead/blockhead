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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosCycle>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosCycle}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					{selection.entitySelector.cycle}
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
								{firstLevel}
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
								{lastLevel}
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
								{snapshotLevel}
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
