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
	}: EntityListViewProps<EntityType.CelestiaBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlob}
	bind:open
	resource={
		selection({
			fields: {
				commitment: true,
				height: true,
				$namespace: {
					fields: {
						label: true,
						namespaceVersion: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlob })}
		{@const celestiaBlobSelector = celestiaBlob[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaBlob}
			entitySelector={celestiaBlobSelector}
		>
			{#snippet Title()}
				{celestiaBlobSelector.commitment || 'celestia blob'}
			{/snippet}

			{#snippet Value()}
				{String(celestiaBlobSelector.height)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(celestiaBlob.$namespace.label ?? '') || celestiaBlobSelector.$namespace.namespaceId || 'celestia namespace'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
