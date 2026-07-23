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
		title = 'Blockhead Monero subaddress states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroSubaddressStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadMoneroSubaddressState>
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
	entityType={EntityType.BlockheadMoneroSubaddressState}
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
				address: true,
				accountIndex: true,
				addressIndex: true,
				walletId: true,
				label: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadMoneroSubaddressStates) => [...new Map(blockheadMoneroSubaddressStates.values.map((blockheadMoneroSubaddressState) => [blockheadMoneroSubaddressState[EntityMetaKey.SelectorKey], blockheadMoneroSubaddressState])).values()]}
	getKey={(blockheadMoneroSubaddressState) => blockheadMoneroSubaddressState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero subaddress states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroSubaddressState })}
		{@const blockheadMoneroSubaddressStateFields = { ...blockheadMoneroSubaddressState[EntityMetaKey.Selector], ...blockheadMoneroSubaddressState }}
		<EntityView
			entityType={EntityType.BlockheadMoneroSubaddressState}
			entitySelector={blockheadMoneroSubaddressState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadMoneroSubaddressStateFields.address) ?? '')].filter(Boolean).join(' ') || [String((blockheadMoneroSubaddressStateFields.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadMoneroSubaddressStateFields.accountIndex) ?? ''), String((blockheadMoneroSubaddressStateFields.addressIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadMoneroSubaddressStateFields.label) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
