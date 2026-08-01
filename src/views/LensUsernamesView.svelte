<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Usernames',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensUsername> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensUsername}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				value: true,
				localName: true,
				timestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: lensUsername })}
		{@const lensUsernameSelector = lensUsername[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensUsername}
			entitySelector={lensUsernameSelector}
		>
			{#snippet Title()}
				{[(lensUsername.value ?? ''), lensUsernameSelector.localName].filter(Boolean).join(' ') || 'Lens username'}
			{/snippet}

			{#snippet Value()}
				{lensUsernameSelector.localName}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{lensUsername.timestamp ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
