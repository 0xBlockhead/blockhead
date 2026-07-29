<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.EasAttestation}
			entitySelector={easAttestationSelector}
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
