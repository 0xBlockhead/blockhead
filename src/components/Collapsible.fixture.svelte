<script lang="ts">
	// State
	let {
		itemKey,
		summary,
	}: {
		itemKey: string
		summary: string
	} = $props()
	let openItemKey = $state<string>()


	// Components
	import Collapsible from './Collapsible.svelte'
</script>


<Collapsible
	bind:open={
		() => openItemKey === itemKey,
		(_open) => {
			openItemKey = _open ? itemKey : undefined
		}
	}
>
	{#snippet Summary()}
		<span>{summary}</span>
	{/snippet}

	<p>Details for {itemKey}</p>
	<img
		src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
		alt="Details media for {itemKey}"
	/>
</Collapsible>
