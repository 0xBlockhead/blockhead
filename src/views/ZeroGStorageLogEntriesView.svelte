<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'ZeroGStorageLogEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGStorageLogEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageLogEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				logEntryId: true,
				$network: true,
				sequenceNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageLogEntry })}
		{@const zeroGStorageLogEntrySelector = zeroGStorageLogEntry[EntityMetaKey.Selector]}
		{@const network = zeroGStorageLogEntrySelector.$network}
		<EntityView
			entityType={EntityType.ZeroGStorageLogEntry}
			entitySelector={zeroGStorageLogEntrySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-log/[logEntryId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						logEntryId: zeroGStorageLogEntrySelector.logEntryId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGStorageLogEntrySelector.logEntryId || 'zero g storage log entry'}
			{/snippet}

			{#snippet Value()}
				{zeroGStorageLogEntry.$network.name || (zeroGStorageLogEntry.$network.caip2 == null ? '' : `${zeroGStorageLogEntry.$network.caip2.namespace}:${zeroGStorageLogEntry.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGStorageLogEntry.sequenceNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
