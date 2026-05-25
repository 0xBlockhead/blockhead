<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const realm = $derived(
		proposalRealmBySlug[params.proposalRealmSlug]?.id,
	)

	const category = $derived(
		proposalCategoryBySlug[params.proposalKindSlug]?.id,
	)

	const entityId = $derived(
		realm != null && category != null && proposalKindAllowedInRealmByKey[`${realm}:${category}`] != null ?
			{
				realm,
				category,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalKindView from '$/views/ProposalKindView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalKindView
			{entityId}
			open
		/>
	{:else}
		<p role="alert">
			Unknown proposal kind in this realm.
		</p>
	{/if}
</Page>

