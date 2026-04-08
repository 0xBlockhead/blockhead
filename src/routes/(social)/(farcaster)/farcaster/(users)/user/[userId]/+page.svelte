<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		entityId={{ fid: Number(params.userId) }}
		href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', params)}
	>
		{#snippet children()}
			<section>
				<FarcasterCastsView
					id="casts"
					title="Casts"
					href={resolve('/farcaster/feed')}
					limit={50}
					parentEntityType={EntityType.FarcasterUser}
					parentEntityId={{
						fid: Number(params.userId),
					}}
				/>
			</section>
		{/snippet}
	</FarcasterUserView>
</Page>
