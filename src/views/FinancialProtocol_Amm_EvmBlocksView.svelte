<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FinancialProtocol_Amm_EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FinancialProtocol_Amm_EvmBlock}
	bind:open
	resource={
		selection({
			fields: {
				$block: true,
				sourceRevision: true,
				$protocol: true,
			},
		})
	}
>
	{#snippet Item({ item: financialProtocolAmmEvmBlock })}
		{@const financialProtocolAmmEvmBlockSelector = financialProtocolAmmEvmBlock[EntityMetaKey.Selector]}
		{@const protocol = financialProtocolAmmEvmBlockSelector.$protocol}
		<EntityView
			entityType={EntityType.FinancialProtocol_Amm_EvmBlock}
			entitySelector={financialProtocolAmmEvmBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]/(financialProtocol)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
					{
						network: (
							protocol.$network.caip2 !== undefined ?
								caip2StringFromValue(protocol.$network.caip2)
							:
								protocol.$network.slug
						),
						protocolKey: protocol.protocolKey,
						blockSelector: String(stringify(financialProtocolAmmEvmBlockSelector.$block)),
						sourceRevision: financialProtocolAmmEvmBlockSelector.sourceRevision,
					}
				)
			}
		>
			{#snippet Title()}
				{[`Block #${financialProtocolAmmEvmBlock.$block.blockNumber}`, financialProtocolAmmEvmBlockSelector.sourceRevision].filter(Boolean).join(' ') || 'AMM protocol financial observation'}
			{/snippet}

			{#snippet Value()}
				{[financialProtocolAmmEvmBlock.$protocol.name || financialProtocolAmmEvmBlockSelector.$protocol.protocolKey || 'financial protocol', `Block #${financialProtocolAmmEvmBlock.$block.blockNumber}`, financialProtocolAmmEvmBlockSelector.sourceRevision].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
