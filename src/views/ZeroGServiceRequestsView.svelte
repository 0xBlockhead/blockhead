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
		title = 'Zero g service requests',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGServiceRequests-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGServiceRequest>
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
	entityType={EntityType.ZeroGServiceRequest}
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
				requestId: true,
				$serviceProvider: true,
				$requester: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGServiceRequests) => [...new Map(zeroGServiceRequests.values.map((zeroGServiceRequest) => [zeroGServiceRequest[EntityMetaKey.SelectorKey], zeroGServiceRequest])).values()]}
	getKey={(zeroGServiceRequest) => zeroGServiceRequest[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g service requests yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGServiceRequest })}
		{@const zeroGServiceRequestFields = { ...zeroGServiceRequest[EntityMetaKey.Selector], ...zeroGServiceRequest }}
		<EntityView
			entityType={EntityType.ZeroGServiceRequest}
			entitySelector={zeroGServiceRequest[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGServiceRequestFields.requestId) ?? '')].filter(Boolean).join(' ') || 'zero g service request'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGServiceRequestFields.$serviceProvider.providerId) ?? '')].filter(Boolean).join(' ') || 'zero g service provider'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((zeroGServiceRequestFields.$requester.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
