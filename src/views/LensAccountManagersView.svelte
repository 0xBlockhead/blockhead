<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		title = 'Account managers',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensAccountManager> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensAccountManager}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				manager: true,
				isLensManager: true,
			},
		})
	}
>
	{#snippet Item({ item: lensAccountManager })}
		{@const lensAccountManagerSelector = lensAccountManager[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensAccountManager}
			entitySelector={lensAccountManagerSelector}
		>
			{#snippet Title()}
				{String(lensAccountManagerSelector.manager) || 'Lens account manager'}
			{/snippet}

			{#snippet Value()}
				{String(lensAccountManagerSelector.manager)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(lensAccountManager.isLensManager ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
