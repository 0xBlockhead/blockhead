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
	}: EntityListViewProps<EntityType.EasAttestation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EasAttestation}
	bind:open
	resource={
		selection({
			fields: {
				uid: true,
				$schema: true,
				recipient: true,
				attester: true,
			},
		})
	}
>
	{#snippet Item({ item: easAttestation })}
		{@const easAttestationSelector = easAttestation[EntityMetaKey.Selector]}
		{@const network = easAttestationSelector.$network}
		<EntityView
			entityType={EntityType.EasAttestation}
			entitySelector={easAttestationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/attestation/[uid=zeroExHex]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						uid: easAttestationSelector.uid,
					}
				)
			}
		>
			{#snippet Title()}
				{easAttestationSelector.uid || 'EAS attestation'}
			{/snippet}

			{#snippet Value()}
				{easAttestation.$schema == null ? '' : easAttestation.$schema.schemaUid || 'EAS schema'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[easAttestation.recipient, easAttestation.attester].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
