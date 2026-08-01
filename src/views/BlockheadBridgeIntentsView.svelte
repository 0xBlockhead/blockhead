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
	}: EntityListViewProps<EntityType.BlockheadBridgeIntent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBridgeIntent}
	bind:open
	resource={
		selection({
			fields: {
				$sessionAction: true,
				amount: true,
				$fromNetwork: true,
				$toNetwork: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadBridgeIntent })}
		<EntityView
			entityType={EntityType.BlockheadBridgeIntent}
			entitySelector={blockheadBridgeIntent[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadBridgeIntent.$sessionAction.actionType || 'blockhead session action'}
			{/snippet}

			{#snippet Value()}
				{blockheadBridgeIntent.amount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[blockheadBridgeIntent.$fromNetwork == null ? '' : blockheadBridgeIntent.$fromNetwork.name || (blockheadBridgeIntent.$fromNetwork.caip2 == null ? '' : `${blockheadBridgeIntent.$fromNetwork.caip2.namespace}:${blockheadBridgeIntent.$fromNetwork.caip2.reference}`) || 'Network', blockheadBridgeIntent.$toNetwork == null ? '' : blockheadBridgeIntent.$toNetwork.name || (blockheadBridgeIntent.$toNetwork.caip2 == null ? '' : `${blockheadBridgeIntent.$toNetwork.caip2.namespace}:${blockheadBridgeIntent.$toNetwork.caip2.reference}`) || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
