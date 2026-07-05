<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Scaling deployment claims',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ScalingDeploymentClaims-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ScalingDeploymentClaim>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					sourceProjectId: true,
					scalingDeploymentClaimId: true,
					source: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(scalingDeploymentClaims)}
			{@const uniqueScalingDeploymentClaims = [...new Map(scalingDeploymentClaims.values.map((scalingDeploymentClaim) => [scalingDeploymentClaim[EntityMetaKey.SelectorKey], scalingDeploymentClaim])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ScalingDeploymentClaim}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={scalingDeploymentClaims.totalCount}
				getKey={(scalingDeploymentClaim) => scalingDeploymentClaim[EntityMetaKey.SelectorKey]}
				items={uniqueScalingDeploymentClaims}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Scaling deployment claims yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: scalingDeploymentClaim }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ScalingDeploymentClaim> })}
					{@const scalingDeploymentClaimFields = { ...scalingDeploymentClaim[EntityMetaKey.Selector], ...scalingDeploymentClaim }}
					<ScalingDeploymentClaimView
						selection={select(EntityType.ScalingDeploymentClaim, scalingDeploymentClaim[EntityMetaKey.Selector])}
						prefetched={scalingDeploymentClaimFields}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.ScalingDeploymentClaim}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
