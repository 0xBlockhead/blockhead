<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		title = 'ActivityPub hub observations',
		open = $bindable(true),
		id = 'GlobalActivityPubNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalActivityPubNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				instanceTitle: true,
				timestampMs: true,
				instanceOrigin: true,
				source: true,
				reachable: true,
			},
		})
	}
>
	{#snippet Item({ item: globalActivityPubNetworkTimestamp })}
		{@const globalActivityPubNetworkTimestampSelector = globalActivityPubNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
			entitySelector={globalActivityPubNetworkTimestampSelector}
		>
			{#snippet Title()}
				{[(globalActivityPubNetworkTimestamp.instanceTitle ?? ''), String(globalActivityPubNetworkTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'global ActivityPub network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(globalActivityPubNetworkTimestamp.instanceOrigin ?? ''), globalActivityPubNetworkTimestampSelector.source].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(globalActivityPubNetworkTimestamp.reachable ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
