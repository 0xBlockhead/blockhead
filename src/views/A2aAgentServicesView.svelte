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
		title = 'A2A agent services',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentServices-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.A2aAgentService>
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
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
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
					endpointUrl: true,
					protocolBinding: true,
					transportKind: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(a2aAgentServices)}
			{@const uniqueA2aAgentServices = [...new Map(a2aAgentServices.values.map((a2aAgentService) => [a2aAgentService[EntityMetaKey.SelectorKey], a2aAgentService])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aAgentService}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={a2aAgentServices.totalCount}
				getKey={(a2aAgentService) => a2aAgentService[EntityMetaKey.SelectorKey]}
				items={uniqueA2aAgentServices}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No A2A agent services yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: a2aAgentService }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.A2aAgentService> })}
					{@const a2aAgentServiceFields = { ...a2aAgentService[EntityMetaKey.Selector], ...a2aAgentService }}
					<A2aAgentServiceView
						selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
						prefetched={a2aAgentServiceFields}
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
		entityType={EntityType.A2aAgentService}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
