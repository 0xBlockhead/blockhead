<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Props
	let {
		children,
		params,
	} = $props()

	const chainId = $derived(
		Number(params.networkId),
	)

	mountEntityResolveLive({
		entityType: EntityType.Network,
		entityId: () => ({ chainId }),
	})


	// State
	import { mountEntityResolveLive } from '$/lib/db/resolveLive.svelte.ts'
</script>


{@render children()}
