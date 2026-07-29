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
	}: EntityListViewProps<EntityType.QuilibriumAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumAccount}
	bind:open
	resource={
		selection({
			fields: {
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
>
	{#snippet Item({ item: quilibriumAccount })}
		{@const quilibriumAccountSelector = quilibriumAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.QuilibriumAccount}
			entitySelector={quilibriumAccountSelector}
		>
			{#snippet Title()}
				{quilibriumAccountSelector.accountAddress || 'quilibrium account'}
			{/snippet}

			{#snippet Value()}
				{quilibriumAccount.$network.name || (quilibriumAccountSelector.$network.caip2 == null ? '' : `${quilibriumAccountSelector.$network.caip2.namespace}:${quilibriumAccountSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumAccount.accountKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
