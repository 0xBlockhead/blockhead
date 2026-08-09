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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MoveModule_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveModule_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					ledgerVersion: true,
					packageVersion: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moveModuleTimestamp })}
		{@const moveModuleTimestampSelector = moveModuleTimestamp[EntityMetaKey.Selector]}
		{@const module = moveModuleTimestampSelector.$module}
		<EntityView
			entityType={EntityType.MoveModule_Timestamp}
			entitySelector={moveModuleTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in module.$network ?
								caip2StringFromValue(module.$network.caip2)
							:
								module.$network.slug
						),
						address: module.address,
						moduleName: module.moduleName,
						timestampMs: String(moveModuleTimestampSelector.timestampMs),
						source: moveModuleTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{moveModuleTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(moveModuleTimestamp.ledgerVersion ?? ''), String(moveModuleTimestamp.packageVersion ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveModuleTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
