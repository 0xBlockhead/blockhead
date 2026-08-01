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
		title = 'Programs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaProgram> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaProgram}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				programId: true,
				name: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaProgram })}
		{@const solanaProgramSelector = solanaProgram[EntityMetaKey.Selector]}
		{@const network = solanaProgramSelector.$network}
		<EntityView
			entityType={EntityType.SolanaProgram}
			entitySelector={solanaProgramSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						programId: solanaProgramSelector.programId,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaProgramSelector.programId || 'solana program'}
			{/snippet}

			{#snippet Value()}
				{solanaProgram.name ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaProgram.$network.name || (solanaProgramSelector.$network.caip2 == null ? '' : `${solanaProgramSelector.$network.caip2.namespace}:${solanaProgramSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
