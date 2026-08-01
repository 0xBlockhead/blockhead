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
	}: EntityListViewProps<EntityType.AptosAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccount}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosAccount })}
		{@const aptosAccountSelector = aptosAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosAccount}
			entitySelector={aptosAccountSelector}
		>
			{#snippet Title()}
				{aptosAccountSelector.address || 'aptos account'}
			{/snippet}

			{#snippet Value()}
				{aptosAccount.$network.$network.name || (aptosAccountSelector.$network.$network.caip2 == null ? '' : `${aptosAccountSelector.$network.$network.caip2.namespace}:${aptosAccountSelector.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
