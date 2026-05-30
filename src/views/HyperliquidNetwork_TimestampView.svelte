<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.HyperliquidNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.HyperliquidNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Hyperliquid_Rest,
			],
			perpMarketCount: {},
			spotAssetCount: {},
			spotPairCount: {},
			validatorCount: {},
			activeValidatorCount: {},
			jailedValidatorCount: {},
			totalStake: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Hyperliquid network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.perpMarketCount !== undefined}
					<NumberValue value={snapshot.perpMarketCount} />
					perps
				{:else if snapshot.validatorCount !== undefined}
					<NumberValue value={snapshot.validatorCount} />
					validators
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Hyperliquid network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.perpMarketCount !== undefined}
						<div>
							<dt>Perp markets</dt>
							<dd><NumberValue value={snapshot.perpMarketCount} /></dd>
						</div>
					{/if}

					{#if snapshot.spotPairCount !== undefined}
						<div>
							<dt>Spot pairs</dt>
							<dd><NumberValue value={snapshot.spotPairCount} /></dd>
						</div>
					{/if}

					{#if snapshot.validatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.validatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.activeValidatorCount !== undefined}
						<div>
							<dt>Active validators</dt>
							<dd><NumberValue value={snapshot.activeValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.jailedValidatorCount !== undefined}
						<div>
							<dt>Jailed validators</dt>
							<dd><NumberValue value={snapshot.jailedValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.spotAssetCount !== undefined}
						<div>
							<dt>Spot assets</dt>
							<dd><NumberValue value={snapshot.spotAssetCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.totalStake !== undefined}
						<div>
							<dt>Total stake</dt>
							<dd><NumberValue value={snapshot.totalStake} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
