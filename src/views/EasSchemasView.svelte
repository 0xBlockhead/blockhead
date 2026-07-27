<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EasSchema> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EasSchema}
	bind:open
	resource={
		selection({
			fields: {
				schemaUid: true,
				schema: true,
				resolver: true,
			},
		})
	}
>
	{#snippet Item({ item: easSchema })}
		{@const easSchemaSelector = easSchema[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EasSchema}
			entitySelector={easSchemaSelector}
		>
			{#snippet Title()}
				{String(easSchemaSelector.schemaUid) || 'EAS schema'}
			{/snippet}

			{#snippet Value()}
				{easSchema.schema}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(easSchema.resolver ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
