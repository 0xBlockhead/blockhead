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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ScalingDeploymentClaim_Timestamp>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ScalingDeploymentClaim_TimestampView from '$/views/ScalingDeploymentClaim_TimestampView.svelte'
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
					architectureKind: true,
					protocolLabel: true,
					timestampMs: true,
					stack: true,
					proofSystemKind: true,
					$claim: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ScalingDeploymentClaim_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(scalingDeploymentClaimTimestamps)}
			{@const uniqueScalingDeploymentClaimTimestamps = [...new Map(scalingDeploymentClaimTimestamps.values.map((scalingDeploymentClaimTimestamp) => [scalingDeploymentClaimTimestamp[EntityMetaKey.SelectorKey], scalingDeploymentClaimTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ScalingDeploymentClaim_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={scalingDeploymentClaimTimestamps.totalCount}
				getKey={(scalingDeploymentClaimTimestamp) => scalingDeploymentClaimTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueScalingDeploymentClaimTimestamps}
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
					{@const selection = select(EntityType.ScalingDeploymentClaim_Timestamp, scalingDeploymentClaimTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<ScalingDeploymentClaim_TimestampView
						selection={selection}
						prefetched={scalingDeploymentClaimTimestampFields}
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
		entityType={EntityType.ScalingDeploymentClaim_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
