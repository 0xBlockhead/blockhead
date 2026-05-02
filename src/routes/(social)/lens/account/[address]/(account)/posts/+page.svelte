<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived.by(() => {
		const raw = decodeURIComponent(params.address).trim()
		const with0x = raw.startsWith('0x') ? raw : `0x${raw}`
		const address = (
			/^0x[a-fA-F0-9]{40}$/i.test(with0x) ?
				`0x${with0x.slice(2).toLowerCase()}`
			:
				with0x
		) as `0x${string}`
		return { address }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<Page>
	<LensPostsView
		entityFieldReference={{
			entityType: EntityType.LensAccount,
			entityId,
			fieldName: '$$posts',
		}}
		href={resolve('/(social)/lens/account/[address]/(account)/posts', {
			address: entityId.address,
		})}
		id="lens-account-posts"
		open={true}
	/>
</Page>
