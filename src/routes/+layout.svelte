<script lang="ts">
	// Polyfills
	import '$/polyfills.ts'


	// Styles
	import '$/styles/fonts.css'
	import '$/styles/colors.css'
	import '$/styles/reset.css'
	import '$/styles/components.css'


	// State
	let {
		children,
	} = $props()


	// Components
	import { asset } from '$app/paths'
</script>


<svelte:head>
	<link
		rel="icon"
		href={asset('/favicon.svg')}
	/>
</svelte:head>


{@render children()}
