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
		title = 'Hedera token associations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaTokenAssociations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HederaTokenAssociation>
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
	entityType={EntityType.HederaTokenAssociation}
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
				$token: true,
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(hederaTokenAssociations) => [...new Map(hederaTokenAssociations.values.map((hederaTokenAssociation) => [hederaTokenAssociation[EntityMetaKey.SelectorKey], hederaTokenAssociation])).values()]}
	getKey={(hederaTokenAssociation) => hederaTokenAssociation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera token associations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaTokenAssociation })}
		{@const hederaTokenAssociationFields = { ...hederaTokenAssociation[EntityMetaKey.Selector], ...hederaTokenAssociation }}
		<EntityView
			entityType={EntityType.HederaTokenAssociation}
			entitySelector={hederaTokenAssociation[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((hederaTokenAssociationFields.$token.tokenId) ?? '')].filter(Boolean).join(' ') || 'hedera token'].filter(Boolean).join(' ') || 'hedera token association'}
			{/snippet}

			{#snippet Value()}
				{[[String((hederaTokenAssociationFields.$account.accountId) ?? '')].filter(Boolean).join(' ') || 'hedera account'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
