<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ScalingDeploymentClaim>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ScalingDeploymentClaimView from '$/views/ScalingDeploymentClaimView.svelte'
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
		{@const selection = select(EntityType.ScalingDeploymentClaim, scalingDeploymentClaim[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<ScalingDeploymentClaimView
			selection={selection}
			prefetched={scalingDeploymentClaimFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
