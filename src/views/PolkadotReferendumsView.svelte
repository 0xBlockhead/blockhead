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
		title = 'Referendums',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotReferendums-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotReferendum>
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
	entityType={EntityType.PolkadotReferendum}
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
				referendumId: true,
				track: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(polkadotReferendums) => [...new Map(polkadotReferendums.values.map((polkadotReferendum) => [polkadotReferendum[EntityMetaKey.SelectorKey], polkadotReferendum])).values()]}
	getKey={(polkadotReferendum) => polkadotReferendum[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot referendums yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotReferendum })}
		{@const polkadotReferendumFields = { ...polkadotReferendum[EntityMetaKey.Selector], ...polkadotReferendum }}
		<EntityView
			entityType={EntityType.PolkadotReferendum}
			entitySelector={polkadotReferendum[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((polkadotReferendumFields.referendumId) ?? '')].filter(Boolean).join(' ') || 'Polkadot referendum'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotReferendumFields.track) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((polkadotReferendumFields.$network.name) ?? '')].filter(Boolean).join(' ') || [polkadotReferendumFields.$network.caip2 == null ? '' : String(`${(polkadotReferendumFields.$network.caip2).namespace}:${(polkadotReferendumFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
