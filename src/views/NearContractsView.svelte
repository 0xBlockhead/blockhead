<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContract}
	bind:open
	resource={
		selection({
			fields: {
				accountId: true,
				codeHash: true,
				codeSizeBytes: true,
			},
		})
	}
>
	{#snippet Item({ item: nearContract })}
		{@const nearContractSelector = nearContract[EntityMetaKey.Selector]}
		{@const network = nearContractSelector.$network}
		<EntityView
			entityType={EntityType.NearContract}
			entitySelector={nearContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: nearContractSelector.accountId,
					}
				)
			}
		>
			{#snippet Title()}
				{nearContractSelector.accountId || 'near contract'}
			{/snippet}

			{#snippet Value()}
				{nearContract.codeHash ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearContract.codeSizeBytes ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
