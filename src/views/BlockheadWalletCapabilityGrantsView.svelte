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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWalletCapabilityGrant>
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
	import BlockheadWalletCapabilityGrantView from '$/views/BlockheadWalletCapabilityGrantView.svelte'
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
		{@const selection = select(EntityType.BlockheadWalletCapabilityGrant, blockheadWalletCapabilityGrant[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadWalletCapabilityGrantView
			selection={selection}
			prefetched={blockheadWalletCapabilityGrantFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
