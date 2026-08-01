<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Token program extensions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TokenProgramExtension_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TokenProgramExtension_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				extensionKind: true,
				extensionScope: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: tokenProgramExtensionTimestamp })}
		{@const tokenProgramExtensionTimestampSelector = tokenProgramExtensionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TokenProgramExtension_Timestamp}
			entitySelector={tokenProgramExtensionTimestampSelector}
		>
			{#snippet Title()}
				{tokenProgramExtensionTimestampSelector.extensionKind || 'token program extension timestamp'}
			{/snippet}

			{#snippet Value()}
				{tokenProgramExtensionTimestampSelector.extensionScope}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tokenProgramExtensionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
