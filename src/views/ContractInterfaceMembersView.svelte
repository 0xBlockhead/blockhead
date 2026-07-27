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
	}: EntityListViewProps<EntityType.ContractInterfaceMember> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ContractInterfaceMember}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				canonicalSignature: true,
				memberKey: true,
				memberKind: true,
				interfaceId: true,
			},
		})
	}
>
	{#snippet Item({ item: contractInterfaceMember })}
		{@const contractInterfaceMemberSelector = contractInterfaceMember[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ContractInterfaceMember}
			entitySelector={contractInterfaceMemberSelector}
		>
			{#snippet Title()}
				{[(contractInterfaceMember.name ?? ''), (contractInterfaceMember.canonicalSignature ?? ''), contractInterfaceMemberSelector.memberKey].filter(Boolean).join(' ') || 'contract interface member'}
			{/snippet}

			{#snippet Value()}
				{contractInterfaceMember.memberKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{contractInterfaceMemberSelector.interfaceId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
