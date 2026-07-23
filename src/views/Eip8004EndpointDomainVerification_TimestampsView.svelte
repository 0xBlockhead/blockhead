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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004EndpointDomainVerification_Timestamp>
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
	entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
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
				endpointUrl: true,
				verified: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004EndpointDomainVerificationTimestamps) => [...new Map(eip8004EndpointDomainVerificationTimestamps.values.map((eip8004EndpointDomainVerificationTimestamp) => [eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.SelectorKey], eip8004EndpointDomainVerificationTimestamp])).values()]}
	getKey={(eip8004EndpointDomainVerificationTimestamp) => eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
			entitySelector={eip8004EndpointDomainVerificationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004EndpointDomainVerificationTimestampFields.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 endpoint domain verification timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004EndpointDomainVerificationTimestampFields.verified) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004EndpointDomainVerificationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
