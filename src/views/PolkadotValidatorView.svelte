<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotValidator}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.stashAccountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.stashAccountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { commissionPerBillion: true, totalStakePlancks: true } })}
			placeholderText={`Loading Polkadot Validator...`}
		>
			{#snippet children(polkadotValidator)}
				<dl>
					{#if polkadotValidator.commissionPerBillion != null}
						<div>
							<dt>Commission Per Billion</dt>
							<dd><NumberValue value={polkadotValidator.commissionPerBillion} /></dd>
						</div>
					{/if}

					{#if polkadotValidator.totalStakePlancks != null}
						<div>
							<dt>Total Stake Plancks</dt>
							<dd><NumberValue value={polkadotValidator.totalStakePlancks} /> plancks</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
