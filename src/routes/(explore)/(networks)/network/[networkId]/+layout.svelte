<script lang="ts">
	// Types/constants
	import { useEntityFieldResolveLive } from '$/lib/db/resolveLive.svelte.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let {
		children,
		params,
	} = $props()

	const chainId = $derived(
		Number(params.networkId),
	)

	useEntityFieldResolveLive({
		entityType: EntityType.Network,
		entityId: () => ({ chainId }),
	})
</script>


{@render children()}
