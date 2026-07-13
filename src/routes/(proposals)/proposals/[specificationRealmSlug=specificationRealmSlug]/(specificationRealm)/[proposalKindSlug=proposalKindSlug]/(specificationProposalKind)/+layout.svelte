<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


{#key [params.specificationRealmSlug, params.proposalKindSlug].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
				proposalKindSlug: params.proposalKindSlug,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = SpecificationProposalKindView}

			<DetailView
				selection={select(EntityType.SpecificationProposalKind, data.selector)}
				href={
					resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
						specificationRealmSlug: params.specificationRealmSlug,
						proposalKindSlug: params.proposalKindSlug,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
