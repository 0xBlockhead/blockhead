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
	}: EntityListViewProps<EntityType.BlockheadTransferIntent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadTransferIntent}
	bind:open
	resource={
		selection({
			fields: {
				$sessionAction: true,
				amount: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadTransferIntent })}
		<EntityView
			entityType={EntityType.BlockheadTransferIntent}
			entitySelector={blockheadTransferIntent[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadTransferIntent.$sessionAction.actionType || 'blockhead session action'}
			{/snippet}

			{#snippet Value()}
				{blockheadTransferIntent.amount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadTransferIntent.$network == null ? '' : blockheadTransferIntent.$network.name || (blockheadTransferIntent.$network.caip2 == null ? '' : `${blockheadTransferIntent.$network.caip2.namespace}:${blockheadTransferIntent.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
