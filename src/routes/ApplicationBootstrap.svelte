<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// State
	let {
		ready,
		children,
	}: {
		ready: Promise<void>
		children: Snippet
	} = $props()


	// Components
	import Boundary from '$/components/Boundary.svelte'
</script>


<Boundary boundaryKey="ApplicationBootstrap">
	{#await ready}
		<div
			data-card
			data-row
			role="status"
			aria-busy="true"
			aria-live="polite"
		>
			<p>
				Loading...
			</p>
		</div>
	{:then}
		{@render children()}
	{:catch error}
		<Boundary
			boundaryKey="ApplicationBootstrap"
			failure={{
				error,
			}}
		/>
	{/await}
</Boundary>
