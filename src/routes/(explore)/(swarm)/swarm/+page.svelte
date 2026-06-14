<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<Page>
	<SwarmProtocolView
		selector={{
			scope: 'SwarmProtocol',
		}}
	/>
</Page>
