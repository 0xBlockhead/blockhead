<script lang="ts">
	// Types/constants
	import { ProposalType } from '$/schema/Proposal.ts'

	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<Page>
	<ProposalView
		entityId={(
			(({ proposalId: pid }) => {
				const [kindRaw, numberRaw] = pid.split('-')
				return {
					kind: (
						kindRaw?.toLowerCase() === 'erc' ?
							ProposalType.Erc
						: kindRaw?.toLowerCase() === 'ensip' ?
							ProposalType.Ensip
						:
							ProposalType.Eip
					),
					number: Number(numberRaw ?? 0),
				}
			})({ proposalId: params.proposalId })
		)}
		href={resolve('/(explore)/(proposals)/proposal/[proposalId]', params)}
	/>
</Page>
