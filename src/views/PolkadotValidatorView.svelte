<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.PolkadotValidator>
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
	entitySelector={selector}
	title={selector.stashAccountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.stashAccountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.PolkadotValidator, selector, ({ fields: { commissionPerBillion: true, totalStakePlancks: true } }))}
			placeholderText={`Loading Polkadot Validator...`}
		>
			{#snippet children(polkadotValidator)}
				<dl>
					{#if polkadotValidator.fields.commissionPerBillion != null}
						<div>
							<dt>Commission Per Billion</dt>
							<dd><NumberValue value={polkadotValidator.fields.commissionPerBillion} /></dd>
						</div>
					{/if}

					{#if polkadotValidator.fields.totalStakePlancks != null}
						<div>
							<dt>Total Stake Plancks</dt>
							<dd><NumberValue value={polkadotValidator.fields.totalStakePlancks} /> plancks</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
