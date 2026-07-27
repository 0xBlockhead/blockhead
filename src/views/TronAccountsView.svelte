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
	}: EntityListViewProps<EntityType.TronAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccount}
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
	{#snippet Item({ item: tronAccount })}
		{@const tronAccountSelector = tronAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TronAccount}
			entitySelector={tronAccountSelector}
		>
			{#snippet Title()}
				{tronAccountSelector.address || 'tron account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronAccount.$network.name || (tronAccountSelector.$network.caip2 == null ? '' : `${tronAccountSelector.$network.caip2.namespace}:${tronAccountSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
