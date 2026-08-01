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
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGConsensusNetwork_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'zero g consensus network timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ZeroGConsensusNetworkView
			selection={select(EntityType.ZeroGConsensusNetwork, selection.entitySelector.$consensusNetwork)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>consensus network</dt>
				<dd>
					<ZeroGConsensusNetworkView
						selection={select(EntityType.ZeroGConsensusNetwork, selection.entitySelector.$consensusNetwork)}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.ZeroGChainScan_Rest,
						],
					})({
						fields: {
							sharedStakingStatusSource: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sharedStakingStatusSource = entity.sharedStakingStatusSource}
					{#if sharedStakingStatusSource != null}
						<div>
							<dt>shared staking status source</dt>
							<dd>
								<a
									href={sharedStakingStatusSource}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={sharedStakingStatusSource} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
