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
		title = 'EVM contract verifications',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContractVerifications-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmContractVerification>
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
	entityType={EntityType.EvmContractVerification}
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
				match: true,
				runtimeMatch: true,
				$contract: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmContractVerifications) => [...new Map(evmContractVerifications.values.map((evmContractVerification) => [evmContractVerification[EntityMetaKey.SelectorKey], evmContractVerification])).values()]}
	getKey={(evmContractVerification) => evmContractVerification[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM contract verifications yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmContractVerification })}
		{@const evmContractVerificationFields = { ...evmContractVerification[EntityMetaKey.Selector], ...evmContractVerification }}
		<EntityView
			entityType={EntityType.EvmContractVerification}
			entitySelector={evmContractVerification[EntityMetaKey.Selector]}
			href={
				(
					evmContractVerification[EntityMetaKey.Selector] != null && '$contract' in evmContractVerification[EntityMetaKey.Selector]
					&& evmContractVerification[EntityMetaKey.Selector].$contract != null && 'address' in evmContractVerification[EntityMetaKey.Selector].$contract
					&& evmContractVerification[EntityMetaKey.Selector].$contract.address != null
					&& evmContractVerification[EntityMetaKey.Selector].$contract != null && '$network' in evmContractVerification[EntityMetaKey.Selector].$contract ?
						evmContractVerification[EntityMetaKey.Selector].$contract.$network != null && 'caip2' in evmContractVerification[EntityMetaKey.Selector].$contract.$network
						&& evmContractVerification[EntityMetaKey.Selector].$contract.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
						address: String(evmContractVerification[EntityMetaKey.Selector].$contract.address ?? ''),
						network: String(caip2StringFromValue(evmContractVerification[EntityMetaKey.Selector].$contract.$network.caip2) ?? ''),
					})
					:
							evmContractVerification[EntityMetaKey.Selector].$contract.$network != null && 'slug' in evmContractVerification[EntityMetaKey.Selector].$contract.$network
							&& evmContractVerification[EntityMetaKey.Selector].$contract.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
							address: String(evmContractVerification[EntityMetaKey.Selector].$contract.address ?? ''),
							network: String(evmContractVerification[EntityMetaKey.Selector].$contract.$network.slug ?? ''),
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
				{[String((evmContractVerificationFields.match) ?? ''), String((evmContractVerificationFields.runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification'}
			{/snippet}

			{#snippet Value()}
				{[String((evmContractVerificationFields.match) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmContractVerificationFields.$contract.precompileName) ?? ''), String((evmContractVerificationFields.$contract.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
