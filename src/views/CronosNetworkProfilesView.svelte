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
		title = 'Cronos network profiles',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CronosNetworkProfiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CronosNetworkProfile>
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
	entityType={EntityType.CronosNetworkProfile}
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
				$network: true,
				chainKind: true,
				consensusKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cronosNetworkProfiles) => [...new Map(cronosNetworkProfiles.values.map((cronosNetworkProfile) => [cronosNetworkProfile[EntityMetaKey.SelectorKey], cronosNetworkProfile])).values()]}
	getKey={(cronosNetworkProfile) => cronosNetworkProfile[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cronos network profiles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cronosNetworkProfile })}
		{@const cronosNetworkProfileFields = { ...cronosNetworkProfile[EntityMetaKey.Selector], ...cronosNetworkProfile }}
		<EntityView
			entityType={EntityType.CronosNetworkProfile}
			entitySelector={cronosNetworkProfile[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((cronosNetworkProfileFields.$network.name) ?? '')].filter(Boolean).join(' ') || [cronosNetworkProfileFields.$network.caip2 == null ? '' : String(`${(cronosNetworkProfileFields.$network.caip2).namespace}:${(cronosNetworkProfileFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'cronos network profile'}
			{/snippet}

			{#snippet Value()}
				{[String((cronosNetworkProfileFields.chainKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cronosNetworkProfileFields.consensusKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
