<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Contract source bundles',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmContractSourceBundle> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContractSourceBundle}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: evmContractSourceBundle })}
		{@const evmContractSourceBundleSelector = evmContractSourceBundle[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmContractSourceBundle}
			entitySelector={evmContractSourceBundleSelector}
		>
			{#snippet Title()}
				{[(evmContractSourceBundle.$contract.precompileName ?? ''), evmContractSourceBundleSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{[(evmContractSourceBundle.$contract.precompileName ?? ''), evmContractSourceBundleSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
