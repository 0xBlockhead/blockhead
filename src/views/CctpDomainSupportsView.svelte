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
		title = 'CCTP domain supports',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CctpDomainSupports-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CctpDomainSupport>
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
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
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
					name: true,
					domainId: true,
					cctpVersion: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(cctpDomainSupports)}
			{@const uniqueCctpDomainSupports = [...new Map(cctpDomainSupports.values.map((cctpDomainSupport) => [cctpDomainSupport[EntityMetaKey.SelectorKey], cctpDomainSupport])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CctpDomainSupport}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cctpDomainSupports.totalCount}
				getKey={(cctpDomainSupport) => cctpDomainSupport[EntityMetaKey.SelectorKey]}
				items={uniqueCctpDomainSupports}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No CCTP domain supports yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cctpDomainSupport }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CctpDomainSupport> })}
					{@const cctpDomainSupportFields = { ...cctpDomainSupport[EntityMetaKey.Selector], ...cctpDomainSupport }}
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, cctpDomainSupport[EntityMetaKey.Selector])}
						prefetched={cctpDomainSupportFields}
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
		entityType={EntityType.CctpDomainSupport}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
