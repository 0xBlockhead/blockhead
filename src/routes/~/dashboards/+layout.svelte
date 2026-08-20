<script lang="ts">
	// State
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet
	} = $props()


	// Components
	import DashboardCreateControl from './DashboardCreateControl.svelte'
</script>


<div data-column="gap-4">
	<DashboardCreateControl />

	{@render children()}
</div>
