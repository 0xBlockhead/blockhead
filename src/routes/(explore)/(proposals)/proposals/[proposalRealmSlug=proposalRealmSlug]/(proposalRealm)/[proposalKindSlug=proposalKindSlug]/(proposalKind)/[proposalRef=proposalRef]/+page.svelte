<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const realm = $derived(
		proposalRealmBySlug[params.proposalRealmSlug]?.id,
	)

	const category = $derived(
		proposalCategoryBySlug[params.proposalKindSlug]?.id,
	)

	const proposalNumber = $derived(
		(() => {
			const raw = params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)
			return /^\d+$/.test(raw) ? Number(raw) : undefined
		})(),
	)

	const proposalCategory = $derived(
		(() => {
			const raw = params.proposalRef.slice(0, params.proposalRef.lastIndexOf('-')).toLowerCase()
			return proposalCategoryBySlug[raw]?.id ?? undefined
		})(),
	)

	const entityId = $derived(
		realm != null && category != null && proposalCategory != null
		&& proposalNumber != null
		&& category === proposalCategory
		&& proposalKindAllowedInRealmByKey[`${realm}:${category}`] != null ?
			{
				realm,
				category,
				number: proposalNumber,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalView
			{entityId}
			open
		/>
	{:else}
		<p role="alert">
			Invalid proposal id in URL.
		</p>
	{/if}
</Page>

