<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Functions
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
			?? with0x
		)
		return { address }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<Page>
	<LensPostsView
		href={resolve(
			'/(social)/(lens)/lens/account/[address]/(account)/posts',
			{ address: entityId.address },
		)}
		entityFieldReference={{
			entityType: EntityType.LensAccount,
			entityId,
			fieldName: '$$posts',
		}}
		id="lens-account-posts"
	/>
</Page>
