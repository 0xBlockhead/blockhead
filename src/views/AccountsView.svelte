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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Account> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Account}
	bind:open
	resource={
		selection({
			...{
				fields: {
					caip10: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: account })}
		{@const accountSelector = account[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Account}
			entitySelector={accountSelector}
			href={
				resolve(
					'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
					{
						namespace: accountSelector.caip10.namespace,
						reference: accountSelector.caip10.reference,
						accountAddress: accountSelector.caip10.accountAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{`${accountSelector.caip10.namespace}:${accountSelector.caip10.reference}:${accountSelector.caip10.accountAddress}` || 'account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
