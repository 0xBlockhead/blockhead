<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ZeroGConsensusNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zeroGConsensusNetwork = subscribe(EntityType.ZeroGConsensusNetwork,
		selector,
		({ fields: { sharedStakingStatusSource: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGConsensusNetwork}
	entitySelector={selector}
	title={selector.consensusNetworkId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.consensusNetworkId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGConsensusNetwork}
			placeholderText={`Loading 0G consensus network...`}
		>
			{#snippet children(zeroGConsensusNetwork)}
				<dl>
					{#if zeroGConsensusNetwork.fields.sharedStakingStatusSource != null}
						<div>
							<dt>Shared staking status source</dt>
							<dd>{zeroGConsensusNetwork.fields.sharedStakingStatusSource}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
