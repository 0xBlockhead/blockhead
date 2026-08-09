<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Accounts',
		emptyText = 'No accounts enrolled.',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAccount}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$account: true,
				},
			},
		})
	}
	{emptyText}
>
	{#snippet Item({ item: blockheadAccount })}
		{@const blockheadAccountSelector = blockheadAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAccount}
			entitySelector={blockheadAccountSelector}
			href={
				resolve(
					'/~/accounts/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
					{
						namespace: blockheadAccountSelector.$account.caip10.namespace,
						reference: blockheadAccountSelector.$account.caip10.reference,
						accountAddress: blockheadAccountSelector.$account.caip10.accountAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{`${blockheadAccountSelector.$account.caip10.namespace}:${blockheadAccountSelector.$account.caip10.reference}:${blockheadAccountSelector.$account.caip10.accountAddress}` || 'account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
