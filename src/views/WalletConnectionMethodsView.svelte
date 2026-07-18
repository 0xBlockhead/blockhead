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
		title = 'Wallet connection methods',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'WalletConnectionMethods-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.WalletConnectionMethod>
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
	import WalletConnectionMethodView from '$/views/WalletConnectionMethodView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.WalletConnectionMethod}
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
				label: true,
				protocol: true,
				implementationStatus: true,
			},
		})
	}
	getResourceItems={(walletConnectionMethods) => [...new Map(walletConnectionMethods.values.map((walletConnectionMethod) => [walletConnectionMethod[EntityMetaKey.SelectorKey], walletConnectionMethod])).values()]}
	getKey={(walletConnectionMethod) => walletConnectionMethod[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Wallet connection methods yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: walletConnectionMethod })}
		{@const walletConnectionMethodFields = { ...walletConnectionMethod[EntityMetaKey.Selector], ...walletConnectionMethod }}
		{@const selection = select(EntityType.WalletConnectionMethod, walletConnectionMethod[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<WalletConnectionMethodView
			selection={selection}
			prefetched={walletConnectionMethodFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
