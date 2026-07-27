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
		title = 'Username namespaces',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensUsernameNamespace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensUsernameNamespace}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				namespace: true,
				tokenName: true,
				address: true,
				totalUsernames: true,
			},
		})
	}
>
	{#snippet Item({ item: lensUsernameNamespace })}
		{@const lensUsernameNamespaceSelector = lensUsernameNamespace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensUsernameNamespace}
			entitySelector={lensUsernameNamespaceSelector}
		>
			{#snippet Title()}
				{[lensUsernameNamespace.namespace, (lensUsernameNamespace.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace'}
			{/snippet}

			{#snippet Value()}
				{String(lensUsernameNamespaceSelector.address)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(lensUsernameNamespace.totalUsernames ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
