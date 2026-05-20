<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import ActorView from '$/views/ActorView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<ActorView
		entityId={data.entityId}
		href={resolve('/account/[address]', {
			address: data.entityId.address,
		})}
	/>
</Page>
