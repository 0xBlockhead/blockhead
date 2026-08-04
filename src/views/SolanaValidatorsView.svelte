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
		title = 'Validators',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaValidator}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				votePubkey: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaValidator })}
		{@const solanaValidatorSelector = solanaValidator[EntityMetaKey.Selector]}
		{@const network = solanaValidatorSelector.$network}
		<EntityView
			entityType={EntityType.SolanaValidator}
			entitySelector={solanaValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						validatorId: solanaValidatorSelector.votePubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaValidatorSelector.votePubkey || 'solana validator'}
			{/snippet}

			{#snippet Value()}
				{solanaValidatorSelector.votePubkey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaValidator.$network.name || (solanaValidator.$network.caip2 == null ? '' : `${solanaValidator.$network.caip2.namespace}:${solanaValidator.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
