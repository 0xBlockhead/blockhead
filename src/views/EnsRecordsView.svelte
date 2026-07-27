<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EnsRecord> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsRecord}
	bind:open
	resource={
		selection({
			fields: {
				recordKey: true,
				$name: true,
			},
		})
	}
>
	{#snippet Item({ item: ensRecord })}
		{@const ensRecordSelector = ensRecord[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsRecord}
			entitySelector={ensRecordSelector}
			href={
				resolve(
					'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
					{
						ensName: encodeURIComponent(String(ensRecordSelector.$name.name)),
						recordId: encodeURIComponent(String(ensRecordSelector.recordKey)),
					}
				)
			}
		>
			{#snippet Title()}
				{ensRecordSelector.recordKey || 'ENS record'}
			{/snippet}

			{#snippet Value()}
				{ensRecordSelector.$name.name || 'ENS name'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
