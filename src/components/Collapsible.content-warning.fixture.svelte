<script lang="ts">
	// State
	let {
		selectorKey,
		warningText,
	}: {
		selectorKey: string
		warningText: string
	} = $props()
	let revealedSelectorKey = $state<string>()


	// Components
	import Collapsible from './Collapsible.svelte'
</script>


<Collapsible
	open={revealedSelectorKey === selectorKey}
	ontoggle={(event) => {
		revealedSelectorKey = event.currentTarget.open ? selectorKey : undefined
	}}
>
	{#snippet Summary()}
		<span>{warningText}</span>
	{/snippet}

	<p>Concealed body for {selectorKey}</p>
	<img
		src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
		alt="Concealed media for {selectorKey}"
	/>
</Collapsible>
