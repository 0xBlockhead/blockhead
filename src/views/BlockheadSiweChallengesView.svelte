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
		title = 'SIWE challenges',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSiweChallenges-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadSiweChallenge>
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
	import BlockheadSiweChallengeView from '$/views/BlockheadSiweChallengeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSiweChallenge}
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
				domain: true,
				verified: true,
				issuedAt: true,
			},
		})
	}
	getResourceItems={(blockheadSiweChallenges) => [...new Map(blockheadSiweChallenges.values.map((blockheadSiweChallenge) => [blockheadSiweChallenge[EntityMetaKey.SelectorKey], blockheadSiweChallenge])).values()]}
	getKey={(blockheadSiweChallenge) => blockheadSiweChallenge[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead siwe challenges yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSiweChallenge })}
		{@const blockheadSiweChallengeFields = { ...blockheadSiweChallenge[EntityMetaKey.Selector], ...blockheadSiweChallenge }}
		{@const selection = select(EntityType.BlockheadSiweChallenge, blockheadSiweChallenge[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadSiweChallengeView
			selection={selection}
			prefetched={blockheadSiweChallengeFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
