<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


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
		id="proposal-realms"
		title="Proposals"
	/>
</Page>

