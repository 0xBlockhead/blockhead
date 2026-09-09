<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Reddit observations',
		open = $bindable(true),
		id = 'GlobalRedditNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalRedditNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalRedditNetwork_Timestamp}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				source: true,
				reachable: true,
				observedLinkCount: true,
			},
		})
	}
>
	{#snippet Item({ item: globalRedditNetworkTimestamp })}
		{@const globalRedditNetworkTimestampSelector = globalRedditNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalRedditNetwork_Timestamp}
			entitySelector={globalRedditNetworkTimestampSelector}
		>
			{#snippet Title()}
				{globalRedditNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[globalRedditNetworkTimestampSelector.source, String(globalRedditNetworkTimestamp.reachable ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalRedditNetworkTimestamp.observedLinkCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
