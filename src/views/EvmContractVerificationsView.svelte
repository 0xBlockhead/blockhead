<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.EvmContractVerification> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContractVerification}
	bind:open
	resource={
		selection({
			fields: {
				match: true,
				runtimeMatch: true,
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: evmContractVerification })}
		{@const evmContractVerificationSelector = evmContractVerification[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmContractVerification}
			entitySelector={evmContractVerificationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification',
					{
						network: (
							'caip2' in evmContractVerificationSelector.$contract.$network ?
								String(caip2StringFromValue(evmContractVerificationSelector.$contract.$network.caip2))
							:
								String(evmContractVerificationSelector.$contract.$network.slug)
						),
						address: String(evmContractVerificationSelector.$contract.address),
					}
				)
			}
		>
			{#snippet Title()}
				{[(evmContractVerification.match ?? ''), (evmContractVerification.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification'}
			{/snippet}

			{#snippet Value()}
				{(evmContractVerification.match ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(evmContractVerification.$contract.precompileName ?? ''), String(evmContractVerificationSelector.$contract.address)].filter(Boolean).join(' ') || 'EVM contract'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
