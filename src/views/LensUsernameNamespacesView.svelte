<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			...{
				fields: {
					namespace: true,
					tokenName: true,
					address: true,
					totalUsernames: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: lensUsernameNamespace })}
		{@const lensUsernameNamespaceSelector = lensUsernameNamespace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensUsernameNamespace}
			entitySelector={lensUsernameNamespaceSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]',
					{
						address: lensUsernameNamespaceSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[lensUsernameNamespace.namespace, (lensUsernameNamespace.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace'}
			{/snippet}

			{#snippet Value()}
				{lensUsernameNamespaceSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{lensUsernameNamespace.totalUsernames ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
