<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'EIP-8004 endpoint domain verifications',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Eip8004EndpointDomainVerification_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				endpointUrl: true,
				verified: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: eip8004EndpointDomainVerificationTimestamp })}
		{@const eip8004EndpointDomainVerificationTimestampSelector = eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
			entitySelector={eip8004EndpointDomainVerificationTimestampSelector}
		>
			{#snippet Title()}
				{eip8004EndpointDomainVerificationTimestampSelector.endpointUrl || 'EIP-8004 endpoint domain verification timestamp'}
			{/snippet}

			{#snippet Value()}
				{eip8004EndpointDomainVerificationTimestamp.verified ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004EndpointDomainVerificationTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
