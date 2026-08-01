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
	}: EntityListViewProps<EntityType.AvalancheBlockchain> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheBlockchain}
	bind:open
	resource={
		selection({
			fields: {
				chainName: true,
				chainAlias: true,
				vmId: true,
				blockchainId: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheBlockchain })}
		{@const avalancheBlockchainSelector = avalancheBlockchain[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheBlockchain}
			entitySelector={avalancheBlockchainSelector}
		>
			{#snippet Title()}
				{[(avalancheBlockchain.chainName ?? ''), (avalancheBlockchain.chainAlias ?? '')].filter(Boolean).join(' ') || avalancheBlockchainSelector.blockchainId || 'avalanche blockchain'}
			{/snippet}

			{#snippet Value()}
				{avalancheBlockchain.vmId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
