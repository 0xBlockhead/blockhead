<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<Page>
	<ProposalsView
		href={resolve('/proposals')}
		id="proposals"
	/>
</Page>
