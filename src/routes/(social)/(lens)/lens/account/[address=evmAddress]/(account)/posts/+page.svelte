<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const selector = $derived.by(() => {
		const raw = decodeURIComponent(params.address).trim()
		if (raw.startsWith('legacy:'))
			return { legacyProfileId: raw.slice('legacy:'.length) }

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
		return address === undefined ? { localName: raw.replace(/^@/, '') } : { address }
	})


	// Functions
	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<Page>
	<LensAccountView
		selection={select(EntityType.LensAccount, selector)}
	/>
</Page>
