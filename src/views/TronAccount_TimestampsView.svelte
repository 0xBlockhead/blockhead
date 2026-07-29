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
	}: EntityListViewProps<EntityType.TronAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				balanceSun: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: tronAccountTimestamp })}
		{@const tronAccountTimestampSelector = tronAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TronAccount_Timestamp}
			entitySelector={tronAccountTimestampSelector}
		>
			{#snippet Title()}
				{tronAccountTimestampSelector.$account.address || 'tron account'}
			{/snippet}

			{#snippet Value()}
				{tronAccountTimestamp.balanceSun ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(tronAccountTimestampSelector.timestampMs), tronAccountTimestampSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
