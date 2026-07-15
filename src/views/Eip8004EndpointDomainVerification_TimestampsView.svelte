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
		title = 'EIP-8004 endpoint domain verifications',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004EndpointDomainVerification_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Eip8004EndpointDomainVerification_Timestamp>
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
	import Eip8004EndpointDomainVerification_TimestampView from '$/views/Eip8004EndpointDomainVerification_TimestampView.svelte'
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
					verified: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(eip8004EndpointDomainVerificationTimestamps)}
			{@const uniqueEip8004EndpointDomainVerificationTimestamps = [...new Map(eip8004EndpointDomainVerificationTimestamps.values.map((eip8004EndpointDomainVerificationTimestamp) => [eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.SelectorKey], eip8004EndpointDomainVerificationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eip8004EndpointDomainVerificationTimestamps.totalCount}
				getKey={(eip8004EndpointDomainVerificationTimestamp) => eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEip8004EndpointDomainVerificationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EIP-8004 endpoint domain verification observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eip8004EndpointDomainVerificationTimestamp })}
					{@const eip8004EndpointDomainVerificationTimestampFields = { ...eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.Selector], ...eip8004EndpointDomainVerificationTimestamp }}
					{@const selection = select(EntityType.Eip8004EndpointDomainVerification_Timestamp, eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<Eip8004EndpointDomainVerification_TimestampView
						selection={selection}
						prefetched={eip8004EndpointDomainVerificationTimestampFields}
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
		entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
