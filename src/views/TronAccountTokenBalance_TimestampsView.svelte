<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.TronAccountTokenBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccountTokenBalance_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				tokenSymbol: true,
				balance: true,
				tokenName: true,
				tokenId: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: tronAccountTokenBalanceTimestamp })}
		{@const tronAccountTokenBalanceTimestampSelector = tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TronAccountTokenBalance_Timestamp}
			entitySelector={tronAccountTokenBalanceTimestampSelector}
		>
			{#snippet Title()}
				{(tronAccountTokenBalanceTimestamp.tokenSymbol ?? '') || [(tronAccountTokenBalanceTimestamp.tokenName ?? ''), (tronAccountTokenBalanceTimestamp.tokenId ?? '')].filter(Boolean).join(' ') || 'tron account token balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(tronAccountTokenBalanceTimestamp.balance ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronAccountTokenBalanceTimestampSelector.$account.address || 'tron account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
