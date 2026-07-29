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
	}: EntityListViewProps<EntityType.NearAccessKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccessKey}
	bind:open
	resource={
		selection({
			fields: {
				publicKey: true,
				permission: true,
				nonce: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccessKey })}
		{@const nearAccessKeySelector = nearAccessKey[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearAccessKey}
			entitySelector={nearAccessKeySelector}
		>
			{#snippet Title()}
				{nearAccessKeySelector.publicKey || 'near access key'}
			{/snippet}

			{#snippet Value()}
				{nearAccessKey.permission ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccessKey.nonce ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
