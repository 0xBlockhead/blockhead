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
	}: EntityListViewProps<EntityType.AptosStateChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosStateChange}
	bind:open
	resource={
		selection({
			fields: {
				changeKind: true,
				changeIndex: true,
				$transaction: {
					fields: {
						hash: true,
						transactionKind: true,
						version: true,
						sender: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: aptosStateChange })}
		{@const aptosStateChangeSelector = aptosStateChange[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosStateChange}
			entitySelector={aptosStateChangeSelector}
		>
			{#snippet Title()}
				{aptosStateChange.changeKind || 'aptos state change'}
			{/snippet}

			{#snippet Value()}
				{aptosStateChangeSelector.changeIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosStateChange.$transaction.hash || String(aptosStateChange.$transaction.version) || 'aptos transaction'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
