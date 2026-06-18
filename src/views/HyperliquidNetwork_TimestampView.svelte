<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.HyperliquidNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = $derived(select(EntityType.HyperliquidNetwork_Timestamp,
		selector,
		({ sources: [
				Source.Hyperliquid_Rest,
			], fields: { perpMarketCount: true, spotAssetCount: true, spotPairCount: true, validatorCount: true, activeValidatorCount: true, jailedValidatorCount: true, totalStake: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	entitySelector={selector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Hyperliquid network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.perpMarketCount !== undefined}
					<NumberValue value={snapshot.fields.perpMarketCount} />
					perps
				{:else if snapshot.fields.validatorCount !== undefined}
					<NumberValue value={snapshot.fields.validatorCount} />
					validators
				{:else}
					<Timestamp timestamp={selector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Hyperliquid network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.perpMarketCount !== undefined}
						<div>
							<dt>Perp markets</dt>
							<dd><NumberValue value={snapshot.fields.perpMarketCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.spotPairCount !== undefined}
						<div>
							<dt>Spot pairs</dt>
							<dd><NumberValue value={snapshot.fields.spotPairCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.validatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.fields.validatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.activeValidatorCount !== undefined}
						<div>
							<dt>Active validators</dt>
							<dd><NumberValue value={snapshot.fields.activeValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.jailedValidatorCount !== undefined}
						<div>
							<dt>Jailed validators</dt>
							<dd><NumberValue value={snapshot.fields.jailedValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.spotAssetCount !== undefined}
						<div>
							<dt>Spot assets</dt>
							<dd><NumberValue value={snapshot.fields.spotAssetCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.totalStake !== undefined}
						<div>
							<dt>Total stake</dt>
							<dd><NumberValue value={snapshot.fields.totalStake} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
