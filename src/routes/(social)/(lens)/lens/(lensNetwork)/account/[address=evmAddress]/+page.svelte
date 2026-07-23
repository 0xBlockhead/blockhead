<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensAccount, data.selector, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			localName: true,
			legacyProfileId: true,
			$icon: true,
			displayName: true,
			createdAt: true,
			owner: true,
			score: true,
			iconUrl: true,
			bio: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.address) ?? '')].filter(Boolean).join(' ') || 'Lens account' : [String((({ ...data.selector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).localName) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).address) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).legacyProfileId) ?? '')].filter(Boolean).join(' ') || 'Lens account'))} • Lens account • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountView
		href={
			resolve('/lens/account/[address=evmAddress]', {
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
