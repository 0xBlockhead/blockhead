<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Zcash wallet states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashWalletState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashWalletState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				walletId: true,
				$network: true,
				unifiedAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashWalletState })}
		{@const blockheadZcashWalletStateSelector = blockheadZcashWalletState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZcashWalletState}
			entitySelector={blockheadZcashWalletStateSelector}
		>
			{#snippet Title()}
				{blockheadZcashWalletStateSelector.walletId || 'blockhead zcash wallet state'}
			{/snippet}

			{#snippet Value()}
				{blockheadZcashWalletState.$network.name || (blockheadZcashWalletState.$network.caip2 == null ? '' : `${blockheadZcashWalletState.$network.caip2.namespace}:${blockheadZcashWalletState.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZcashWalletState.unifiedAddress ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
