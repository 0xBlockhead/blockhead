<script lang="ts">
	// Types/constants
	import { proposalRealmFromRouteParam } from '$/constants/Proposal/ProposalRealm.ts'
	import { ProposalCategory, proposalCategoryBySlug } from '$/constants/Proposal/ProposalCategory.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const realm = $derived(proposalRealmFromRouteParam(params.proposalRealmId))

	const parsedProposal = $derived(
		(({ proposalId: pid }) => {
			const [kindRaw, numberRaw] = pid.split('-')
			const kind = (
				kindRaw != null ?
					proposalCategoryBySlug[kindRaw.toLowerCase()]?.id ?? ProposalCategory.Eip
				:
					ProposalCategory.Eip
			)
			const number = Number(numberRaw ?? 0)
			return (
				Number.isFinite(number) ?
					{
						kind,
						number,
					}
				:	null
			)
		})({ proposalId: params.proposalId }),
	)

	const entityId = $derived(
		realm != null && parsedProposal != null ?
			{
				realm,
				kind: parsedProposal.kind,
				number: parsedProposal.number,
			}
		:	null,
	)


	// Components
	import ProposalView from '$/views/ProposalView.svelte'
</script>


{#if entityId != null}
	<ProposalView
		{entityId}
		href={resolve(
			'/(explore)/(proposals)/proposal/[proposalRealmId]/[proposalId]',
			params,
		)}
		open
	/>
{:else if realm == null}
	<p role="alert">
		Unknown or missing proposal realm.
	</p>
{:else}
	<p role="alert">
		Invalid proposal id in URL.
	</p>
{/if}
