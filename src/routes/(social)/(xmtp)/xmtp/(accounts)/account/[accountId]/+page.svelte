<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<Page>
	<EvmAccountView
		entityId={{
			address: params.accountId as `0x${string}`,
		}}
	/>
</Page>
