<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<Page>
	<EvmProtocolView
		selector={{
			scope: 'EvmProtocol',
		}}
	/>
</Page>
