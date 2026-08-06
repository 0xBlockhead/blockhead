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
	}: EntityListViewProps<EntityType.BalancerVeBalBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerVeBalBalance}
	bind:open
	resource={
		selection({
			fields: {
				balance: true,
				locked: true,
				lockedUsd: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerVeBalBalance })}
		{@const balancerVeBalBalanceSelector = balancerVeBalBalance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BalancerVeBalBalance}
			entitySelector={balancerVeBalBalanceSelector}
		>
			{#snippet Title()}
				{balancerVeBalBalance.balance || 'Balancer veBAL balance'}
			{/snippet}

			{#snippet Value()}
				{[balancerVeBalBalance.locked, balancerVeBalBalance.lockedUsd].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerVeBalBalanceSelector.$account.$actor.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
