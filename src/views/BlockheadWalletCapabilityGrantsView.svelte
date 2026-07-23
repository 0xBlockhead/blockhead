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
		title = 'Wallet capability grants',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletCapabilityGrants-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWalletCapabilityGrant>
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
	entityType={EntityType.BlockheadWalletCapabilityGrant}
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
				grantId: true,
				authorizationKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWalletCapabilityGrants) => [...new Map(blockheadWalletCapabilityGrants.values.map((blockheadWalletCapabilityGrant) => [blockheadWalletCapabilityGrant[EntityMetaKey.SelectorKey], blockheadWalletCapabilityGrant])).values()]}
	getKey={(blockheadWalletCapabilityGrant) => blockheadWalletCapabilityGrant[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet capability grants yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletCapabilityGrant })}
		{@const blockheadWalletCapabilityGrantFields = { ...blockheadWalletCapabilityGrant[EntityMetaKey.Selector], ...blockheadWalletCapabilityGrant }}
		<EntityView
			entityType={EntityType.BlockheadWalletCapabilityGrant}
			entitySelector={blockheadWalletCapabilityGrant[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadWalletCapabilityGrantFields.grantId) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet capability grant'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWalletCapabilityGrantFields.authorizationKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
