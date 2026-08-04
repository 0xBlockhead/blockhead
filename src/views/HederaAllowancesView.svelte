<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.HederaAllowance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAllowance}
	bind:open
	resource={
		selection({
			fields: {
				allowanceKind: true,
				$spender: true,
				$token: true,
				serialNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaAllowance })}
		{@const hederaAllowanceSelector = hederaAllowance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaAllowance}
			entitySelector={hederaAllowanceSelector}
		>
			{#snippet Title()}
				{hederaAllowanceSelector.allowanceKind || 'hedera allowance'}
			{/snippet}

			{#snippet Value()}
				{hederaAllowanceSelector.$spender.accountId || 'hedera account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[hederaAllowance.$token == null ? '' : hederaAllowance.$token.tokenId || 'hedera token', String(hederaAllowance.serialNumber ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
