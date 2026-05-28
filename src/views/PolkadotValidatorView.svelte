<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.PolkadotValidator>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const polkadotValidator = useEntity(
		EntityType.PolkadotValidator,
		entityId,
		{
			commissionPerBillion: {},
			totalStakePlancks: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotValidator}
	{entityId}
	title={entityId.stashAccountId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.stashAccountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			value={entityId.stashAccountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotValidator}
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
