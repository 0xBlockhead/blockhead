<script lang="ts">
	// Props
	let {
		params,
	} = $props()

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
			?? with0x
		)
		return { address }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'


	// State
	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
</script>


<Page>
	<LensAccountView
		{entityId}
	/>
</Page>
