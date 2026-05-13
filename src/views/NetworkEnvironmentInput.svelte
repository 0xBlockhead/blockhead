<script lang="ts">
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
	aria-label="Network environment"
>
	<span data-text="muted">{label}</span>
</div>
