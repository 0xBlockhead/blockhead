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
	}: EntityListViewProps<EntityType.EulerEvkVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EulerEvkVault}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				totalAssets: true,
				utilization: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eulerEvkVault })}
		<EntityView
			entityType={EntityType.EulerEvkVault}
			entitySelector={eulerEvkVault[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[eulerEvkVault.name, eulerEvkVault.symbol].filter(Boolean).join(' ') || 'Euler EVK vault'}
			{/snippet}

			{#snippet Value()}
				{[(eulerEvkVault.totalAssets ?? ''), String(eulerEvkVault.utilization ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eulerEvkVault.$network.name || (eulerEvkVault.$network.caip2 == null ? '' : `${eulerEvkVault.$network.caip2.namespace}:${eulerEvkVault.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
