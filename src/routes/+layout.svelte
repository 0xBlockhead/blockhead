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
	import favicon from '$/assets/favicon.svg'
</script>


<svelte:head>
	<link
		rel="icon"
		href={favicon}
	/>
</svelte:head>


{@render children()}
