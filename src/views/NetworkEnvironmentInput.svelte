<script lang="ts">
	// Types/constants — resolver catalog chrome (not live wallet chain)

	// Props
	let {
		label = 'Mainnet',
	}: {
		label?: string
	} = $props()
</script>


<div
	class="wallet-network-mainnet"
	data-row="align-center"
	role="status"
	aria-label="Network environment banner · separate from wallet chain; execution-layer forks vs beacon consensus vs post-merge naming"
>
	<span data-text="muted">{label}</span>
</div>
