<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		selector={{ hex: '0x00000000' }}
	/>
</Page>
