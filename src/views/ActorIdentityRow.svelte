<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	import Address, { AddressFormat } from '$/views/Address.svelte'


	// Props
	let {
		entityId,
		network,
		ensName: ensNameProp,
		format = AddressFormat.MiddleTruncated,
		showAvatar = true,
	}: {
		entityId: EntityId<typeof schema, EntityType.Actor>
		network?: EntityId<typeof schema, EntityType.Network>
		ensName?: string
		format?: AddressFormat
		showAvatar?: boolean
	} = $props()
</script>


<Address
	actorId={entityId}
	{network}
	ensName={ensNameProp}
	format={format}
	showAvatar={showAvatar}
/>
