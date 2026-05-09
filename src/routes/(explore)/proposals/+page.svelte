<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalRealmsView from '$/views/ProposalRealmsView.svelte'
</script>


<Page>
		<ProposalRealmsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$proposalRealms',
		}}
		href={resolve('/proposals')}
		id="proposal-realms"
		title="Proposals"
	/>
</Page>

