<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CurvePoolCoin> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CurvePoolCoin}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				name: true,
				poolBalance: true,
				usdPrice: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: curvePoolCoin })}
		<EntityView
			entityType={EntityType.CurvePoolCoin}
			entitySelector={curvePoolCoin[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[curvePoolCoin.symbol, curvePoolCoin.name].filter(Boolean).join(' ') || 'Curve pool coin'}
			{/snippet}

			{#snippet Value()}
				{[(curvePoolCoin.poolBalance ?? ''), String(curvePoolCoin.usdPrice ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[curvePoolCoin.$pool.name, curvePoolCoin.$pool.symbol].filter(Boolean).join(' ') || 'Curve pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
