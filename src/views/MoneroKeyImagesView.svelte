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
	}: EntityListViewProps<EntityType.MoneroKeyImage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroKeyImage}
	bind:open
	resource={
		selection({
			fields: {
				keyImage: true,
				inputIndex: true,
				$ring: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroKeyImage })}
		{@const moneroKeyImageSelector = moneroKeyImage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroKeyImage}
			entitySelector={moneroKeyImageSelector}
		>
			{#snippet Title()}
				{moneroKeyImageSelector.keyImage || 'monero key image'}
			{/snippet}

			{#snippet Value()}
				{moneroKeyImageSelector.inputIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroKeyImage.$ring == null ? '' : 'monero ring'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
