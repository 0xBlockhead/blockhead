<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmUserOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-4337 user operations are intent objects bundlers include in transactions to the entry point.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmUserOperation}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				hash: true,
				successful: true,
			},
			limit: 16,
		})
	}
>
	{#snippet Item({ item: evmUserOperation })}
		{@const evmUserOperationSelector = evmUserOperation[EntityMetaKey.Selector]}
		{@const network = evmUserOperationSelector.$network}
		<EntityView
			entityType={EntityType.EvmUserOperation}
			entitySelector={evmUserOperationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						userOperationHash: evmUserOperationSelector.hash,
					}
				)
			}
		>
			{#snippet Title()}
				{evmUserOperationSelector.hash || 'User operation'}
			{/snippet}

			{#snippet Value()}
				{evmUserOperationSelector.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmUserOperation.successful ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
