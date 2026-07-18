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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWalletAuthentication>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadWalletAuthenticationView from '$/views/BlockheadWalletAuthenticationView.svelte'
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
		{@const selection = select(EntityType.BlockheadWalletAuthentication, blockheadWalletAuthentication[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadWalletAuthenticationView
			selection={selection}
			prefetched={blockheadWalletAuthenticationFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
