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
		title = 'Blockhead wallet request calls',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletRequestCalls-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWalletRequestCall>
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
	entityType={EntityType.BlockheadWalletRequestCall}
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
				callIndex: true,
				toAddress: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWalletRequestCalls) => [...new Map(blockheadWalletRequestCalls.values.map((blockheadWalletRequestCall) => [blockheadWalletRequestCall[EntityMetaKey.SelectorKey], blockheadWalletRequestCall])).values()]}
	getKey={(blockheadWalletRequestCall) => blockheadWalletRequestCall[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet request calls yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletRequestCall })}
		{@const blockheadWalletRequestCallFields = { ...blockheadWalletRequestCall[EntityMetaKey.Selector], ...blockheadWalletRequestCall }}
		<EntityView
			entityType={EntityType.BlockheadWalletRequestCall}
			entitySelector={blockheadWalletRequestCall[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((blockheadWalletRequestCallFields.callIndex) ?? '') ? 'Call #' + String((blockheadWalletRequestCallFields.callIndex) ?? '') : '') || 'blockhead wallet request call'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWalletRequestCallFields.toAddress) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
