<!-- Generated from APP.ts. -->

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
		id = 'PayjoinDirectories-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PayjoinDirectory> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayjoinDirectory}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					directoryUrl: true,
					ohttpGatewayUrl: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: payjoinDirectory })}
		{@const payjoinDirectorySelector = payjoinDirectory[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PayjoinDirectory}
			entitySelector={payjoinDirectorySelector}
			href={
				resolve(
					'/payjoin/directory/[directoryUrl=absoluteUrl]',
					{
						directoryUrl: encodeURIComponent(payjoinDirectorySelector.directoryUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{payjoinDirectorySelector.directoryUrl || 'payjoin directory'}
			{/snippet}

			{#snippet Value()}
				{payjoinDirectory.ohttpGatewayUrl ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
