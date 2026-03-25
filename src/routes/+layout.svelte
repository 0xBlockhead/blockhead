<script lang="ts">
	// Polyfills
	import '$/polyfills.ts'


	// State
	let {
		children,
	} = $props()


	// Components
	import favicon from '$/assets/favicon.svg'
</script>


<svelte:head>
	<link
		rel="icon"
		href={favicon}
	/>
</svelte:head>


{@render children()}
