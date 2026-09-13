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
		{@const network = easSchemaSelector.$network}
		<EntityView
			entityType={EntityType.EasSchema}
			entitySelector={easSchemaSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/schema/[schemaUid=zeroExHex]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						schemaUid: easSchemaSelector.schemaUid,
					}
				)
			}
		>
			{#snippet Title()}
				{easSchemaSelector.schemaUid || 'EAS schema'}
			{/snippet}

			{#snippet Value()}
				{easSchema.schema}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{easSchema.resolver ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
