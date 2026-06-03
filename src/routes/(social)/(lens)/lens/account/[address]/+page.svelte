<script lang="ts">
	// State
	let {
		params,
	} = $props()

	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
	const entityId = $derived.by(() => {
		const raw = decodeURIComponent(params.address).trim()
		const with0x = raw.startsWith('0x') ? raw : `0x${raw}`
		const address = (
			hexLowerOfByteSize(with0x, 20)
			?? (
				/^0x[a-fA-F0-9]{40}$/i.test(with0x) ?
					hexLowerOfByteSize(`0x${with0x.slice(2).toLowerCase()}`, 20)
				:
					undefined
			)
		)
		return address === undefined ? undefined : { address }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<Page>
	{#if entityId}
	<LensAccountView
		{entityId}
	/>
	{/if}
</Page>
