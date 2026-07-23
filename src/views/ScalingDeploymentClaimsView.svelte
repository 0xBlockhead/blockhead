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
		title = 'Scaling deployment claims',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ScalingDeploymentClaims-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ScalingDeploymentClaim>
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
	entityType={EntityType.ScalingDeploymentClaim}
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
				sourceProjectId: true,
				scalingDeploymentClaimId: true,
				source: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(scalingDeploymentClaims) => [...new Map(scalingDeploymentClaims.values.map((scalingDeploymentClaim) => [scalingDeploymentClaim[EntityMetaKey.SelectorKey], scalingDeploymentClaim])).values()]}
	getKey={(scalingDeploymentClaim) => scalingDeploymentClaim[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Scaling deployment claims yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: scalingDeploymentClaim })}
		{@const scalingDeploymentClaimFields = { ...scalingDeploymentClaim[EntityMetaKey.Selector], ...scalingDeploymentClaim }}
		<EntityView
			entityType={EntityType.ScalingDeploymentClaim}
			entitySelector={scalingDeploymentClaim[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((scalingDeploymentClaimFields.sourceProjectId) ?? ''), String((scalingDeploymentClaimFields.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ') || 'scaling deployment claim'}
			{/snippet}

			{#snippet Value()}
				{[String((scalingDeploymentClaimFields.sourceProjectId) ?? ''), String((scalingDeploymentClaimFields.scalingDeploymentClaimId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((scalingDeploymentClaimFields.source) ?? ''), [String((scalingDeploymentClaimFields.$network.name) ?? '')].filter(Boolean).join(' ') || [scalingDeploymentClaimFields.$network.caip2 == null ? '' : String(`${(scalingDeploymentClaimFields.$network.caip2).namespace}:${(scalingDeploymentClaimFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
