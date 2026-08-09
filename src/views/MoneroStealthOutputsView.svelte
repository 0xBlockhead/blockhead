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
	}: EntityListViewProps<EntityType.MoneroStealthOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroStealthOutput}
	bind:open
	resource={
		selection({
			...{
				fields: {
					outputIndex: true,
					publicKey: true,
					commitment: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moneroStealthOutput })}
		{@const moneroStealthOutputSelector = moneroStealthOutput[EntityMetaKey.Selector]}
		{@const transaction = moneroStealthOutputSelector.$transaction}
		<EntityView
			entityType={EntityType.MoneroStealthOutput}
			entitySelector={moneroStealthOutputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/stealth-output/[outputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						outputIndex: String(moneroStealthOutputSelector.outputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{moneroStealthOutputSelector.outputIndex}
			{/snippet}

			{#snippet Value()}
				{moneroStealthOutput.publicKey ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroStealthOutput.commitment ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
