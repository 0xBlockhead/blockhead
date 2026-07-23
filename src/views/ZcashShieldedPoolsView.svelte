<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Zcash shielded pools',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZcashShieldedPool>
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
	entityType={EntityType.ZcashShieldedPool}
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
				pool: true,
				noteProtocol: true,
				activationNetworkUpgrade: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zcashShieldedPools) => [...new Map(zcashShieldedPools.values.map((zcashShieldedPool) => [zcashShieldedPool[EntityMetaKey.SelectorKey], zcashShieldedPool])).values()]}
	getKey={(zcashShieldedPool) => zcashShieldedPool[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zcash shielded pools yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zcashShieldedPool })}
		{@const zcashShieldedPoolFields = { ...zcashShieldedPool[EntityMetaKey.Selector], ...zcashShieldedPool }}
		<EntityView
			entityType={EntityType.ZcashShieldedPool}
			entitySelector={zcashShieldedPool[EntityMetaKey.Selector]}
			href={
				(
					zcashShieldedPool[EntityMetaKey.Selector] != null && 'pool' in zcashShieldedPool[EntityMetaKey.Selector]
					&& zcashShieldedPool[EntityMetaKey.Selector].pool != null
					&& zcashShieldedPool[EntityMetaKey.Selector] != null && '$network' in zcashShieldedPool[EntityMetaKey.Selector] ?
						zcashShieldedPool[EntityMetaKey.Selector].$network != null && 'caip2' in zcashShieldedPool[EntityMetaKey.Selector].$network
						&& zcashShieldedPool[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
						pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
						network: String(caip2StringFromValue(zcashShieldedPool[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							zcashShieldedPool[EntityMetaKey.Selector].$network != null && 'slug' in zcashShieldedPool[EntityMetaKey.Selector].$network
							&& zcashShieldedPool[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
							pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
							network: String(zcashShieldedPool[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zcashShieldedPoolFields.pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool'}
			{/snippet}

			{#snippet Value()}
				{[String((zcashShieldedPoolFields.noteProtocol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zcashShieldedPoolFields.activationNetworkUpgrade) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
