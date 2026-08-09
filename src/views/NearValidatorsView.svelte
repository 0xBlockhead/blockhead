<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.NearValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearValidator}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.NearRpc_JsonRpc,
				],
				fields: {
					accountId: true,
					stakeYoctoNear: true,
					isSlashed: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearValidator })}
		{@const nearValidatorSelector = nearValidator[EntityMetaKey.Selector]}
		{@const network = nearValidatorSelector.$network}
		<EntityView
			entityType={EntityType.NearValidator}
			entitySelector={nearValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						validatorId: nearValidatorSelector.accountId,
					}
				)
			}
		>
			{#snippet Title()}
				{nearValidatorSelector.accountId || 'near validator'}
			{/snippet}

			{#snippet Value()}
				{nearValidator.stakeYoctoNear ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearValidator.isSlashed ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
