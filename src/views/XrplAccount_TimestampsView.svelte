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
	}: EntityListViewProps<EntityType.XrplAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				balanceDrops: true,
				source: true,
				ledgerIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: xrplAccountTimestamp })}
		{@const xrplAccountTimestampSelector = xrplAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XrplAccount_Timestamp}
			entitySelector={xrplAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(xrplAccountTimestamp.balanceDrops ?? '') || 'XRPL account timestamp'}
			{/snippet}

			{#snippet Value()}
				{xrplAccountTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xrplAccountTimestampSelector.ledgerIndex}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
