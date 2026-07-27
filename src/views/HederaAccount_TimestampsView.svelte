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
	}: EntityListViewProps<EntityType.HederaAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				balanceTinybar: true,
				source: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaAccountTimestamp })}
		{@const hederaAccountTimestampSelector = hederaAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaAccount_Timestamp}
			entitySelector={hederaAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(hederaAccountTimestamp.balanceTinybar ?? '') || 'hedera account timestamp'}
			{/snippet}

			{#snippet Value()}
				{hederaAccountTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(hederaAccountTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
