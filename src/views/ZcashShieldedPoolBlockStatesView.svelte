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
		title = 'Zcash shielded pool block states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPoolBlockStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZcashShieldedPoolBlockState>
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
	entityType={EntityType.ZcashShieldedPoolBlockState}
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
				$pool: {
					fields: {
						noteProtocol: true,
						activationNetworkUpgrade: true,
					},
				},
				saplingTree: true,
				orchardTree: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zcashShieldedPoolBlockStates) => [...new Map(zcashShieldedPoolBlockStates.values.map((zcashShieldedPoolBlockState) => [zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey], zcashShieldedPoolBlockState])).values()]}
	getKey={(zcashShieldedPoolBlockState) => zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zcash shielded pool block states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zcashShieldedPoolBlockState })}
		{@const zcashShieldedPoolBlockStateFields = { ...zcashShieldedPoolBlockState[EntityMetaKey.Selector], ...zcashShieldedPoolBlockState }}
		<EntityView
			entityType={EntityType.ZcashShieldedPoolBlockState}
			entitySelector={zcashShieldedPoolBlockState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((zcashShieldedPoolBlockStateFields.$pool.pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool'].filter(Boolean).join(' ') || 'zcash shielded pool block state'}
			{/snippet}

			{#snippet Value()}
				{[zcashShieldedPoolBlockStateFields.saplingTree == null ? '' : String(`${(zcashShieldedPoolBlockStateFields.saplingTree).finalRoot} / ${(zcashShieldedPoolBlockStateFields.saplingTree).finalState}`), zcashShieldedPoolBlockStateFields.orchardTree == null ? '' : String(`${(zcashShieldedPoolBlockStateFields.orchardTree).finalRoot} / ${(zcashShieldedPoolBlockStateFields.orchardTree).finalState}`)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
