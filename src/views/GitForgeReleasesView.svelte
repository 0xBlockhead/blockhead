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
	}: EntityListViewProps<EntityType.GitForgeRelease> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeRelease}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				releaseTagName: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeRelease })}
		{@const gitForgeReleaseSelector = gitForgeRelease[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitForgeRelease}
			entitySelector={gitForgeReleaseSelector}
		>
			{#snippet Title()}
				{(gitForgeRelease.name ?? '') || gitForgeReleaseSelector.releaseTagName || 'Git forge release'}
			{/snippet}

			{#snippet Value()}
				{gitForgeReleaseSelector.releaseTagName}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
