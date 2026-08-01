<!-- Generated from APP.ts. -->

<script lang="ts">
	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title='Accounts'
>
	{@render children()}
</ParentPageCollapsible>
