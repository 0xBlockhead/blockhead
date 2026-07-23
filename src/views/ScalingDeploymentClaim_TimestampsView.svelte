<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Scaling deployment claim observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ScalingDeploymentClaim_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ScalingDeploymentClaim_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ScalingDeploymentClaim_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				architectureKind: true,
				protocolLabel: true,
				timestampMs: true,
				stack: true,
				proofSystemKind: true,
				$claim: true,
			},
		})
	}
	{countResource}
	getResourceItems={(scalingDeploymentClaimTimestamps) => [...new Map(scalingDeploymentClaimTimestamps.values.map((scalingDeploymentClaimTimestamp) => [scalingDeploymentClaimTimestamp[EntityMetaKey.SelectorKey], scalingDeploymentClaimTimestamp])).values()]}
	getKey={(scalingDeploymentClaimTimestamp) => scalingDeploymentClaimTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Scaling deployment claim observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: scalingDeploymentClaimTimestamp })}
		{@const scalingDeploymentClaimTimestampFields = { ...scalingDeploymentClaimTimestamp[EntityMetaKey.Selector], ...scalingDeploymentClaimTimestamp }}
		<EntityView
			entityType={EntityType.ScalingDeploymentClaim_Timestamp}
			entitySelector={scalingDeploymentClaimTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((scalingDeploymentClaimTimestampFields.architectureKind) ?? ''), String((scalingDeploymentClaimTimestampFields.protocolLabel) ?? ''), String((scalingDeploymentClaimTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((scalingDeploymentClaimTimestampFields.architectureKind) ?? ''), String((scalingDeploymentClaimTimestampFields.stack) ?? ''), String((scalingDeploymentClaimTimestampFields.proofSystemKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((scalingDeploymentClaimTimestampFields.$claim.sourceProjectId) ?? ''), String((scalingDeploymentClaimTimestampFields.$claim.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
