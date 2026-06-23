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
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<Page>
	<HederaNftView
		selection={select(EntityType.HederaNft, data.selector)}
	/>
</Page>
