<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletRequestCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletRequestCall}
	bind:open
	resource={
		selection({
			fields: {
				callIndex: true,
				toAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletRequestCall })}
		{@const blockheadWalletRequestCallSelector = blockheadWalletRequestCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletRequestCall}
			entitySelector={blockheadWalletRequestCallSelector}
		>
			{#snippet Title()}
				{(String(blockheadWalletRequestCallSelector.callIndex ?? '') ? 'Call #' + String(blockheadWalletRequestCallSelector.callIndex ?? '') : '') || 'blockhead wallet request call'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadWalletRequestCall.toAddress ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
