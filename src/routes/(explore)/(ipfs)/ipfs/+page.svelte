<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<Page>
	<IpfsProtocolView
		entityId={{
			scope: 'IpfsProtocol',
		}}
	/>
</Page>
