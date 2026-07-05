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
		title = 'Zero g service requests',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGServiceRequests-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ZeroGServiceRequest>
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
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
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
					requestId: true,
					$serviceProvider: true,
					$requester: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(zeroGServiceRequests)}
			{@const uniqueZeroGServiceRequests = [...new Map(zeroGServiceRequests.values.map((zeroGServiceRequest) => [zeroGServiceRequest[EntityMetaKey.SelectorKey], zeroGServiceRequest])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZeroGServiceRequest}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={zeroGServiceRequests.totalCount}
				getKey={(zeroGServiceRequest) => zeroGServiceRequest[EntityMetaKey.SelectorKey]}
				items={uniqueZeroGServiceRequests}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Zero g service requests yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: zeroGServiceRequest }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ZeroGServiceRequest> })}
					{@const zeroGServiceRequestFields = { ...zeroGServiceRequest[EntityMetaKey.Selector], ...zeroGServiceRequest }}
					<ZeroGServiceRequestView
						selection={select(EntityType.ZeroGServiceRequest, zeroGServiceRequest[EntityMetaKey.Selector])}
						prefetched={zeroGServiceRequestFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.ZeroGServiceRequest}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
