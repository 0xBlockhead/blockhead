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
	import TronTokenView from '$/views/TronTokenView.svelte'
</script>


<Page>
	<TronTokenView
		selection={select(EntityType.TronToken, data.selector)}
	/>
</Page>
