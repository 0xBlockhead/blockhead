<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<svelte:head>
	<title>Specification proposal • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationProposalView
		href={
			resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]', {
				specificationRealmSlug: params.specificationRealmSlug,
				proposalKindSlug: params.proposalKindSlug,
				proposalRef: params.proposalRef,
			})
		}
		selection={
			select(EntityType.SpecificationProposal, data.selector, {
				fields: {
					documentTitle: true,
					documentCategory: true,
					documentStatus: true,
					documentBody: true,
				},
			})
		}
	/>
</Page>
