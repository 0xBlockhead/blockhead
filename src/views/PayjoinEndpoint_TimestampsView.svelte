<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PayjoinEndpoint_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayjoinEndpoint_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				responseStatus: true,
				error: true,
				requiresOhttp: true,
				supportsOutputSubstitution: true,
			},
		})
	}
>
	{#snippet Item({ item: payjoinEndpointTimestamp })}
		{@const payjoinEndpointTimestampSelector = payjoinEndpointTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PayjoinEndpoint_Timestamp}
			entitySelector={payjoinEndpointTimestampSelector}
			href={
				resolve(
					'/payjoin/endpoint/[endpointUrl=stringSegment]/(payjoinEndpoint)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						endpointUrl: payjoinEndpointTimestampSelector.$endpoint.endpointUrl,
						timestampMs: String(payjoinEndpointTimestampSelector.timestampMs),
						source: payjoinEndpointTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{payjoinEndpointTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(payjoinEndpointTimestamp.responseStatus ?? ''), (payjoinEndpointTimestamp.error ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(payjoinEndpointTimestamp.requiresOhttp ?? ''), String(payjoinEndpointTimestamp.supportsOutputSubstitution ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
