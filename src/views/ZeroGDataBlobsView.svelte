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
	}: EntityListViewProps<EntityType.ZeroGDataBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGDataBlob}
	bind:open
	resource={
		selection({
			fields: {
				dataRoot: true,
				$network: true,
				sizeBytes: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGDataBlob })}
		{@const zeroGDataBlobSelector = zeroGDataBlob[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGDataBlob}
			entitySelector={zeroGDataBlobSelector}
		>
			{#snippet Title()}
				{zeroGDataBlobSelector.dataRoot || 'zero g data blob'}
			{/snippet}

			{#snippet Value()}
				{zeroGDataBlob.$network.name || (zeroGDataBlobSelector.$network.caip2 == null ? '' : `${zeroGDataBlobSelector.$network.caip2.namespace}:${zeroGDataBlobSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(zeroGDataBlob.sizeBytes ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
