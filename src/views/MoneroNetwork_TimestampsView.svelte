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
	}: EntityListViewProps<EntityType.MoneroNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				status: true,
				synchronized: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroNetworkTimestamp })}
		{@const moneroNetworkTimestampSelector = moneroNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroNetwork_Timestamp}
			entitySelector={moneroNetworkTimestampSelector}
		>
			{#snippet Title()}
				{moneroNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{moneroNetworkTimestamp.height ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(moneroNetworkTimestamp.status ?? ''), String(moneroNetworkTimestamp.synchronized ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
