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
		title = 'Wallet authentications',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletAuthentications-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWalletAuthentication>
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
	entityType={EntityType.BlockheadWalletAuthentication}
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
				authenticationId: true,
				protocol: true,
				verified: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWalletAuthentications) => [...new Map(blockheadWalletAuthentications.values.map((blockheadWalletAuthentication) => [blockheadWalletAuthentication[EntityMetaKey.SelectorKey], blockheadWalletAuthentication])).values()]}
	getKey={(blockheadWalletAuthentication) => blockheadWalletAuthentication[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet authentications yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletAuthentication })}
		{@const blockheadWalletAuthenticationFields = { ...blockheadWalletAuthentication[EntityMetaKey.Selector], ...blockheadWalletAuthentication }}
		<EntityView
			entityType={EntityType.BlockheadWalletAuthentication}
			entitySelector={blockheadWalletAuthentication[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadWalletAuthenticationFields.authenticationId) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet authentication'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWalletAuthenticationFields.protocol) ?? ''), String((blockheadWalletAuthenticationFields.verified) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
