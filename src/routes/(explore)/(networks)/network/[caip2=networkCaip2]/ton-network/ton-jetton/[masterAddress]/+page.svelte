<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TonJettonView from '$/views/TonJettonView.svelte'
</script>


<Page>
	<TonJettonView
		selection={select(EntityType.TonJetton, data.selector)}
	/>
</Page>
