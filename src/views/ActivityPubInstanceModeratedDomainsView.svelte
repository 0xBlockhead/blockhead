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
	}: EntityListViewProps<EntityType.ActivityPubInstanceModeratedDomain> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
	bind:open
	resource={
		selection({
			...{
				fields: {
					domain: true,
					severity: true,
					comment: true,
					$observation: {
						fields: {
							title: true,
							$instance: true,
							version: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: activityPubInstanceModeratedDomain })}
		{@const activityPubInstanceModeratedDomainSelector = activityPubInstanceModeratedDomain[EntityMetaKey.Selector]}
		{@const observation = activityPubInstanceModeratedDomainSelector.$observation}
		<EntityView
			entityType={EntityType.ActivityPubInstanceModeratedDomain}
			entitySelector={activityPubInstanceModeratedDomainSelector}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/moderated-domain/[digest=stringSegment]',
					{
						instanceOrigin: encodeURIComponent(observation.$instance.instanceOrigin),
						timestampMs: String(observation.timestampMs),
						source: observation.source,
						digest: activityPubInstanceModeratedDomainSelector.digest,
					}
				)
			}
		>
			{#snippet Title()}
				{[activityPubInstanceModeratedDomain.domain, activityPubInstanceModeratedDomain.severity, (activityPubInstanceModeratedDomain.comment ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain'}
			{/snippet}

			{#snippet Value()}
				{[(activityPubInstanceModeratedDomain.$observation.title ?? ''), String(activityPubInstanceModeratedDomainSelector.$observation.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
