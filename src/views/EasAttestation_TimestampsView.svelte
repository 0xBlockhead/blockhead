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
	}: EntityListViewProps<EntityType.EasAttestation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EasAttestation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					valid: true,
					revoked: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: easAttestationTimestamp })}
		{@const easAttestationTimestampSelector = easAttestationTimestamp[EntityMetaKey.Selector]}
		{@const attestation = easAttestationTimestampSelector.$attestation}
		<EntityView
			entityType={EntityType.EasAttestation_Timestamp}
			entitySelector={easAttestationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/attestation/[uid=zeroExHex]/(easAttestation)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in attestation.$network ?
								caip2StringFromValue(attestation.$network.caip2)
							:
								attestation.$network.slug
						),
						uid: attestation.uid,
						timestampMs: String(easAttestationTimestampSelector.timestampMs),
						source: easAttestationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{easAttestationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{easAttestationTimestamp.valid ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{easAttestationTimestamp.revoked ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
