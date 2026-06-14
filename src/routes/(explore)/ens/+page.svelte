<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import EnsProtocolView from '$/views/EnsProtocolView.svelte'
</script>


<Page>
	<EnsProtocolView
		selector={{
			scope: 'EnsProtocol',
		}}
	/>
</Page>
